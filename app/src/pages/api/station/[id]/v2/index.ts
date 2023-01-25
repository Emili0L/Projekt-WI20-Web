import type { NextApiRequest, NextApiResponse } from "next";
import { withMethods } from "../../../../../lib/middlewares";
import pako from "pako";

function averageTemperature(data) {
  let result = [];
  let year = 0;
  let sumTmax = 0;
  let sumTmin = 0;
  let countTmax = 0;
  let countTmin = 0;
  for (let i = 0; i < data.length; i++) {
    let element = data[i].split(",");
    if (element[2] === "TMAX" || element[2] === "TMIN") {
      if (year === 0) {
        year = element[1].substring(0, 4);
      }
      if (year === element[1].substring(0, 4)) {
        if (element[2] === "TMAX") {
          sumTmax += parseInt(element[3]) / 10;
          countTmax++;
        } else {
          sumTmin += parseInt(element[3]) / 10;
          countTmin++;
        }
      } else {
        result.push({
          year: year,
          tmax: sumTmax / countTmax,
          tmin: sumTmin / countTmin,
        });
        year = element[1].substring(0, 4);
        sumTmax = 0;
        sumTmin = 0;
        countTmax = 0;
        countTmin = 0;
        if (element[2] === "TMAX") {
          sumTmax += parseInt(element[3]) / 10;
          countTmax++;
        } else {
          sumTmin += parseInt(element[3]) / 10;
          countTmin++;
        }
      }
    }
  }
  result.push({
    year: year,
    tmax: sumTmax / countTmax,
    tmin: sumTmin / countTmin,
  });
  return result;
}

function getYearlyAverages(data, year) {
  let result = [];
  let months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let tmin = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let tmax = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < data.length; i++) {
    let element = data[i].split(",");
    if (element[2] === "TMAX" || element[2] === "TMIN") {
      let date = element[1].substring(4, 6);
      let month = parseInt(date) - 1;
      if (element[1].substring(0, 4) === year.toString()) {
        if (element[2] === "TMAX") {
          tmax[month] += parseInt(element[3]) / 10;
        } else {
          tmin[month] += parseInt(element[3]) / 10;
        }
        months[month]++;
      }
    }
  }
  for (let i = 0; i < months.length; i++) {
    result.push({
      month: i + 1,
      tmin: (tmin[i] / months[i]) * 2,
      tmax: (tmax[i] / months[i]) * 2,
    });
  }
  return result;
}

function getDailyData(data, year, month) {
  var result = [];
  var date = new Date(year, month - 1, 1);
  var lastDay = new Date(year, month, 0).getDate();
  for (var i = 0; i < lastDay; i++) {
    var day = date.getDate();
    var tmin = null;
    var tmax = null;
    for (var j = 0; j < data.length; j++) {
      var line = data[j].split(",");
      if (!line[1]) continue;
      var lineDate = new Date(
        line[1].substring(0, 4),
        line[1].substring(4, 6) - 1,
        line[1].substring(6, 8)
      );
      if (lineDate.getTime() === date.getTime()) {
        if (line[2] === "TMAX") {
          tmax = parseInt(line[3]) / 10;
        } else if (line[2] === "TMIN") {
          tmin = parseInt(line[3]) / 10;
        }
      }
    }
    if (tmin !== null || tmax !== null) {
      result.push({
        day: day,
        tmin: tmin,
        tmax: tmax,
      });
    }
    date.setDate(date.getDate() + 1);
  }
  return result;
}

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
    // base url by station id: https://www.ncei.noaa.gov/pub/data/ghcn/daily/by_station/ + stationId + .csv.gz
    // station id: x
    // get the station data from the url above
    const station_file = await fetch(
      `https://www.ncei.noaa.gov/pub/data/ghcn/daily/by_station/${stationId}.csv.gz`
    )
      .then((res) => res.arrayBuffer())
      .then((buffer) => pako.inflate(new Uint8Array(buffer)))
      .then((data) => new TextDecoder("utf-8").decode(data))
      .then((data) => data.split("\n"));

    // if month is provided, return the daily averages for that month
    if (month) {
      return res.status(200).json({
        stationId: stationId,
        data: getDailyData(station_file, year, month),
      });
    }

    // if year is provided, return the monthly averages for that year
    if (year) {
      return res.status(200).json({
        stationId: stationId,
        data: getYearlyAverages(station_file, year),
      });
    }

    return res.status(200).json({
      stationId: stationId,
      data: averageTemperature(station_file),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export default withMethods(["GET"], handle);
