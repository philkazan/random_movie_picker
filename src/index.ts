import * as Koa from 'koa';
import * as Router from '@koa/router';
import { MovieSelectionController } from './controller/movieSelectionController';

const app = new Koa();
const router = new Router();

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

router.post('/movie', async (ctx, next) => {
    const controller = new MovieSelectionController();
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    ctx.body = await controller.addMovie(); 
})

router.put('/movie', async (ctx, next) => {
    const controller = new MovieSelectionController();
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    ctx.body = await controller.patchMovie(); 
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