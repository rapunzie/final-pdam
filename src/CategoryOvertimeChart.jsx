import React from "react";
import Chart from "react-apexcharts";

const CategoryOvertimeChart = ({ data }) => {
  const options = {
    chart: { id: "category-over-time", stacked: true },
    xaxis: { categories: data.months },
  };

  const series = data.categories.map((category) => ({
    name: category.name,
    data: category.values,
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Categories over time</h3>
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default CategoryOvertimeChart;