import { host } from '../config';
import logger from '../utils/logger';
import morgan from 'morgan';
import uuid from 'uuid';

// define, how morgan should get the parameter 'id'
morgan.token('id', req => req.id);

let log;
if (host === 'localhost') {
  log = morgan('dev');
} else {
  log = morgan(':id :method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream,
  });
}

export default function(handler) {
  return (req, res) => {
    req.id = uuid.v4();
    // log the request details (body, header) to the s3 bucket
    if (host !== 'localhost') {
      const body = {
        body: req.body,
        headers: req.headers,
        id: req.id,
        method: req.method,
        originalUrl: req.originalUrl,
        params: req.params,
        query: req.query,
      };
      logger.info(`${req.id} body: ${JSON.stringify(body)}`);
    }
    // log the response details (status, content length) to the s3 bucket stream when request is finished
    log(req, res, () => {});
    return handler(req, res);
  };
}
