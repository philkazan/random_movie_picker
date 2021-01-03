import { Movie } from '../resource/movie';
import { MovieSelectionService } from '../service/movieSelectionService';
import * as SERVICES from '../constants/services';
import { inject, injectable } from 'inversify';

@injectable()
export class MovieSelectionController { 
    private _movieSelectionService: MovieSelectionService;
    constructor(
        @inject(SERVICES.SERVICES.PRIMARY) MovieSelectionService
    ) {
        this._movieSelectionService = MovieSelectionService;
    }
    async getAvailableMovies() {
        return this._movieSelectionService.getAvailableMovies();
    }
    async getRandomMovie() {
        return this._movieSelectionService.getRandomMovie();
    }
    async addMovie() {
        return this._movieSelectionService.addMovie();
    }
    async patchMovie() {
        return this._movieSelectionService.patchMovie();
    }

}