import attachRolePolicy from "../iam/attachRolePolicy";
import store from '../../store';
import constants from '../../constants';

export default function attachRolePolicies(): Promise<void> {
  return new Promise(resolve => {
    const promises: Promise<any>[] = [];
    promises.push(attachRolePolicy(
      store.AWS.IAM.RoleName!, constants.FIREHOSE_POLICY_ARN
    ));
    promises.push(attachRolePolicy(
      store.AWS.IAM.RoleName!, constants.LAMBDA_POLICY_ARN)
    );
    promises.push(attachRolePolicy(
      store.AWS.IAM.RoleName!, constants.TIMESTREAM_POLICY_ARN)
    );
    promises.push(attachRolePolicy(
      store.AWS.IAM.RoleName!, constants.S3_POLICY_ARN)
    );
    Promise.all(promises).then(() => {
      resolve();
    });
  });
}
