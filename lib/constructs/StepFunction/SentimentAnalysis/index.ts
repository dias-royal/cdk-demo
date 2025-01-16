import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class SentimentAnalysisStepFunction extends Construct {
  public statemachine: sfn.StateMachine;

  constructor(scope: Construct, id: string,
        sentimentAnalysisLambda: NodejsFunction,
        saveStatementLambda: NodejsFunction,
        notifyCensorLambda: NodejsFunction 
  ) {
    super(scope, id);

    const sentimentAnalysisTask = new tasks.LambdaInvoke(
      this,
      'Invoke Sentiment Analysis Lambda',
      {
        lambdaFunction: sentimentAnalysisLambda,
        outputPath: '$.Payload',
      },
    );

    const saveViolationTask = new tasks.LambdaInvoke(
      this,
      'Invoke Save Violation Lambda',
      {
        lambdaFunction: saveStatementLambda,
        outputPath: '$.Payload',
      },
    );

    const notifyCensorTask = new tasks.LambdaInvoke(
      this,
      'Invoke Notify Censor Lambda',
      {
        lambdaFunction: notifyCensorLambda,
        outputPath: '$.Payload',
      },
    );

    const definition = sentimentAnalysisTask
      .addCatch(saveViolationTask, {
        resultPath: '$.error-info',
      })
      .next(saveViolationTask)
      .next(notifyCensorTask);

    this.statemachine = new sfn.StateMachine(
      this,
      'SentimentAnalysisStateMachine',
      {
        definition,
        timeout: cdk.Duration.minutes(5),
      },
    );
  }
}
