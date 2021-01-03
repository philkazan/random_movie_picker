import { Movie } from '../resource/movie';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { injectable, inject } from 'inversify';
import * as CONSTANTS from '../constants/clients'

@injectable()
export class MovieSelectionService { 
    private _dbClient: DynamoDBClient;
    constructor(
        @inject(CONSTANTS.CLIENTS.DYNAMO_CLIENT) dynamoDBClient: DynamoDBClient
    ) {
        this._dbClient = dynamoDBClient;
    }

    async getAvailableMovies() {
        const command = new ScanCommand({
            TableName: "random-movie-picker-movies"
        });

        let availableMovies;

        try {
            availableMovies = await this._dbClient.send(command);
        } catch (err) {
            console.log(err);
        }
        return availableMovies.Items.map(m => unmarshall(m) );
    }

    async getRandomMovie() {
        const command = new ScanCommand({
            TableName: "random-movie-picker-movies"
        });

        let availableMovies;

        try {
            availableMovies = await this._dbClient.send(command);
            console.log(`Returned movie count: ${availableMovies.ScannedCount}`);
        } catch (err) {
            console.log(err);
        }
        const randomIndex = Math.floor(Math.random() * availableMovies.Items.length)
        return unmarshall(availableMovies.Items[randomIndex]);
    }

    async addMovie() {
        throw new Error('This enpoint ain\'t been implemented');
    }

    async patchMovie() {
        throw new Error('This enpoint ain\'t been implemented');
    }
} 