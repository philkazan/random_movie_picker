import * as Koa from 'koa';
import * as Router from '@koa/router';
import { MovieSelectionController } from './controller/movieSelectionController';

const app = new Koa();
const router = new Router();

router.get('/availableMovies', (ctx, next) => {
    const controller = new MovieSelectionController();
    ctx.body = controller.getAvailableMovies(); 
})

router.get('/randomMovie', (ctx, next) => {
    const controller = new MovieSelectionController();
    ctx.body = controller.getRandomMovie(); 
})

router.get('/poster/:posterId', (ctx, next) => {
    const controller = new MovieSelectionController();
    ctx.body = controller.getMoviePoster(ctx.params.posterId);
})



app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);