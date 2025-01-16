#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ViolationsStack } from '../lib/stacks/infrastuctureStack';
import { getConfig } from '../pipelineConfig';

const config = getConfig();
const app = new cdk.App();

console.log(process.env.CDK_MODE);

if(['ONLY_PIPELINE'].includes(process.env.CDK_MODE || 'Sandbox')){
  //Create pipeline stack
}else{
  new ViolationsStack(app, 'ViolationStack', {
    config
});
}

app.synth();