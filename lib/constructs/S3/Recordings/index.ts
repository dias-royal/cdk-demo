
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

export class RecordingBucket extends Construct {
    public bucket: s3.Bucket;
    constructor(
        scope: Construct,
        id: string,
        initiateSentimentAnalysisLambda: lambda.IFunction
      ) {
        super(scope, id);

        this.bucket = new s3.Bucket(this, 'RecordingBucket', {
          versioned: true,
          bucketName: 'pete-recording-bucket',
          encryption: s3.BucketEncryption.S3_MANAGED,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          publicReadAccess: false,
          lifecycleRules: [
            {
              transitions: [
                {
                  storageClass: s3.StorageClass.INTELLIGENT_TIERING,
                  transitionAfter: cdk.Duration.days(0),
                },
              ],
            },
          ],
        });

        this.bucket.addEventNotification(
            s3.EventType.OBJECT_CREATED,
            new s3n.LambdaDestination(initiateSentimentAnalysisLambda),
        )
      }
}