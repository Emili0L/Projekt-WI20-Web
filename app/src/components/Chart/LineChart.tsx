import { useCallback, useEffect, useRef, useState } from "react";
import { useDialogContext } from "../Modal";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";
import { init, getInstanceByDom } from "echarts";
import { useMainContext } from "../Layout/Layout";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import en from "../../locales/en";
import de from "../../locales/de";

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
  const t = router.locale === "en" ? en : de;
  const { resolvedTheme: theme } = useTheme();

  const tooltipHTMLTemplate = useCallback(
    (seriesName: string, value: number, color: any) => {
      return (
        "<br />" +
        '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
        color +
        ';"></span>' +
        seriesName +
        ": " +
        '<strong style="font-weight: bold">' +
        value?.toFixed(2) +
        " °C" +
        "</strong>"
      );
    },
    []
  );

  const [option, setOption] = useState<EChartsOption>({
    currentView: "all",
    backgroundColor: theme === "dark" ? "#2A2A2A" : "#fff",
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
        var color5 = undefined;
        var color6 = undefined;
        var color7 = undefined;
        var color8 = undefined;
        var color9 = undefined;
        var color10 = undefined;
        if (params[2]) {
          color3 = params[2].color;
        }
        if (params[3]) {
          color4 = params[3].color;
        }
        if (params[4]) {
          color5 = params[4].color;
        }
        if (params[5]) {
          color6 = params[5].color;
        }
        if (params[6]) {
          color7 = params[6].color;
        }
        if (params[7]) {
          color8 = params[7].color;
        }
        if (params[8]) {
          color9 = params[8].color;
        }
        if (params[9]) {
          color10 = params[9].color;
        }
        return (
          params[0].name +
          tooltipHTMLTemplate(params[0].seriesName, params[0].value, color1) +
          tooltipHTMLTemplate(params[1].seriesName, params[1].value, color2) +
          (color3
            ? tooltipHTMLTemplate(params[2].seriesName, params[2].value, color3)
            : "") +
          (color4
            ? tooltipHTMLTemplate(params[3].seriesName, params[3].value, color4)
            : "") +
          (color5
            ? tooltipHTMLTemplate(params[4].seriesName, params[4].value, color5)
            : "") +
          (color6
            ? tooltipHTMLTemplate(params[5].seriesName, params[5].value, color6)
            : "") +
          (color7
            ? tooltipHTMLTemplate(params[6].seriesName, params[6].value, color7)
            : "") +
          (color8
            ? tooltipHTMLTemplate(params[7].seriesName, params[7].value, color8)
            : "") +
          (color9
            ? tooltipHTMLTemplate(params[8].seriesName, params[8].value, color9)
            : "") +
          (color10
            ? tooltipHTMLTemplate(
                params[9].seriesName,
                params[9].value,
                color10
              )
            : "")
        );
      },
    },
    legend: {
      top: "3%",
      orient: "horizontal",
      align: "left",
      padding: [5, 90, 0, 90],
    },
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
        name: t.chart.seriesNames.tmax,
        data: data.map((d) => d.tmax),
        type: "line",
        color: "#FF8F39",
      },
      {
        name: t.chart.seriesNames.tmin,
        data: data.map((d) => d.tmin),
        type: "line",
        color: "#416DFF",
      },
      {
        name: t.chart.seriesNames.tmax_summer,
        data: data.map((d) => d.tmax_summer),
        type: "line",
        color: "#FF2020",
      },
      {
        name: t.chart.seriesNames.tmin_winter,
        data: data.map((d) => d.tmin_winter),
        type: "line",
        color: "#0000FF",
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
              data: t.chart.months,
            },
            series: [
              {
                name: t.chart.seriesNames.tmin,
                type: "line",
                data: data.data.map((d: any) => d.tmin),
                color: "#416DFF",
                markLine: {
                  data: [
                    {
                      type: "average",
                      name: "Avg",
                    },
                  ],
                },
              },
              {
                name: t.chart.seriesNames.tmax,
                type: "line",
                data: data.data.map((d: any) => d.tmax),
                color: "#FF8F39",
                markLine: {
                  data: [
                    {
                      type: "average",
                      name: "Avg",
                    },
                  ],
                },
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
      selectedMonth = t.chart.months.indexOf(selectedMonth);
      if (selectedMonth === -1) {
        return chart.hideLoading();
      } else {
        selectedMonth = selectedMonth + 1;
      }
      // @ts-expect-error
      var year = chartOptions.currentView.split("year - ")[1];
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
                name: t.chart.seriesNames.tmin,
                type: "line",
                data: data.data.map((d: any) => d.tmin),
                color: "#416DFF",
                markLine: {
                  data: [{ type: "average", name: "Avg" }],
                },
                markPoint: {
                  data: [{ type: "min", name: "Min" }],
                },
              },
              {
                name: t.chart.seriesNames.tmax,
                type: "line",
                data: data.data.map((d: any) => d.tmax),
                color: "#FF8F39",
                markLine: {
                  data: [{ type: "average", name: "Avg" }],
                },
                markPoint: {
                  data: [{ type: "max", name: "Max" }],
                },
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
            name: t.chart.seriesNames.tmax,
            data: data.map((d) => d.tmax),
            type: "line",
            color: "#FF8F39",
          },
          {
            name: t.chart.seriesNames.tmin,
            data: data.map((d) => d.tmin),
            type: "line",
            color: "#416DFF",
          },
          {
            name: t.chart.seriesNames.tmax_summer,
            data: data.map((d) => d.tmax_summer),
            type: "line",
            color: "#FF2020",
          },
          {
            name: t.chart.seriesNames.tmin_winter,
            data: data.map((d) => d.tmin_winter),
            type: "line",
            color: "#0000FF",
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
