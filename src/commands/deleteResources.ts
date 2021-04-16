import AWS = require('aws-sdk');
<<<<<<< HEAD
// import { AWSError, IAM } from 'aws-sdk';
import { Command, flags } from '@oclif/command';
import store from '../store';

// const firehose = new AWS.Firehose();
// const lambda = new AWS.Lambda();
// const s3 = new AWS.S3();
const iam = new AWS.IAM();

export default class DeleteResources extends Command {


  async run() {
    AWS.config.update({ region:'us-east-1' });
    iam.listAttachedRolePolicies({ RoleName: store.AWS.IAM.RoleName }, (error, roleData) => console.log(error, roleData));
    // iam.deleteRole({ RoleName: store.AWS.IAM.Role.RoleName }, (err, data) => console.log(err, data));
    // firehose.listDeliveryStreams({}, (err: AWSError, data: any) => console.log(err, data));
    // lambda.listFunctions({}, (err: AWSError, data: any) => console.log(err, data));
    // s3.listBuckets({}, (err: AWSError, data: any) => console.log(err, data));
  }
}
=======
import { AWSError } from 'aws-sdk';
import { Command } from '@oclif/command';

const firehose = new AWS.Firehose();
const lambda = new AWS.Lambda();

export default class DeleteResources extends Command {
  
  async run() {
    AWS.config.update({ region:'us-east-1' });
    firehose.listDeliveryStreams({}, (err: AWSError, data: any) => console.log(err, data));
    lambda.listFunctions({}, (err: AWSError, data: any) => console.log(err, data));
    // s3.listBuckets({}, (err: AWSError, data: any) => console.log(err, data));
  }
}
>>>>>>> 0becc9cc1b4db997d07357e1fb3c471766f7922a
