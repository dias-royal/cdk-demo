import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { SourceAccessConfigurationType } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import { ConfigProps } from "../../../../pipelineConfig";

interface EnvStackProps{
    config: ConfigProps
}

export class ViolationsTable extends Construct {
    public table: Table;
    constructor(scope: Construct, id: string, props: EnvStackProps){
        super(scope, id);

        this.table = new Table(this, 'ViolationsTable', {
            tableName: 'violationsTable',
            partitionKey: {name: 'id', type: AttributeType.STRING},
            billingMode: BillingMode.PAY_PER_REQUEST,
            encryption: cdk.aws_dynamodb.TableEncryption.AWS_MANAGED,
            sortKey: {name: 'statement', type: AttributeType.STRING},
            removalPolicy: props.config.NODE_ENV == 'Production'? cdk.RemovalPolicy.RETAIN: cdk.RemovalPolicy.DESTROY
        })
    }
} 