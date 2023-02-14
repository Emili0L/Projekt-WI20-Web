import { useEffect, useRef, useState } from "react";
import { useDialogContext } from "../Modal";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";
import { init, getInstanceByDom } from "echarts";
import { useMainContext } from "../Layout/Layout";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

const LineChart = () => {
  const { selectedMarker } = useMainContext();
  const {
    data,
    setSelectedMonth,
    setSelectedYear,
    setCurrentView,
    loading,
    shouldReset,
    setShouldReset,
  } = useDialogContext();
  const router = useRouter();
  const { resolvedTheme: theme } = useTheme();

  const [option, setOption] = useState<EChartsOption>({
    currentView: "all",
    title: {
      text: null,
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        var color1 = params[0].color;
        var color2 = params[1].color;
        var color3 = undefined;
        var color4 = undefined;
        if (params[2]) {
          color3 = params[2].color;
        }
        if (params[3]) {
          color4 = params[3].color;
        }
        return (
          params[0].name +
          "<br />" +
          '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
          color1 +
          ';"></span>' +
          params[0].seriesName +
          ": " +
          '<strong style="font-weight: bold">' +
          params[0].value?.toFixed(2) +
          " °C" +
          "</strong>" +
          "<br />" +
          '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
          color2 +
          ';"></span>' +
          params[1].seriesName +
          ": " +
          '<strong style="font-weight: bold">' +
          params[1].value?.toFixed(2) +
          " °C" +
          "</strong>" +
          // if there is a third series
          (color3
            ? "<br />" +
              '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
              color3 +
              ';"></span>' +
              params[2].seriesName +
              ": " +
              '<strong style="font-weight: bold">' +
              params[2].value?.toFixed(2) +
              " °C" +
              "</strong>"
            : "") +
          // if there is a fourth series
          (color4
            ? "<br />" +
              '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
              color4 +
              ';"></span>' +
              params[3].seriesName +
              ": " +
              '<strong style="font-weight: bold">' +
              params[3].value?.toFixed(2) +
              " °C" +
              "</strong>"
            : "")
        );
      },
    },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        mark: { show: true },
        magicType: { show: true, type: ["line", "bar"] },
        saveAsImage: { show: true },
      },
    },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: 0,
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((d) => d.year),
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value} °C",
      },
    },
    series: [
      {
        name: "TMAX",
        data: data.map((d) => d.tmax),
        type: "line",
      },
      {
        name: "TMIN",
        data: data.map((d) => d.tmin),
        type: "line",
      },
      {
        name: "TMAX Summer",
        data: data.map((d) => d.tmax_summer),
        type: "line",
      },
      {
        name: "TMIN Winter",
        data: data.map((d) => d.tmin_winter),
        type: "line",
      },
    ],
  });
  const chartRef = useRef<HTMLDivElement>(null);

  const settings = {
    notMerge: true,
  } as SetOptionOpts;

  const style = {
    height: "20rem",
  };

  const handleChartClick = (params: any) => {
    const chart = getInstanceByDom(chartRef.current);
    const chartOptions = chart.getOption();

    if (chartOptions.currentView === "all") {
      chart.showLoading();
      var year = params.name;
      fetch(`/api/station/${selectedMarker.id}?year=${year}`)
        .then((response) => response.json())
        .then((data) => {
          setOption({
            ...option,
            currentView: "year - " + year,
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            series: [
              {
                name: "TMIN",
                type: "line",
                data: data.data.map((d: any) => d.tmin),
              },
              {
                name: "TMAX",
                type: "line",
                data: data.data.map((d: any) => d.tmax),
              },
            ],
            dataZoom: [],
          });
          chart.hideLoading();
          chart.setOption(option, settings);
          setCurrentView("year");
          setSelectedYear(year);
        })
        .catch((error) => {
          console.error("Error:", error);
          chart.hideLoading();
        });
      // @ts-expect-error
    } else if (chartOptions.currentView?.includes("year")) {
      chart.showLoading();
      var selectedMonth = params.name;
      // @ts-expect-error
      var year = chartOptions.currentView.split("year - ")[1];
      // if selectedMonth is in the format of a year return
      if (selectedMonth.length === 4) {
        return chart.hideLoading();
      }
      selectedMonth = new Date(selectedMonth + " 1, 2021").getMonth() + 1;
      fetch(
        `/api/station/${selectedMarker.id}?year=${year}&month=${selectedMonth}`
      )
        .then((response) => response.json())
        .then((data) => {
          setOption({
            ...option,
            currentView: "month",
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: data.data.map((d: any) => d.day),
            },
            series: [
              {
                name: "TMIN",
                type: "line",
                data: data.data.map((d: any) => d.tmin),
              },
              {
                name: "TMAX",
                type: "line",
                data: data.data.map((d: any) => d.tmax),
              },
            ],
            dataZoom: [],
          });
          chart.hideLoading();
          chart.setOption(option, settings);
          setCurrentView("month");
          setSelectedMonth(selectedMonth);
        })
        .catch((error) => {
          console.error("Error:", error);
          chart.hideLoading();
        });
    }
  };

  useEffect(() => {
    if (shouldReset) {
      setOption({
        ...option,
        currentView: "all",
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            start: 0,
            end: 100,
          },
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.map((d) => d.year),
        },
        series: [
          {
            name: "TMAX",
            type: "line",
            data: data.map((d) => d.tmax),
          },
          {
            name: "TMIN",
            type: "line",
            data: data.map((d) => d.tmin),
          },
          {
            name: "TMAX Summer",
            type: "line",
            data: data.map((d) => d.tmax_summer),
          },
          {
            name: "TMIN Winter",
            type: "line",
            data: data.map((d) => d.tmin_winter),
          },
        ],
      });
      setCurrentView("all");
      setSelectedYear(0);
      setSelectedMonth(0);
      setShouldReset(false);
    }
  }, [shouldReset]);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme, {
        locale: router.locale,
      });
      chart.on("click", handleChartClick);
    }

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart.setOption(option, settings);
    }
  }, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loading === true ? chart.showLoading() : chart.hideLoading();
    }
  }, [loading, theme]);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%", ...style }} />
  );
};

export default LineChart;
