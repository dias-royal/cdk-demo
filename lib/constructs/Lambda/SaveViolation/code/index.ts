import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = 'ViolationsTable';

exports.handler = async (event: any) => {
  const { id, recipe, firstName } = event;

  const params = {
    TableName: TABLE_NAME,
    Item: {
      id,
      recipe,
      firstName,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Violation saved successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Violation saving recipe.',
        error: (error as Error).message,
      }),
    };
  }
};
