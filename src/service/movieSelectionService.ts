import { injectable, inject } from 'inversify';
import CLIENTS from '../constants/clients'
import { LocalDynamoClient } from '../client/localDynamoClient';
import { Movie } from '../resource/movie';
import { v4 } from 'uuid';
import { MovieValidator } from '../validator/movieValidator';
import { BadRequestException } from '../errors/badRequestException';

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

    async getRandomMovie(queryOptions) {
        this.validateQueryParams(queryOptions);
        let availableMovies;
        try {
            availableMovies = await this._dbClient.query(queryOptions);
        } catch (err) {
            console.log(err);
        }
        const randomIndex = Math.floor(Math.random() * availableMovies.length)
        return availableMovies[randomIndex]
    }

    private validateQueryParams(queryOptions) {
        // needs to have CATEGORY
        // CATEGORY needs to be one of the three values
        // 90s Movies we Loved - 90sMoviesWeLoved
        // 90s Movies that scared us (non-horror) - 90sMoviesThatScaredUs
        // 80s Movies we Loved - 00sMoviesWeLoved
        // 80s Movies that scared us (non-horror) - 80sMoviesThatScaredUs
        const allowList = [
            '90sMoviesWeLoved',
            '90sMoviesThatScaredUs',
            '80sMoviesWeLoved',
            '80sMoviesThatScaredUs'
        ];
        const noArgMsg = '"Category" parameter is required.';
        const wrongArgMsg = `"Category" must be one of the following: ${allowList}`;
        if (!queryOptions.category) throw new BadRequestException(noArgMsg);
        if (!allowList.find( e => e === queryOptions.category)) {
            // throw new Error(wrongArgMsg);
            throw new BadRequestException(wrongArgMsg);
        }
    }

    // async addMovie(movie: Movie) {
    //     movie.id = v4();
    //     const mv = new MovieValidator();
    //     mv.validate(movie);
    //     let result;
    //     try {
    //         result = await this._dbClient.putItem(movie);
    //     } catch (err) {
    //         console.log(err);
    //     }
    //     return result;
    // }

    // async patchMovie() {
    //     throw new Error('This enpoint ain\'t been implemented');
    // }
} 