import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class NotifyCensorsTopic extends Construct {
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string, email: string) {
    super(scope, id);

    this.topic = new sns.Topic(this, 'NotifyCensorsTopic', {
      displayName: 'Notify Censors Topic',
    });

    this.topic.addSubscription(new sns_subscriptions.EmailSubscription(email));
  }
}
