import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
    const parsedEvent = JSON.parse(event.body);
    const data = parsedEvent.data;
    const params = {
        TableName: process.env.tableName,
        // 'Key' defines the partition key of the item to be updated
        Key: {
            clientId: "4bda1740-5446-11eb-8d9a-19a4744d4dc6", // The id of the client from the path
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        //UpdateExpression: "SET phoneNumber = :phoneNumber, workout = :workout, latestMessage = list_append(latestMessage, :message)",
        UpdateExpression: "SET latestMessage = :latestMessage",
        ExpressionAttributeValues: {
            ":latestMessage": data.payload.text
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(params);

    return { status: true };
});