require('dotenv').config();
import 'reflect-metadata';
import axios from 'axios';
import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as Cors from '@koa/cors';
import { Container } from 'inversify';
import * as bodyParser from 'koa-bodyparser';
import CLIENTS from './constants/clients';
import CONFIGS from './constants/configs';
import CONTROLLERS from './constants/controllers';
import SERVICES from './constants/services';

import { LocalDynamoClient } from './client/localDynamoClient'
import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { MovieSelectionController } from './controller/movieSelectionController';
import { MovieSelectionService } from './service/movieSelectionService';


const app = new Koa();
const router = new Router();
const container = new Container();
// TODO put this in a config or something
// TODO find a less redundant way to add the CORS response headers
// Add Category property to Movie objects
// extend randomMovie endpoint to take Category query param
const DynamoClientConfig: DynamoDBClientConfig = {
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
}

container.bind<DynamoDBClientConfig>(CONFIGS.DYNAMO_CLIENT_CONFIG).toConstantValue(DynamoClientConfig);
container.bind<LocalDynamoClient>(CLIENTS.DYNAMO_CLIENT).to(LocalDynamoClient);

container.bind(CONTROLLERS.PRIMARY).to(MovieSelectionController);
container.bind(SERVICES.PRIMARY).to(MovieSelectionService);

app.use(bodyParser());

router.get('/availableMovies', async (ctx, next) => {
    const controller: MovieSelectionController = container.get(CONTROLLERS.PRIMARY);
    ctx.body = await controller.getAvailableMovies(); 
});

router.get('/updateMovies', async (ctx, next) => {
    const controller: MovieSelectionController = container.get(CONTROLLERS.PRIMARY);
    const movies = await controller.getAvailableMovies();
    for(let i=0; i< movies.length; i++) {
        const result = await (await axios.get(`https://www.omdbapi.com/?t=${movies[i].title}&y=${movies[i].releaseYear}&apikey=95dd8229`))?.data;
        // overwrite dynamo entry with result from omdbapi...mostly
        if (result.Response !== 'False') {
            movies[i].genre = result['Genre'];
            movies[i].plot = result['Plot'];
            movies[i].director = result['Director'];
            movies[i].rtRating = result['Ratings']?.find(rating => rating.Source === "Rotten Tomatoes")?.Value || "N/A";
            movies[i].imdbRating = result['imdbRating'] || 'N/A';
            movies[i].mcRating = result['Metascore'] || 'N/A';
            movies[i].runTime = result['RunTime'] || 'N/A';
            movies[i].actors = result['Actors'] || 'N/A';
            movies[i].poster = result['Poster'];
            movies[i].released = result['Released'] || movies[i].released;
            movies[i].genre = result['Genre'];
            const response = await controller.addMovie(movies[i]);
            console.log(`Updated ${response.title}`);
        }
    }

})

router.get('/randomMovie', async (ctx, next) => {
    const controller: MovieSelectionController = container.get(CONTROLLERS.PRIMARY);
    try {
        ctx.body = await controller.getRandomMovie(ctx.request.query); 
    } catch(e) {
        ctx.status = e.code;
        ctx.body = e.message;
    }
});

router.get('/categories', async (ctx, next) => {
    ctx.body = [
        { 
            value: '00sMoviesWeLoved',
            display: '00s Movies we Loved '
        },
        { 
            value: '00sMoviesThatScaredUs',
            display: '00s Movies that scared us (non-horror)'
        },
        { 
            value: '90sMoviesWeLoved',
            display: '90s Movies we Loved '
        },
        { 
            value: '90sMoviesThatScaredUs',
            display: '90s Movies that scared us (non-horror)'
        },
        { 
            value: '80sMoviesWeLoved',
            display: '80s Movies we Loved '
        },
        { 
            value: '80sMoviesThatScaredUs',
            display: '80s Movies that scared us (non-horror)'
        }
    ]
});

router.get('/movie/:id', async(ctx, next) => {
  const controller: MovieSelectionController = container.get(CONTROLLERS.PRIMARY);
  try {
    ctx.body = await controller.getMovieById(ctx.params.id); 
  } catch(e) {
    ctx.status = e.code;
    ctx.body = e.message;
  }
});

router.post('/movie', async (ctx, next) => {
    const controller: MovieSelectionController = container.get(CONTROLLERS.PRIMARY);
    ctx.status = 201;
    try {
        ctx.body = await controller.addMovie(ctx.request.body); 
    } catch (e) {
        ctx.status = e.code;
        ctx.body = e.message;
    }
});

router.patch('/movie/:id', async (ctx, next) => {
    const controller: MovieSelectionController = container.get(CONTROLLERS.PRIMARY);
    ctx.body = await controller.patchMovie(ctx.params.id, ctx.request.body); 
});

router.get('/health', (ctx, next) => {
    ctx.body = {
        "serviceName": "random_movie_picker",
        "serviceVersion": "0.0.6"
    }
});


app
  .use(Cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 3000);