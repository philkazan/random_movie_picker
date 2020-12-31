import { Movie } from '../resource/movie';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export class MovieSelectionService { 
    async getAvailableMovies() {
        const credentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }

        const client = new DynamoDBClient({ credentials, region: "us-east-1" });
        const command = new ScanCommand({
            TableName: "random-movie-picker-movies"
        });

        let availableMovies;

        try {
            availableMovies = await client.send(command);
            console.log(`Returned movie count: ${availableMovies.ScannedCount}`);
        } catch (err) {
            console.log(err);
        }
        let unmarshalled = availableMovies.Items.map(m => unmarshall(m) );
        return unmarshalled;
    }

    async getRandomMovie() {
        const credentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }

        const client = new DynamoDBClient({ credentials, region: "us-east-1" });
        const command = new ScanCommand({
            TableName: "random-movie-picker-movies"
        });

        let availableMovies;

        try {
            availableMovies = await client.send(command);
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