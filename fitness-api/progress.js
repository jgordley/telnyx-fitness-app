import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
    const parsedEvent = JSON.parse(event.body);
    const data = parsedEvent.data;
    console.log(data);
    const number = data.payload.from.phone_number;
    const text = data.payload.text;

    // Check all clients to see who's phone number
    const result = await dynamoDb.scan({
        TableName: process.env.tableName
    });

    let id;
    //console.log(result);
    result.Items.forEach(element => {
        if(element.phoneNumber == number) {
            id = element.clientId;
        }
    });

    if(!id) {
        return {status: false};
    }

    const params = {
        TableName: process.env.tableName,
        // 'Key' defines the partition key of the item to be updated
        Key: {
            clientId: id, // The id of the client from the path
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET #LatestMessage = list_append(#LatestMessage, :message)",
        ExpressionAttributeNames: {
            '#LatestMessage': 'latestMessage'
        },
        ExpressionAttributeValues: {
            ":message": [text]
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(params);

    return { status: true };
});