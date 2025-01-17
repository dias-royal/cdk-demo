import { Stack, StackProps } from "aws-cdk-lib";
import { ConfigProps } from "../../../../pipelineConfig";
import { Construct } from "constructs";
import { CICDPipeline } from "../../../constructs/Pipeline";

type EnvStackProps = StackProps & {
  config: ConfigProps
}

export class PipelineStack extends Stack{
    constructor(scope: Construct, id: string, props: EnvStackProps){
        super(scope, id);

        const pipeline = new CICDPipeline(this, props.config.PROJECT_NAME, props);
    }
}