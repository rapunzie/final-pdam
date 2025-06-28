import React from "react";
import Chart from "react-apexcharts";

const SentimentOvertimeChart = ({ data }) => {
  const options = {
    chart: { id: "sentiment-over-time" },
    xaxis: { categories: data.months },
    colors: ["#22c55e", "#facc15", "#ef4444"],
    stroke: { curve: "smooth" },
  };

  const series = [
    { name: "Positive", data: data.positive },
    { name: "Neutral", data: data.neutral },
    { name: "Negative", data: data.negative },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Sentiment over time</h3>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
};

export default SentimentOvertimeChart;