import * as Koa from 'koa';
import * as Router from '@koa/router';
import { Container } from 'inversify';
import { CLIENTS } from './constants/clients';
import { CONFIGS } from './constants/configs';
import { CONTROLLERS } from './constants/controllers';
import { SERVICES } from './constants/services';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import * as NConf from 'nconf';

import { MovieSelectionController } from './controller/movieSelectionController';
import { MovieSelectionService } from './service/movieSelectionService';


const app = new Koa();
const router = new Router();
const container = new Container();

//TODO put this in a config or something
// TODO find a less redundant way to add the CORS response headers
const DynamoClientConfig = {
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

NConf.file('default', { file: `${__dirname}/config/default.json` });
container.bind(CONFIGS.DYNAMO_CLIENT_CONFIG).toConstantValue(DynamoClientConfig);
container.bind(CLIENTS.DYNAMO_CLIENT).to(DynamoDBClient);

container.bind(CONTROLLERS.PRIMARY).to(MovieSelectionController);
container.bind(SERVICES.PRIMARY).to(MovieSelectionService);

router.get('/availableMovies', async (ctx, next) => {
    const controller = new MovieSelectionController();
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    ctx.body = await controller.getAvailableMovies(); 
})

router.get('/randomMovie', async (ctx, next) => {
    const controller = new MovieSelectionController();
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