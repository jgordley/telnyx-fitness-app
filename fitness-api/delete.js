import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key of the item to be removed
    Key: {
      clientId: event.pathParameters.id, // The id of the client from the path
    },
  };

  await dynamoDb.delete(params);

  return { status: true };
});