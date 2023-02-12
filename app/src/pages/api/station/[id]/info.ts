import { Client } from "@elastic/elasticsearch";
import { withMethods } from "../../../../lib/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});

async function handle(req: NextApiRequest, res: NextApiResponse) {
  var { id: stationId } = req.query;
  stationId = stationId as string;
  if (!stationId) {
    return res.status(400).end();
  }

  try {
    const result = await client.search({
      index: process.env.ELASTICSEARCH_INDEX,
      query: {
        // @ts-expect-error
        bool: {
          must: {
            match: {
              id: stationId,
            },
          },
        },
      },
    });

    res.status(200).json(result.hits.hits[0]._source);
  } catch (err) {
    // if the error returns an error code, return that
    if (err.statusCode) {
      res.status(err.statusCode).json(err);
    }
    // otherwise, return a 500
    res.status(500).json(err);
  }
}

// only allow GET requests to this route
export default withMethods(["GET"], handle);
