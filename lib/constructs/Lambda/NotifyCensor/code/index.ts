import * as AWS from 'aws-sdk';
const sns = new AWS.SNS();

exports.handler = async (event: any) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const topicArn = process.env.TOPIC_ARN;

  const params = {
    Message: 'A new violation has been detected.',
    TopicArn: topicArn,
  };

  try {
    const data = await sns.publish(params).promise();
    console.log('Message sent to SNS topic:', data);
  } catch (err) {
    console.error('Error sending message to SNS topic:', err);
    throw err;
  }
};
