import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import id from "date-fns/locale/id";
const api_url = import.meta.env.VITE_API_URL;

registerLocale("id", id);

const Spinner = () => (
  <div className="animate-spin h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent" />
);

const SummaryCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 1));
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");
    setError("");

    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    try {
      const res = await fetch(`${api_url}/summarize?month=${month}&year=${year}`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true"
        },}) ;
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil ringkasan.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSummary("");
    setError("");
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const selectedMonth = monthNames[selectedDate.getMonth()];
  const selectedYear = selectedDate.getFullYear();

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl w-[400px] mx-auto mt-10 border border-gray-100">
      {/* Header dots */}
      <div className="flex space-x-2 mb-4">
        <span className="h-3 w-3 bg-red-400 rounded-full shadow-sm"></span>
        <span className="h-3 w-3 bg-yellow-400 rounded-full shadow-sm"></span>
        <span className="h-3 w-3 bg-green-400 rounded-full shadow-sm"></span>
      </div>

      <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">Summarizing Tool</h2>
      <p className="text-sm text-gray-500 text-center mb-4">Pick a month and year to summarize.</p>

      {!summary && (
        <div className="flex justify-center mb-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            locale="id"
            className="border border-gray-300 rounded-lg p-2 text-center w-40 focus:outline-indigo-500"
          />
        </div>
      )}

      {/* Status */}
      {loading ? (
        <div className="flex flex-col items-center my-6">
          <Spinner />
          <p className="mt-3 text-gray-500 text-sm">Memuat ringkasan...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center my-4">{error}</p>
      ) : summary ? (
        <>
          <p className="text-center text-sm text-gray-500 mb-2">
            Ringkasan untuk <strong>{selectedMonth} {selectedYear}</strong>
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border text-gray-800 whitespace-pre-line my-4 max-h-80 overflow-y-auto">
            {summary}
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-center text-sm mb-4">
        </p>
      )}

      {/* Button */}
      <button
        onClick={summary ? handleBack : handleSummarize}
        className={`w-full py-2 rounded-full text-white font-semibold text-sm transition-all shadow-md ${
          loading
            ? "bg-indigo-300 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
        }`}
        disabled={loading}
      >
        {loading ? "Memproses..." : summary ? "Back" : "Summarize"}
      </button>
    </div>
  );
};

export default SummaryCard;