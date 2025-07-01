import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import PageWrapper from "./components/PageWrapper";
const api_url = import.meta.env.VITE_API_URL;

export default function VisualizationPage() {
  const [comments, setComments] = useState([]);
  const [sentimentFilter, setSentimentFilter] = useState("All");

  useEffect(() => {
    fetch("${api_url}/get_comments", {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true"
        },})
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const filteredComments = comments.filter((comment) =>
    sentimentFilter === "All" ? true : comment.sentiment === sentimentFilter
  );

  const sentimentCounts = filteredComments.reduce((acc, comment) => {
    acc[comment.sentiment] = (acc[comment.sentiment] || 0) + 1;
    return acc;
  }, {});

  const categoryCounts = filteredComments.reduce((acc, comment) => {
    const cat = comment.category || "Lainnya";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const monthlySentiment = {};
  const monthlyCategory = {};

  filteredComments.forEach((comment) => {
    const date = new Date(comment.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlySentiment[monthKey]) {
      monthlySentiment[monthKey] = { positif: 0, netral: 0, negatif: 0 };
    }
    monthlySentiment[monthKey][comment.sentiment]++;

    if (!monthlyCategory[monthKey]) {
      monthlyCategory[monthKey] = {};
    }
    const cat = comment.category || "Lainnya";
    monthlyCategory[monthKey][cat] = (monthlyCategory[monthKey][cat] || 0) + 1;
  });

  const months = Object.keys(monthlySentiment).sort();
  const monthLabels = months.map((m) => {
    const [year, month] = m.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  });

  const sentimentOverTimeSeries = [
    {
      name: "positif",
      data: months.map((m) => monthlySentiment[m]?.positif || 0),
    },
    {
      name: "netral",
      data: months.map((m) => monthlySentiment[m]?.netral || 0),
    },
    {
      name: "negatif",
      data: months.map((m) => monthlySentiment[m]?.negatif || 0),
    },
  ];

  const categoryNames = Array.from(
    new Set(Object.values(monthlyCategory).flatMap((catObj) => Object.keys(catObj)))
  );

  const categoryOverTimeSeries = categoryNames.map((name) => ({
    name,
    data: months.map((m) => monthlyCategory[m]?.[name] || 0),
  }));

  return (
    <PageWrapper title="Sentiment Distributions">
      {/* Filter */}
      <div className="mb-6">
        <label className="text-sm font-medium">
          Filter
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="All">All</option>
            <option value="positif">positif</option>
            <option value="netral">netral</option>
            <option value="negatif">negatif</option>
          </select>
        </label>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Distribusi Sentimen</h3>
          {Object.keys(sentimentCounts).length > 0 ? (
            <Chart
              options={{
                labels: Object.keys(sentimentCounts),
                colors: ["#BAF1A1", "#FFB100", "#D92027"],
              }}
              series={Object.values(sentimentCounts)}
              type="pie"
              width="100%"
            />
          ) : (
            <p className="text-gray-500">Tidak ada data sentimen.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Distribusi Kategori Komentar</h3>
          {Object.keys(categoryCounts).length > 0 ? (
            <Chart
              options={{
                labels: Object.keys(categoryCounts),
                colors: ["#655DBB", "#BFACE2", "#F59E0B"],
              }}
              series={Object.values(categoryCounts)}
              type="pie"
              width="100%"
            />
          ) : (
            <p className="text-gray-500">Tidak ada data kategori.</p>
          )}
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-2">Sentiment Over Time</h3>
        {months.length > 0 ? (
          <Chart
            options={{
              chart: { id: "sentiment-over-time" },
              xaxis: { categories: monthLabels },
              stroke: { curve: "smooth" },
              colors: ["#22c55e", "#facc15", "#ef4444"],
            }}
            series={sentimentOverTimeSeries}
            type="line"
            height={300}
          />
        ) : (
          <p className="text-gray-500">Tidak ada data.</p>
        )}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-2">Category Over Time</h3>
        {months.length > 0 && categoryOverTimeSeries.length > 0 ? (
          <Chart
            options={{
              chart: { id: "category-over-time", stacked: true },
              xaxis: { categories: monthLabels },
              colors: ["#655DBB", "#BFACE2"],
            }}
            series={categoryOverTimeSeries}
            type="bar"
            height={300}
          />
        ) : (
          <p className="text-gray-500">Tidak ada data.</p>
        )}
      </div>

      {/* Sentiment per Jenis Komentar */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-2">Distribusi Sentimen per Jenis Komentar</h3>
        <Chart
          options={{
            chart: { type: "bar", stacked: true },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: "60%",
              },
            },
            colors: ["#22c55e", "#facc15", "#ef4444"],
            xaxis: {
              categories: ["pernyataan", "pertanyaan"],
              title: { text: "Jumlah Komentar" },
            },
            legend: { position: "top" },
          }}
          series={[
            {
              name: "positif",
              data: ["pernyataan", "pertanyaan"].map((type) =>
                filteredComments.filter(
                  (c) => c.category === type && c.sentiment === "positif"
                ).length
              ),
            },
            {
              name: "netral",
              data: ["pernyataan", "pertanyaan"].map((type) =>
                filteredComments.filter(
                  (c) => c.category === type && c.sentiment === "netral"
                ).length
              ),
            },
            {
              name: "negatif",
              data: ["pernyataan", "pertanyaan"].map((type) =>
                filteredComments.filter(
                  (c) => c.category === type && c.sentiment === "negatif"
                ).length
              ),
            },
          ]}
          type="bar"
          height={300}
        />
      </div>
    </PageWrapper>
  );
}