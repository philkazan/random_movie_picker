import { Movie } from '../resource/movie';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { injectable, inject } from 'inversify';
import CLIENTS from '../constants/clients'
import { LocalDynamoClient } from '../client/localDynamoClient';

@injectable()
export class MovieSelectionService { 
    private _dbClient;
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

    async addMovie() {
        throw new Error('This enpoint ain\'t been implemented');
    }

    async patchMovie() {
        throw new Error('This enpoint ain\'t been implemented');
    }
} 