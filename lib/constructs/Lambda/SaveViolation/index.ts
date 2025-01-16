import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { join } from 'path';
import { ViolationsTable } from '../../DynamoDB/ViolationsDB';

export class SaveViolation extends Construct {
  public readonly lambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, violations: ViolationsTable) {
    super(scope, id);

    this.lambdaFunction = new NodejsFunction(this, 'SaveViolationHandler', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: join(__dirname, 'code', 'index.ts'),
      environment: {
        TABLE_NAME: violations.table.tableName,
      },
    });

    violations.table.grantReadWriteData(this.lambdaFunction);

    this.lambdaFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:PutItem', 'dynamodb:GetItem'],
        resources: [violations.table.tableArn],
      }),
    );
  }
}
