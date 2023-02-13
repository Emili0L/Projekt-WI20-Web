import { EChartsOption } from "echarts";
import { ReactECharts } from "./React-ECharts";
import SimpleLinearRegression from "ml-regression-simple-linear";

const globalData = [
  {
    year: 1880,
    temp: -0.1,
  },
  {
    year: 1881,
    temp: -0.03,
  },
  {
    year: 1882,
    temp: -0.15,
  },
  {
    year: 1883,
    temp: -0.13,
  },
  {
    year: 1884,
    temp: -0.23,
  },
  {
    year: 1885,
    temp: 0.02,
  },
  {
    year: 1886,
    temp: -0.16,
  },
  {
    year: 1887,
    temp: -0.16,
  },
  {
    year: 1888,
    temp: 0.08,
  },
  {
    year: 1889,
    temp: -0.14,
  },
  {
    year: 1890,
    temp: -0.27,
  },
  {
    year: 1891,
    temp: -0.05,
  },
  {
    year: 1892,
    temp: -0.43,
  },
  {
    year: 1893,
    temp: -0.24,
  },
  {
    year: 1894,
    temp: -0.24,
  },
  {
    year: 1895,
    temp: -0.11,
  },
  {
    year: 1896,
    temp: 0.07,
  },
  {
    year: 1897,
    temp: -0.23,
  },
  {
    year: 1898,
    temp: -0.1,
  },
  {
    year: 1899,
    temp: -0.18,
  },
  {
    year: 1900,
    temp: 0.02,
  },
  {
    year: 1901,
    temp: -0.27,
  },
  {
    year: 1902,
    temp: -0.37,
  },
  {
    year: 1903,
    temp: -0.47,
  },
  {
    year: 1904,
    temp: -0.29,
  },
  {
    year: 1905,
    temp: -0.07,
  },
  {
    year: 1906,
    temp: -0.15,
  },
  {
    year: 1907,
    temp: -0.41,
  },
  {
    year: 1908,
    temp: -0.41,
  },
  {
    year: 1909,
    temp: -0.41,
  },
  {
    year: 1910,
    temp: -0.57,
  },
  {
    year: 1911,
    temp: -0.2,
  },
  {
    year: 1912,
    temp: -0.4,
  },
  {
    year: 1913,
    temp: -0.04,
  },
  {
    year: 1914,
    temp: -0.08,
  },
  {
    year: 1915,
    temp: -0.11,
  },
  {
    year: 1916,
    temp: -0.63,
  },
  {
    year: 1917,
    temp: -0.54,
  },
  {
    year: 1918,
    temp: -0.35,
  },
  {
    year: 1919,
    temp: -0.4,
  },
  {
    year: 1920,
    temp: -0.43,
  },
  {
    year: 1921,
    temp: -0.1,
  },
  {
    year: 1922,
    temp: -0.2,
  },
  {
    year: 1923,
    temp: -0.01,
  },
  {
    year: 1924,
    temp: -0.41,
  },
  {
    year: 1925,
    temp: 0.11,
  },
  {
    year: 1926,
    temp: -0.21,
  },
  {
    year: 1927,
    temp: -0.28,
  },
  {
    year: 1928,
    temp: -0.18,
  },
  {
    year: 1929,
    temp: -0.53,
  },
  {
    year: 1930,
    temp: 0.01,
  },
  {
    year: 1931,
    temp: -0.08,
  },
  {
    year: 1932,
    temp: -0.22,
  },
  {
    year: 1933,
    temp: -0.41,
  },
  {
    year: 1934,
    temp: -0.02,
  },
  {
    year: 1935,
    temp: -0.15,
  },
  {
    year: 1936,
    temp: -0.01,
  },
  {
    year: 1937,
    temp: -0.07,
  },
  {
    year: 1938,
    temp: -0.2,
  },
  {
    year: 1939,
    temp: 0.5,
  },
  {
    year: 1940,
    temp: 0.35,
  },
  {
    year: 1941,
    temp: 0.26,
  },
  {
    year: 1942,
    temp: 0.11,
  },
  {
    year: 1943,
    temp: 0.3,
  },
  {
    year: 1944,
    temp: 0.12,
  },
  {
    year: 1945,
    temp: -0.01,
  },
  {
    year: 1946,
    temp: -0.29,
  },
  {
    year: 1947,
    temp: -0.13,
  },
  {
    year: 1948,
    temp: -0.11,
  },
  {
    year: 1949,
    temp: -0.18,
  },
  {
    year: 1950,
    temp: -0.15,
  },
  {
    year: 1951,
    temp: 0.22,
  },
  {
    year: 1952,
    temp: 0.02,
  },
  {
    year: 1953,
    temp: 0.09,
  },
  {
    year: 1954,
    temp: -0.18,
  },
  {
    year: 1955,
    temp: -0.26,
  },
  {
    year: 1956,
    temp: -0.12,
  },
  {
    year: 1957,
    temp: 0.21,
  },
  {
    year: 1958,
    temp: 0.15,
  },
  {
    year: 1959,
    temp: 0.01,
  },
  {
    year: 1960,
    temp: 0.27,
  },
  {
    year: 1961,
    temp: -0.01,
  },
  {
    year: 1962,
    temp: 0.11,
  },
  {
    year: 1963,
    temp: 0.09,
  },
  {
    year: 1964,
    temp: -0.25,
  },
  {
    year: 1965,
    temp: -0.01,
  },
  {
    year: 1966,
    temp: -0.09,
  },
  {
    year: 1967,
    temp: -0.03,
  },
  {
    year: 1968,
    temp: -0.03,
  },
  {
    year: 1969,
    temp: 0.27,
  },
  {
    year: 1970,
    temp: -0.08,
  },
  {
    year: 1971,
    temp: -0.05,
  },
  {
    year: 1972,
    temp: 0.26,
  },
  {
    year: 1973,
    temp: 0.03,
  },
  {
    year: 1974,
    temp: -0.1,
  },
  {
    year: 1975,
    temp: -0.1,
  },
  {
    year: 1976,
    temp: 0.1,
  },
  {
    year: 1977,
    temp: 0.11,
  },
  {
    year: 1978,
    temp: 0.14,
  },
  {
    year: 1979,
    temp: 0.52,
  },
  {
    year: 1980,
    temp: 0.27,
  },
  {
    year: 1981,
    temp: 0.48,
  },
  {
    year: 1982,
    temp: 0.43,
  },
  {
    year: 1983,
    temp: 0.27,
  },
  {
    year: 1984,
    temp: -0.08,
  },
  {
    year: 1985,
    temp: 0.22,
  },
  {
    year: 1986,
    temp: 0.22,
  },
  {
    year: 1987,
    temp: 0.53,
  },
  {
    year: 1988,
    temp: 0.34,
  },
  {
    year: 1989,
    temp: 0.4,
  },
  {
    year: 1990,
    temp: 0.42,
  },
  {
    year: 1991,
    temp: 0.28,
  },
  {
    year: 1992,
    temp: 0.24,
  },
  {
    year: 1993,
    temp: 0.27,
  },
  {
    year: 1994,
    temp: 0.42,
  },
  {
    year: 1995,
    temp: 0.33,
  },
  {
    year: 1996,
    temp: 0.38,
  },
  {
    year: 1997,
    temp: 0.63,
  },
  {
    year: 1998,
    temp: 0.59,
  },
  {
    year: 1999,
    temp: 0.53,
  },
  {
    year: 2000,
    temp: 0.33,
  },
  {
    year: 2001,
    temp: 0.57,
  },
  {
    year: 2002,
    temp: 0.49,
  },
  {
    year: 2003,
    temp: 0.76,
  },
  {
    year: 2004,
    temp: 0.51,
  },
  {
    year: 2005,
    temp: 0.63,
  },
  {
    year: 2006,
    temp: 0.79,
  },
  {
    year: 2007,
    temp: 0.47,
  },
  {
    year: 2008,
    temp: 0.54,
  },
  {
    year: 2009,
    temp: 0.65,
  },
  {
    year: 2010,
    temp: 0.46,
  },
  {
    year: 2011,
    temp: 0.55,
  },
  {
    year: 2012,
    temp: 0.47,
  },
  {
    year: 2013,
    temp: 0.67,
  },
  {
    year: 2014,
    temp: 0.81,
  },
  {
    year: 2015,
    temp: 1.15,
  },
  {
    year: 2016,
    temp: 0.83,
  },
  {
    year: 2017,
    temp: 0.87,
  },
  {
    year: 2018,
    temp: 0.88,
  },
  {
    year: 2019,
    temp: 1.05,
  },
  {
    year: 2020,
    temp: 0.78,
  },
  {
    year: 2021,
    temp: 0.84,
  },
  {
    year: 2022,
    temp: 0.8,
  },
] as TempData[];

export type TempData = {
  year: number;
  temp: number;
};

type Props = {
  data?: TempData[];
};

const TempRiseLineChart = ({ data }: Props) => {
  var tempData = data || globalData;
  const x = tempData.map((d) => d.year);
  const y = tempData.map((d) => d.temp);
  const regression = new SimpleLinearRegression(x, y);

  const averageIncrease = (regression.slope * 10).toFixed(2);

  const option = {
    xAxis: {
      type: "category",
      data: x,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: y,
        type: "line",
        smooth: true,
        lineStyle: {
          color: "blue",
        },
      },
      {
        data: x.map((xValue) => regression.predict(xValue)),
        type: "line",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: "red",
        },
      },
    ],
  } as EChartsOption;

  const style = {
    height: "20rem",
  };

  return (
    <>
      <ReactECharts option={option} style={style} />
      <p
        style={{
          position: "absolute",
          bottom: "80px",
          left: "37.5px",
          fontSize: "0.8rem",
        }}
      >
        {`On average, the temperature has risen by ${averageIncrease} degrees Celsius per decade.`}
      </p>
    </>
  );
};

export default TempRiseLineChart;
