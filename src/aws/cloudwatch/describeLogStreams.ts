import { AWSError } from 'aws-sdk';

import { AWS_CLOUDWATCH } from '../../constants';
import store from '../../store';

export default function describeLogStreams(logGroupName: string, descending = true): Promise<any> {
  return new Promise((resolve, reject) => {
    const params = {
      logGroupName,
      descending,
    };
    AWS_CLOUDWATCH.describeLogStreams(params as unknown as any, function(err: AWSError, data) {
      if (err) reject(err);
      else {
        store.AWS.Cloudwatch.NextToken = data.nextToken;
        resolve(data.logStreams);
      }
    });
  });
}
