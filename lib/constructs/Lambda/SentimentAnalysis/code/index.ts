import * as AWS from 'aws-sdk';
const s3 = new AWS.S3();
const comprehend = new AWS.Comprehend();

exports.handler = async (event: any) => {
  // Log the entire event received from Step Function
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Extract bucket name and object key from the S3 event
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  // Retrieve the text from the S3 object
  let text: string;
  try {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    const data = await s3.getObject(params).promise();
    if (!data.Body) {
      throw new Error('S3 object Body is undefined');
    }
    text = data.Body.toString('utf-8');
    console.log('Retrieved text from S3 object:', text);
  } catch (error) {
    console.error('Error retrieving text from S3 object:', error);
    throw new Error('Error retrieving text from S3 object');
  }

  console.log(`Test sent to Comprehend: ${text}`);
  
  // Send the text to AWS Comprehend
  try {
    const comprehendParams = {
      Text: text,
      LanguageCode: 'en',
    };
    const comprehendData = await comprehend.detectSentiment(comprehendParams).promise();
    console.log('Sentiment analysis result:', JSON.stringify(comprehendData, null, 2));
    return comprehendData;
  } catch (error) {
    console.error('Error detecting sentiment:', error);
    throw new Error('Error detecting sentiment');
  }
};
