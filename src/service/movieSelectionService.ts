import { injectable, inject } from 'inversify';
import CLIENTS from '../constants/clients'
import { LocalDynamoClient } from '../client/localDynamoClient';
import { Movie } from '../resource/movie';
import { v4 } from 'uuid';
import { MovieValidator } from '../validator/movieValidator';
import { BadRequestException } from '../errors/badRequestException';
import * as _ from 'underscore';
import * as jsonpatch from 'fast-json-patch';

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
        // return availableMovies.find(movie => movie.title === 'Warriors of Virtue')
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

    async patchMovie(movieId: string, patchOperation: any) {
        // fetch the specific movie from dynamo
        const existingMovie: Movie = await this._dbClient.scanById(movieId);

        let result;
        if (existingMovie) {
            const patchedMovie = jsonpatch.applyPatch(existingMovie,patchOperation, true);
            // this.validatePatchOp(patchOperation);
            // const patchedMovie = this.applyPatch(existingMovie, patchOperation);
            try{
                result = await this._dbClient.putItem(patchedMovie.newDocument);
            } catch (err) {
                throw new BadRequestException(err);
            }
        // validate patch request - make sure they're not changing the ID
        // persist movie to dynamo
        } else {
            // this should be a 404
            throw new BadRequestException(`Movie with ID ${movieId} was not found`);
        }
        return result;
    }

    private validatePatchOp(patchOperation: any):void {
        const allowedAttributes = [
            'poster',
            'title',
            'releaseYear',
            'hasBeenWatched',
            'category'
        ];

        for(const attribute in patchOperation) {
            if(!allowedAttributes.find(a => a === attribute)) {
                throw new BadRequestException(`${attribute} is not allowed`);
            }
        }
    }

    private applyPatch(movie: Movie, patchOperation: any): Movie {
        let patchedMovie: any = JSON.parse(JSON.stringify(movie)) // add type and fix this
        let exceptions = '';
        for(const key in patchOperation){
            if (_.has(patchedMovie, key)) {
                patchedMovie[key] = patchOperation[key];
            } else {
                exceptions += `| Property "${key}" is not allowed. |`;      
            }
        }


        if (exceptions.length > 0) {
            throw new BadRequestException(exceptions);
        }
        return patchedMovie;
    }
} 