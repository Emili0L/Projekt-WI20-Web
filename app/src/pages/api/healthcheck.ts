import { withMethods } from '../../lib/middlewares';
import type { NextApiRequest, NextApiResponse } from 'next';

function healthCheck(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send("I'm alive");
}

// only allow GET requests to this route
export default withMethods(['GET'], healthCheck);
