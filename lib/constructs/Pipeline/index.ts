import { Construct } from 'constructs';
import { ConfigProps } from '../../../pipelineConfig';
import { BuildSpec, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { InfrastructureStage } from './Stage';

interface EnvStackProps {
    config: ConfigProps;
}

export class CICDPipeline extends Construct {
    constructor(scope: Construct, id: string, props: EnvStackProps) {
        super(scope, id);

        // Retrieve the GitHub token from Secrets Manager
        const gitHubToken = Secret.fromSecretNameV2(this, 'GitHubToken', props.config.GIT_TOKEN_NAME);

        // Create the pipeline
        const pipeline = new CodePipeline(this, `${props.config.PROJECT_NAME}-Pipeline`, {
            pipelineName: `${props.config.PROJECT_NAME}-Pipeline`,
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub(`${props.config.GIT_OWNER}/${props.config.GIT_REPO}`, `${props.config.BRANCH}`, {
                    authentication: gitHubToken.secretValue,
                }),
                commands: [
                    'npm ci',
                    'npm run cdk:synth'
                ],
                primaryOutputDirectory: 'cdk.out',
            })
        });

        const testStage = pipeline.addStage(new InfrastructureStage(this, `${props.config.PROJECT_NAME}-Stage`, props));
    }
}