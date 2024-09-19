import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

interface CombinedChartProps {
  data: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  range: string;
}

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const CombinedChart: React.FC<CombinedChartProps> = ({ data, range }) => {
  const [candlestickOptions, setCandlestickOptions] = useState<ApexOptions>({});
  const [volumeOptions, setVolumeOptions] = useState<ApexOptions>({});
  const [candlestickSeries, setCandlestickSeries] = useState<any[]>([]);
  const [volumeSeries, setVolumeSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const previousDateRef = useRef<{ day: number | null; month: number | null }>({
    day: null,
    month: null,
  });

  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error("Data is not an array or is undefined");
      return;
    }

    const processedData = data
      .filter((item) => item.open !== null && item.close !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const uniqueDates = Array.from(
      new Set(processedData.map((item) => item.date))
    );

    setCategories(uniqueDates);

    setCandlestickSeries([
      {
        name: "Candlestick",
        type: "candlestick",
        data: processedData.map((item) => ({
          x: item.date,
          y: [item.open, item.high, item.low, item.close],
        })),
      },
    ]);

    const volumeData = processedData.map((item) => ({
      x: item.date,
      y: item.volume,
      color: item.close > item.open ? "#00B746" : "#EF403C",
    }));

    setVolumeSeries([
      {
        name: "Volume",
        type: "bar",
        data: volumeData,
      },
    ]);

    const commonOptions: ApexOptions = {
      chart: {
        background: "#000",
        zoom: {
          enabled: true,
        },
        stacked: false,
      },
      xaxis: {
        type: "category",
        categories: uniqueDates,
        labels: {
          show: false,
          formatter: (value: string, index: number) => {
            const date = new Date(value);
            const day = date.getDate();
            const month = date.getMonth() + 1;

            const previousDay = previousDateRef.current.day;
            const previousMonth = previousDateRef.current.month;

            previousDateRef.current = { day, month };

            if (day === 1 && previousMonth === month) {
              return `${day}/${month}`;
            }

            return `${day}`;
          },
          style: {
            colors: "#FFFFFF",
            fontSize: "8px",
          },
        },
        axisBorder: {
          show: true,
          color: "#333",
        },
        axisTicks: {
          show: true,
          color: "#333",
        },
      },
      grid: {
        borderColor: "#333",
        strokeDashArray: 3,
      },
      theme: {
        mode: "dark",
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: number, opts: any) {
            if (val === null || val === undefined) return "";
            return val.toString().includes(".")
              ? val.toFixed(2)
              : val.toFixed(0);
          },
        },
      },
    };

    const candlestickOpts: ApexOptions = {
      ...commonOptions,
      chart: {
        ...commonOptions.chart,
        id: "candlestickChart",
        height: 400,
        toolbar: {
          autoSelected: "pan",
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#FFFFFF",
            fontSize: "12px",
          },
        },
        title: {
          text: "Price",
          style: {
            color: "#FFFFFF",
          },
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#00B746",
            downward: "#EF403C",
          },
        },
      },
    };

    const volumeOpts: ApexOptions = {
      chart: {
        ...commonOptions.chart,
        id: "volumeChart",
        height: 200,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        type: "category",
        categories: uniqueDates,
        labels: {
          formatter: (value: string, index: number) => {
            const date = new Date(value);
            const day = date.getDate();
            const month = date.getMonth() + 1;

            const previousDay = previousDateRef.current.day;
            const previousMonth = previousDateRef.current.month;

            previousDateRef.current = { day, month };

            if (day === 1 && previousMonth === month) {
              return `${day}/${month}`;
            }

            return `${day}`;
          },
          style: {
            colors: "#FFFFFF",
            fontSize: "8px",
          },
        },
        axisBorder: {
          show: true,
          color: "#333",
        },
        axisTicks: {
          show: true,
          color: "#333",
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#FFFFFF",
            fontSize: "12px",
          },
        },
        title: {
          text: "Volume",
          style: {
            color: "#FFFFFF",
          },
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "90%",
          colors: {
            ranges: volumeData.map((item) => ({
              from: item.y,
              to: item.y,
              color: item.color,
            })),
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
        borderColor: "#333",
        strokeDashArray: 3,
        position: "back",
      },
    };

    setCandlestickOptions(candlestickOpts);
    setVolumeOptions(volumeOpts);
  }, [data, range]);

  return (
    <div className="relative w-full bg-gray-800">
      <div id="candlestick-chart">
        <ApexCharts
          options={candlestickOptions}
          series={candlestickSeries}
          type="candlestick"
          height={400}
        />
      </div>
      <div id="volume-chart" style={{ marginTop: "-20px" }}>
        <ApexCharts
          options={volumeOptions}
          series={volumeSeries}
          type="bar"
          height={200}
        />
      </div>
    </div>
  );
};

export default CombinedChart;
