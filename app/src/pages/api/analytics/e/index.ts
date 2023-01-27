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
  try {
    const result = await client.search({
      index: process.env.ELASTICSEARCH_INDEX,
      body: {
        size: 0,
        aggs: {
          coordinates: {
            geohash_grid: {
              field: "coordinates",
              precision: 3,
            },
            aggs: {
              countries: {
                terms: {
                  script: {
                    source: "GeoHash.decode(doc['coordinates'].value)[3]",
                  },
                },
              },
            },
          },
        },
      },
    });
    // @ts-expect-error
    res.status(200).json(result.aggregations.heatmap_data.buckets);
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
