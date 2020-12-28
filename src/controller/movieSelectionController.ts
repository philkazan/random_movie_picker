import { MovieSelectionService } from '../service/movieSelectionService';

export class MovieSelectionController { 
    getAvailableMovies() {
        const service = new MovieSelectionService();
        return service.getAvailableMovies();
    }
    getRandomMovie() {
        const service = new MovieSelectionService();
        return service.getRandomMovie();
    }
}