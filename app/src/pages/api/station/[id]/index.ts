import type { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "../../../../lib/middlewares";

async function handle(req: NextApiRequest, res: NextApiResponse) {
  var { id: stationId, year, month } = req.query;
  stationId = stationId as string;
  if (!stationId) {
    return res.status(400).end();
  }

  // Model: WeatherData
  // Fields: stationId, timestamp, value, type (TMIN, TMAX)

  // Returns data in the following format:
  // {
  //   stationId: "123",
  //   data: [
  //     {
  //       year: 2020, // OR month: "2020-01", OR day: "2020-01-01"
  //       TMIN: 10, // Yearly mean of TMIN
  //       TMAX: 20, // Yearly mean of TMAX
  //     },
  //     ...
  //     ]
  // }

  if (month && !year) {
    return res.status(400).end();
  }

  // if month is provied make sure it is a valid month and in the correct format
  if (month) {
    const monthInt = parseInt(month as string);
    if (monthInt < 1 || monthInt > 12) {
      return res.status(400).end();
    }

    month = monthInt.toString().padStart(2, "0");
  }

  try {
    if (year && month) {
      const response = await fetch(
        `${process.env.AWS_LAMBDA_URL}?stationID=${stationId}&year=${year}&month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.AWS_LAMBDA_API_KEY,
          },
        }
      );

      const data = await response.json();

      return res.status(200).json(data);
    }

    if (year) {
      const response = await fetch(
        `${process.env.AWS_LAMBDA_URL}?stationID=${stationId}&year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.AWS_LAMBDA_API_KEY,
          },
        }
      );

      const data = await response.json();

      return res.status(200).json(data);
    }

    const response = await fetch(
      `${process.env.AWS_LAMBDA_URL}?stationID=${stationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.AWS_LAMBDA_API_KEY,
        },
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export default withMethods(["GET"], handle);
