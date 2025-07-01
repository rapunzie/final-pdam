import { useEffect, useState } from "react";
import { getUrgency } from "./Urgency";
const api_url = import.meta.env.VITE_API_URL;

export default function CommentTable() {
  const [comments, setComments] = useState([]);
  const [urgencySortOrder, setUrgencySortOrder] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Hanya fetch sekali saat komponen pertama kali dimount
    fetch(`${api_url}/get_comments`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setComments(sorted);
      })
      .catch((err) => console.error("Error fetching comments:", err));
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Timestamp",
      "Username",
      "Comments",
      "Sentiment",
      "Category",
      "Urgency",
    ];

    const rows = comments.map((comment) => [
      formatDate(comment.timestamp) || "Unknown",
      comment.username,
      `"${(comment.text || "").replace(/"/g, '""')}"`,
      comment.sentiment,
      comment.category || "-",
      getUrgency(comment.sentiment, comment.category),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "comments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSortedComments = () => {
    const urgencyMap = { Tinggi: 3, Sedang: 2, Rendah: 1 };

    let filtered = comments.filter((comment) =>
      comment.text?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (urgencySortOrder === "high-to-low") {
      filtered.sort((a, b) => {
        const urgencyA = urgencyMap[getUrgency(a.sentiment, a.category)] || 0;
        const urgencyB = urgencyMap[getUrgency(b.sentiment, b.category)] || 0;
        return urgencyB - urgencyA;
      });
    } else if (urgencySortOrder === "low-to-high") {
      filtered.sort((a, b) => {
        const urgencyA = urgencyMap[getUrgency(a.sentiment, a.category)] || 0;
        const urgencyB = urgencyMap[getUrgency(b.sentiment, b.category)] || 0;
        return urgencyA - urgencyB;
      });
    } else {
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return filtered;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Komentar Aduan Pelanggan PDAM Surya Sembada
      </h2>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div className="text-sm text-gray-700">
          <label className="mr-2 font-medium">Sort:</label>
          <select
            value={urgencySortOrder}
            onChange={(e) => setUrgencySortOrder(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="default">Default (by date)</option>
            <option value="high-to-low">Tinggi → Rendah</option>
            <option value="low-to-high">Rendah → Tinggi</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search comments.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 w-full sm:w-60"
        />

        <button
          onClick={handleDownloadCSV}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded transition-all duration-300"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto max-h-[75vh] overflow-y-auto rounded-md">
        <table className="min-w-full table-auto border-separate border-spacing-y-px">
          <thead className="bg-blue-600 font-semibold text-white text-sm sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">Timestamp</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Comments</th>
              <th className="p-3 text-left">Sentiment</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Urgency</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {getSortedComments().map((comment, index) => {
              const urgency = getUrgency(comment.sentiment, comment.category);
              const rowBg =
                urgency === "Tinggi"
                  ? "bg-red-50"
                  : urgency === "Sedang"
                  ? "bg-yellow-50"
                  : "";

              return (
                <tr key={index} className={`border-b hover:bg-gray-100 ${rowBg}`}>
                  <td className="p-3">{formatDate(comment.timestamp)}</td>
                  <td className="p-3">{comment.username || "Unknown"}</td>
                  <td className="p-3 whitespace-pre-wrap break-words max-w-xs">
                    {comment.text}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-semibold capitalize ${
                        comment.sentiment.toLowerCase() === "negatif"
                          ? "bg-red-600"
                          : comment.sentiment.toLowerCase() === "positif"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {comment.sentiment}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                        comment.category?.toLowerCase() === "pertanyaan"
                          ? "bg-purple-200 text-purple-800"
                          : comment.category?.toLowerCase() === "pernyataan"
                          ? "bg-purple-700 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {comment.category || "-"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        urgency === "Tinggi"
                          ? "bg-red-200 text-red-800"
                          : urgency === "Sedang"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {urgency}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
