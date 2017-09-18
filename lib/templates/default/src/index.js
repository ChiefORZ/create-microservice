import compress from 'micro-compress';
import microCors from 'micro-cors';
import morgan from './middlewares/morgan';
import path from 'path';
import route from 'fs-route';
import { send } from 'micro';

const requiredEnv = ['NODE_ENV'];
// make sure these env variables are set
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    throw new Error(`Environment Variable ${env} has to be set.`);
  }
});

// initialize CORS middleware
// pass options, if only specific requests are allowed: https://github.com/possibilities/micro-cors
const cors = microCors();

// initialize Filesystem Router for the directory 'routes'
const matcher = route(path.join(__dirname, 'routes'));

const server = (req, res) => {
  try {
    const { handler, query, params } = matcher(req);
    if (handler) {
      return handler(req, res, { query, params });
    }
    return send(res, 404, { error: 'not found' });
  } catch (err) {
    return send(res, 500, { error: err.message });
  }
};

// initialize Compress middleware
export default cors(compress(morgan(server)));
