import { hashSync } from 'bcrypt';
import crypto, { randomUUID } from 'crypto';

const numIterations = 4;
const password = 'Password!1';

const generateStrings = async () => {
  console.log('\nObjectIds:\n------');
  for (let i = 0; i < numIterations; i++) {
    console.log(`${crypto.randomBytes(12).toString('hex')}`);
  }

  console.log('\n\nUUIDs:\n------');
  for (let i = 0; i < numIterations; i++) {
    console.log(`${randomUUID()}`);
  }

  console.log('\n\nHashed Password:\n------');
  console.log(hashSync(password, 12));

  console.log('\n\nEmail verification & password reset tokens:\n------');
  for (let i = 0; i < numIterations*2; i++) {
    console.log(`${crypto.randomBytes(20).toString('hex')}`);
  }

  console.log('\n\nReferral codes:\n------');
  for (let i = 0; i < numIterations; i++) {
    console.log(`${crypto.randomBytes(10).toString('hex')}`);
  }
};

generateStrings();