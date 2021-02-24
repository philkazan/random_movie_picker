require('dotenv').config();
import 'reflect-metadata';
import * as Koa from 'koa';
import * as Router from '@koa/router';
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
import { BadRequestException } from './exceptions/badRequestException';
import { createTextChangeRange } from 'typescript';


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
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    ctx.body = await controller.getAvailableMovies(); 
})

router.get('/randomMovie', async (ctx, next) => {
    const controller: MovieSelectionController = container.get(CONTROLLERS.PRIMARY);
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    try {
        ctx.body = await controller.getRandomMovie(ctx.request.query); 
    } catch(e) {
        ctx.status = e.code;
        ctx.body = e.message;
    }
})

router.get('/categories', async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'GET');
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

// router.post('/movie', async (ctx, next) => {
//     const controller: MovieSelectionController = container.get(CONTROLLERS.PRIMARY);
//     ctx.set('Access-Control-Allow-Origin', '*');
//     ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     ctx.set('Access-Control-Allow-Methods', 'GET');
//     ctx.body = await controller.addMovie(ctx.request.body); 
// })

router.patch('/movie/:id', async (ctx, next) => {
    const controller: MovieSelectionController = container.get(CONTROLLERS.PRIMARY);
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    ctx.body = await controller.patchMovie(ctx.params.id, ctx.request.body); 
})

router.get('/health', (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    ctx.body = {
        "serviceName": "random_movie_picker",
        "serviceVersion": "0.0.2"
    }
})

// router.get('/poster/:posterId', (ctx, next) => {
//     const controller = new MovieSelectionController();
//     ctx.body = controller.getMoviePoster(ctx.params.posterId);
// })


app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 3000);