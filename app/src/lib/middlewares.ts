// middleware for apis

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '../lib/session';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export function withMethods(methods: Methods[], handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (!methods.includes(req.method as Methods)) {
      return res.status(405).end();
    }

    return handler(req, res);
  };
}

export function withAuth(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession({ req, res });
    if (!session) {
      return res.status(401).end();
    }

    return handler(req, res);
  };
}
