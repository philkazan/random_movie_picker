import { Movie } from '../resource/movie';
import { MovieSelectionService } from '../service/movieSelectionService';
import SERVICES from '../constants/services';
import { inject, injectable } from 'inversify';

@injectable()
export class MovieSelectionController { 
    private _movieSelectionService: MovieSelectionService;
    constructor(@inject(SERVICES.PRIMARY) MovieSelectionService) {
        this._movieSelectionService = MovieSelectionService;
    }
    async getAvailableMovies() {
        return this._movieSelectionService.getAvailableMovies();
    }
    async getRandomMovie(queryOptions) {
        return this._movieSelectionService.getRandomMovie(queryOptions);
    }
    // async addMovie(movie: Movie) {
    //     return this._movieSelectionService.addMovie(movie);
    // }
    async patchMovie(movieId: string, patchOperation: any) {
        return this._movieSelectionService.patchMovie(movieId, patchOperation);
    }

}