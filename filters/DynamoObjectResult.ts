export class DynamoResultObject{
    Count: number;
    ExpressionAttributeValues: any;
    ExpressionAttributeNames: any;
    ResString: string;

    constructor(count: number, expressionAttributeNames: any, expressionAttributeValues: any, resString: string) {
        this.Count = count;
        this.ExpressionAttributeValues = expressionAttributeValues;
        this.ExpressionAttributeNames = expressionAttributeNames;
        this.ResString = resString;
    }
}