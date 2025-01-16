import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class SentimentAnalysisLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props?: NodejsFunctionProps) {
    super(scope, id, {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler', 
      entry: join(__dirname, 'code', 'index.ts'), 
      ...props,
    });

    this.addToRolePolicy(
      new PolicyStatement({
        actions: ['comprehend:DetectSentiment'],
        resources: ['*'],
      }),
    );
  }
}
