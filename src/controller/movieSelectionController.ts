import { Movie } from '../resource/movie';
import { MovieSelectionService } from '../service/movieSelectionService';

export class MovieSelectionController { 
    async getAvailableMovies() {
        const service = new MovieSelectionService();
        return service.getAvailableMovies();
    }
    async getRandomMovie() {
        const service = new MovieSelectionService();
        return service.getRandomMovie();
    }
    async addMovie() {
        const service = new MovieSelectionService();
        return service.addMovie();
    }
    async patchMovie() {
        const service = new MovieSelectionService();
        return service.patchMovie();
    }

}