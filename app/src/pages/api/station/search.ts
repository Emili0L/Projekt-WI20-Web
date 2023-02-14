import { Client } from "@elastic/elasticsearch";
import { withMethods } from "../../../lib/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { q, size, country_code, start_year, end_year } = req.query;

  if (size !== undefined && isNaN(Number(size))) {
    res.status(400).json({
      error: "Parameter size must be a number",
    });
  }
  // check that start_year and end_year are numbers and valid years
  Object.entries({ start_year, end_year }).forEach(([key, value]) => {
    if (value !== undefined && isNaN(Number(value))) {
      res.status(400).json({
        error: `Parameter ${key} must be a number`,
      });
    } else if (
      value !== undefined &&
      (Number(value) < 1750 || Number(value) > 2023)
    ) {
      res.status(400).json({
        error: `Parameter ${key} must be between 1750 and 2023`,
      });
    }
  });

  try {
    const result = await client.search({
      index: process.env.ELASTICSEARCH_INDEX,
      size: Number(size) || 10,
      q: q as string,
      body: {
        query: {
          bool: {
            should: [
              {
                query_string: {
                  query: q as string,
                },
              },
            ],
            filter: [
              {
                range: {
                  years: {
                    gte: Number(start_year),
                    lte: Number(end_year),
                  },
                },
              },
              ...(country_code
                ? [
                    {
                      match: {
                        country_code: country_code as string,
                      },
                    },
                  ]
                : []),
            ],
          },
        },
      },
    });

    res.status(200).json(result.hits.hits);
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
