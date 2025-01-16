import * as AWS from 'aws-sdk';
const sns = new AWS.SNS();
const stepfunctions = new AWS.StepFunctions();

exports.handler = async (event: any) => {
  // Log the entire event received from S3
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  // Define the input for the Step Function
  const input = JSON.stringify(event, null, 2);

  console.log(`Data sent to the Step function: ${input}`);

  // Define the parameters for the Step Function start execution
  const stateMachineArn = process.env.SENTIMENT_ANALYSIS_STEP_FUNCTION_ARN;
  if (!stateMachineArn) {
    throw new Error('SENTIMENT_ANALYSIS_STEP_FUNCTION_ARN is not defined');
  }
  const params = {
    stateMachineArn: stateMachineArn,
    input: JSON.stringify(input),
  };

  try {
    // Start the Step Function execution
    const data = await stepfunctions.startExecution(params).promise();
    console.log(`Step Function started successfully: ${data.executionArn}`);
  } catch (error) {
    console.error(`Error starting Step Function: ${error}`);
  }
};
