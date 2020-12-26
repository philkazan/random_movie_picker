import { MovieSelectionService } from '../service/movieSelectionService';

export class MovieSelectionController { 
    getMoviePoster(movieTitle: string) {
        const service = new MovieSelectionService();
        return service.getMoviePoster(movieTitle);
    }
    getAvailableMovies() {
        const service = new MovieSelectionService();
        return service.getAvailableMovies();
    }
    getRandomMovie() {
        const service = new MovieSelectionService();
        return service.getRandomMovie();
    }
}