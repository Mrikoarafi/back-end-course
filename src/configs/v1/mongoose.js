const mongoose = require('mongoose');
const env = require('../../helpers/v1/env');

async function main() {
  await mongoose.connect(`${env.MONGO_AUTH}`);
}
main()
  .then(() => console.log('Connect Database'))
  .catch(() => {
    console.log('Database trouble');
  });
