require('dotenv').config();
import 'reflect-metadata';
import * as Koa from 'koa';
import * as Router from '@koa/router';
import { Container, decorate } from 'inversify';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { Client } from '@aws-sdk/smithy-client';
import CLIENTS from './constants/clients';
import CONFIGS from './constants/configs';
import CONTROLLERS from './constants/controllers';
import SERVICES from './constants/services';
import * as NConf from 'nconf';

import { LocalDynamoClient, LocalDynamoConfig } from './client/localDynamoClient'
import { MovieSelectionController } from './controller/movieSelectionController';
import { MovieSelectionService } from './service/movieSelectionService';
import { injectable, unmanaged } from 'inversify';


const app = new Koa();
const router = new Router();
const container = new Container();

// decorate(injectable(), Client);
// decorate(injectable(), DynamoDBClient);

//TODO put this in a config or something
// TODO find a less redundant way to add the CORS response headers
const DynamoClientConfig: DynamoDBClientConfig = {
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
}

container.bind(CONFIGS.DYNAMO_CLIENT_CONFIG).toConstantValue(DynamoClientConfig);
container.bind<DynamoDBClientConfig>(CLIENTS.DYNAMO_CLIENT).to(LocalDynamoClient);

container.bind(CONTROLLERS.PRIMARY).to(MovieSelectionController);
container.bind(SERVICES.PRIMARY).to(MovieSelectionService);

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
    ctx.body = await controller.getRandomMovie(); 
})

// router.post('/movie', async (ctx, next) => {
//     const controller = new MovieSelectionController();
//     ctx.set('Access-Control-Allow-Origin', '*');
//     ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     ctx.set('Access-Control-Allow-Methods', 'GET');
//     ctx.body = await controller.addMovie(); 
// })

// router.put('/movie', async (ctx, next) => {
//     const controller = new MovieSelectionController();
//     ctx.set('Access-Control-Allow-Origin', '*');
//     ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     ctx.set('Access-Control-Allow-Methods', 'GET');
//     ctx.body = await controller.patchMovie(); 
// })

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