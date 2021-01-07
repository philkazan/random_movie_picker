import { DynamoDBClient, ScanCommand, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Movie } from '../resource/Movie';
import { injectable, inject } from 'inversify';
import CONFIGS from '../constants/configs'

export interface LocalDynamoConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

@injectable()
export class LocalDynamoClient {

    private _client: DynamoDBClient;
    private _config;

    constructor(@inject(CONFIGS.DYNAMO_CLIENT_CONFIG)config: DynamoDBClientConfig) {
        this._client = new DynamoDBClient(config);
    }
    async scan(): Promise<any> {
        const command = new ScanCommand({
            TableName: "random-movie-picker-movies"
        });
        const response = await this._client.send(command);
        return response.Items.map(m => unmarshall(m) );
    }
}