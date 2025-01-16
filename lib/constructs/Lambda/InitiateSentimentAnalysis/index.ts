import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { SentimentAnalysisStepFunction } from '../../StepFunction/SentimentAnalysis';

export class InitiateSentimentAnalysisLambda extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(
    scope: Construct,
    id: string,
    stepFunction: SentimentAnalysisStepFunction,
    
  ) {
    super(scope, id);

    const region = cdk.Stack.of(this).region;
    const account = cdk.Stack.of(this).account;

    const bucket = new s3.Bucket(this, 'MyBucket');

    this.lambdaFunction = new NodejsFunction(
      this,
      'InitiateSentimentAnalysisHandler',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler',
        entry: join(__dirname, 'code', 'index.ts'),
        environment: {
          STATE_MACHINE_ARN: stepFunction.statemachine.stateMachineArn,
          SENTIMENT_ANALYSIS_STEP_FUNCTION_ARN: stepFunction.statemachine.stateMachineArn,
        },
      },
    );

    bucket.grantRead(this.lambdaFunction);
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(this.lambdaFunction),
    );

    this.lambdaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['states:StartExecution'],
        resources: [
          stepFunction.statemachine.stateMachineArn,
        ],
      }),
    );
  }
}