import log from '../../utils/log';
import { AWSCredentialsAnswers } from '../../constants/cliTypes';
import store from '../../store';
import { credentialsExist } from '../../utils/aws';

export const awsCredentialsFormInfo = {
  name: 'aws credentials',
  message: 'Please provide AWS credentials for generating the vector configuration file:',
  choices: [
    {
      name: 'Access Key ID',
      message: 'Access Key ID',
      initial: store.AWS.Credentials.accessKeyId || 'AKIA****'
    },
    {
      name: 'Secret Key',
      message: 'Secret Key',
      initial: store.AWS.Credentials.secretAccessKey || 'Wg55Y****'
    },
  ],
  validate: (answers: AWSCredentialsAnswers): boolean => {
    if (answers['Access Key ID'].length < 16) {
      console.clear();
      log.warn('That does not look like a AWS Access Key ID. Length is typically 20 characters.\n');

      return false;
    } else if (answers['Secret Key'].length < 30) {
      console.clear();
      log.warn('That does not look like a AWS Secret Key. Length is typically 40 characters.\n');

      return false;
    }

    return true;
  }
};

/**
 * Used to ensure aws credentials exist prior to doing some operation
 * that would require them.
 */
export const promptCredentials = async (): Promise<void> => {
  if (!credentialsExist()) {
    console.clear();

    const answers: AWSCredentialsAnswers = await (new Form(awsCredentialsFormInfo)).run();
    store.AWS.Credentials.accessKeyId = answers['Access Key ID'];
    store.AWS.Credentials.secretAccessKey = answers['Secret Key'];
  }
};
