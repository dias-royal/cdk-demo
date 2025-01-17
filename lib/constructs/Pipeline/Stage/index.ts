import { StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ViolationsStack } from "../../../stacks/infrastuctureStack";
import { ConfigProps } from "../../../../pipelineConfig";

type EnvStackProps = StackProps & {
  config: ConfigProps
}


export class InfrastructureStage extends Stage{
    constructor(scope: Construct, id: string, props: EnvStackProps){
        super(scope, id, props)

        new ViolationsStack(this, `${props.config.PROJECT_NAME}-Stacks`, props);
    }
}