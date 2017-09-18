import { S3StreamLogger } from 's3-streamlogger';
import config from '../config';
import winston from 'winston';

const s3stream = new S3StreamLogger({
  access_key_id: config.s3.accessKey,
  secret_access_key: config.s3.accessSecret,
  bucket: config.s3.bucket,
  folder: `${config.host}_${process.env.NODE_ENV}`,
  config: {
    region: 'eu-central-1',
  },
  name_format: `%Y-%m-%d-%H-%M-%S-%L_${config.host}_${process.env.NODE_ENV}.log`,
  max_file_size: 200000,
  buffer_size: 10000,
});

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      stream: s3stream,
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  // eslint-disable-next-line no-unused-vars
  write(message, encoding) {
    logger.info(message);
  },
};

export default logger;
