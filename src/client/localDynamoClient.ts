import { DynamoDBClient, PutItemCommand, ScanCommand, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { injectable, inject } from 'inversify';
import { Movie} from '../resource/movie';
import CONFIGS from '../constants/configs'

@injectable()
export class LocalDynamoClient {

    private _client: DynamoDBClient;

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
    async putItem(movie: any) {
        marshall(movie)
        const command = new PutItemCommand({
            TableName: "random-movie-picker-movies",
            Item: marshall(movie)
        });
        const response = await this._client.send(command);
    }
}