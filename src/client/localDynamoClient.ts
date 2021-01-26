import { DynamoDBClient, PutItemCommand, ScanCommand, DynamoDBClientConfig, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { injectable, inject } from 'inversify';
import { Movie} from '../resource/movie';
import CONFIGS from '../constants/configs'

@injectable()
export class LocalDynamoClient {

    private _client: DynamoDBClient;
    // Are KeyConditionExpressions necessary?
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

    async query(queryParams): Promise<any> {
        const command = new QueryCommand({
            TableName: "random-movie-picker-movies",
            KeyConditionExpression: 'category = :category',
            ExpressionAttributeValues: {
                ':category': { 'S': queryParams.category}
            },
            IndexName: 'category-index'
        });

        const response = await this._client.send(command);
        return response.Items.map(m => unmarshall(m))
    }

    // async putItem(movie: Movie): Promise<Movie> {
    //     const command = new PutItemCommand({
    //         TableName: "random-movie-picker-movies",
    //         Item: marshall(movie),
    //         ReturnValues: "ALL_OLD"
    //     });
    // await this._client.send(command);
    // return movie;
    // }
}