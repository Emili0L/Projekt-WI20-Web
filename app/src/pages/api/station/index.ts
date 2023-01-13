// return all stations

import { withMethods } from "../../../lib/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";

async function handle(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send("I'm alive");
}

// only allow GET requests to this route
export default withMethods(["GET"], handle);
