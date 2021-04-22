/* eslint-disable max-lines-per-function */
import * as fs from 'fs';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { AWSError } from 'aws-sdk';
import AdmZip from 'adm-zip';
import { AWS_REGION } from '../../constants';
import { AWS_LAMBDA_NAME } from '../../constants';

import store from '../../store';

interface LambdaData {
  lambdaFile: string,
  Role: string,
  DATABASE_NAME: string,
  Runtime: string,
  region: string,
  Description: string
}

export default function createLambda({
  lambdaFile,
  Role = store.AWS.IAM.Arn!,
  DATABASE_NAME,
  Runtime = 'nodejs12.x',
  region = AWS_REGION,
  Description = '',
}: LambdaData): Promise<any> {
  return new Promise(resolve => {
    AWS.config.update({ region });

    if (!fs.existsSync(lambdaFile)) {
      throw new Error("Can't find lambda file");
    }

    const zip = new AdmZip();

    zip.addLocalFile(lambdaFile);

    const lambda = new AWS.Lambda();

    const params = {
      Code: { /* required */
        ZipFile: zip.toBuffer(),
      },
      FunctionName: AWS_LAMBDA_NAME, /* required */
      Handler: `${AWS_LAMBDA_NAME}.handler`, /* required */
      Role, /* required */
      Runtime, /* required */
      Description,
      Environment: {
        Variables: {
          DATABASE_NAME,
        },
      },
    };

    lambda.createFunction(params, (err: AWSError, data) => {
      if (err && err.code !== 'ResourceConflictException') throw new Error(String(err));
      else resolve(data);
    });
  });
}

