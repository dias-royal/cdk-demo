import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ViolationsTable } from "../../constructs/DynamoDB/ViolationsDB";
import { SaveViolation } from "../../constructs/Lambda/SaveViolation";
import { SentimentAnalysisLambda } from "../../constructs/Lambda/SentimentAnalysis";
import { NotifyCensorsTopic } from "../../constructs/SNS/NotifyCensor";
import { NotifyCensorLambda } from "../../constructs/Lambda/NotifyCensor";
import { SentimentAnalysisStepFunction } from "../../constructs/StepFunction/SentimentAnalysis";
import { InitiateSentimentAnalysisLambda } from "../../constructs/Lambda/InitiateSentimentAnalysis";
import {RecordingBucket} from "../../constructs/S3/Recordings";
import { ConfigProps } from "../../../pipelineConfig";

type EnvStackProps = StackProps & {
  config: ConfigProps
}

export class ViolationsStack extends Stack{
    constructor(scope: Construct, id: string, props: EnvStackProps){
        super(scope, id);

        const violationsTable = new ViolationsTable(this, 'ViolationsTable', props);
        const saveStatementLambda = new SaveViolation(
            this,
            'SaveViolationLambda',
            violationsTable,
          );
          const sentimentAnalysisLambda = new SentimentAnalysisLambda(
            this,
            'SentimentAnalysisLambda',
          );
          const notifyCensorsTopic = new NotifyCensorsTopic(
            this,
            'NotifyCensorsTopic',
            'jdias@rccl.com',
          );
          const notifyCensorLambda = new NotifyCensorLambda(
            this,
            'NotifyCensorLambda',
            notifyCensorsTopic.topic,
          );
          const sentimentAnalysisStepFunction = new SentimentAnalysisStepFunction(
            this,
            'SentimentAnalysisStepFunction',
            sentimentAnalysisLambda,
            saveStatementLambda.lambdaFunction,
            notifyCensorLambda.lambdaFunction
          );
          const initiateSentimentAnalysisLambda = new InitiateSentimentAnalysisLambda(
            this,
            'InitiateSentimentAnalysisLambda',
            sentimentAnalysisStepFunction,
        );
        const recordingBucket = new RecordingBucket(
            this,
            'RecordingBucket',
            initiateSentimentAnalysisLambda.lambdaFunction
        );

            // Grant sentimentAnalysisLambda permissions to read the recordingBucket
        recordingBucket.bucket.grantRead(sentimentAnalysisLambda);
    }
}