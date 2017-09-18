const config = {
  host: process.env.HOST || 'localhost',
  s3: {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    accessSecret: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_BUCKET_NAME,
    url: `https://s3.eu-central-1.amazonaws.com/${process.env.AWS_BUCKET_NAME}/`,
  },
};

// eslint-disable-next-line import/no-commonjs
module.exports = config;
