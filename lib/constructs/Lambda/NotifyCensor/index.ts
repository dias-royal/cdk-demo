import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

export class NotifyCensorLambda extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, topic: sns.ITopic) {
    super(scope, id);

    this.lambdaFunction = new NodejsFunction(this, 'NotifyCensorHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: join(__dirname, 'code', 'index.ts'),
      environment: {
        TOPIC_ARN: topic.topicArn,
      },
    });

    this.lambdaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sns:Publish'],
        resources: [topic.topicArn],
      }),
    );
  }
}
