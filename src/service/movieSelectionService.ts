import { injectable, inject } from 'inversify';
import CLIENTS from '../constants/clients'
import { LocalDynamoClient } from '../client/localDynamoClient';
import { Movie } from '../resource/movie';
import { v4 } from 'uuid';
import { MovieValidator } from '../validator/movieValidator';

@injectable()
export class MovieSelectionService { 
    private _dbClient: LocalDynamoClient;
    constructor(
        @inject(CLIENTS.DYNAMO_CLIENT) localDynamoClient: LocalDynamoClient
    ) {
        this._dbClient = localDynamoClient;
    }
    
    async getAvailableMovies() {
        let availableMovies;

        try {
            availableMovies = await this._dbClient.scan();
        } catch (err) {
            console.log(err);
        }
        return availableMovies;
    }

    async getRandomMovie() {
        let availableMovies;
        try {
            availableMovies = await this._dbClient.scan();
        } catch (err) {
            console.log(err);
        }
        const randomIndex = Math.floor(Math.random() * availableMovies.length)
        return availableMovies[randomIndex]
    }

    async addMovie(movie: Movie) {
        movie.id = v4();
        const mv = new MovieValidator();
        mv.validate(movie);
        try {
            await this._dbClient.putItem(movie);
        } catch (err) {
            console.log(err);
        }
    }

    async patchMovie() {
        throw new Error('This enpoint ain\'t been implemented');
    }
} 