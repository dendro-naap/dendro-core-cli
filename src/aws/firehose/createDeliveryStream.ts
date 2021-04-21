import * as AWS from 'aws-sdk';
import { AWSError } from 'aws-sdk';

const firehose = new AWS.Firehose();

export default function createDeliveryStream(DeliveryStreamName: string, BucketName: string, RoleARN: string): Promise<any> {
  return new Promise(resolve => {
    const params = {
      DeliveryStreamName, /* required */
      DeliveryStreamType: 'DirectPut',
      ExtendedS3DestinationConfiguration: {
        BucketARN: `arn:aws:s3:::${BucketName}`, /* required */
        RoleARN,
        BufferingHints: {
          IntervalInSeconds: 60,
        },
        CloudWatchLoggingOptions: {
          Enabled: true,
          LogGroupName: 'test-logger',
          LogStreamName: 'firehose-test-logger'
        },
      },
    };
    firehose.createDeliveryStream(params, (err: AWSError, data) => {
      if (err && err.code !== 'ResourceInUseException') throw new Error(String(err)); // an error occurred
      else resolve(data);     // successful response
    });
  });
}

