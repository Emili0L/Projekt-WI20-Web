import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';

type WithContext = {
  ctx: GetServerSidePropsContext;
};

type WithRequest = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export const getServerSession = async (props: WithContext | WithRequest) => {
  if ('ctx' in props) {
    return unstable_getServerSession(props.ctx.req, props.ctx.res, authOptions);
  } else {
    return unstable_getServerSession(props.req, props.res, authOptions);
  }
};
