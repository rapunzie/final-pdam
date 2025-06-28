import { useState } from "react";

export default function SentimentAnalyzer() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/analyze_comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: inputText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error analyzing comment:", err);
    } finally {
      setLoading(false);
    }
  };

 const getSentimentColor = (sentiment) => {
  const normalized = sentiment?.trim();
  switch (normalized) {
    case "Positive":
      return "bg-green-500";
    case "Neutral":
      return "bg-orange-500";
    case "Negative":
      return "bg-red-600";
    default:
      return "bg-gray-500";
  }
};

const getCategoryColor = (category) => {
  const normalized = category?.toLowerCase().trim();
  switch (normalized) {
    case "pertanyaan":
      return "bg-purple-300";
    case "pernyataan":
      return "bg-purple-700";
    default:
      return "bg-gray-500";
  }
};


  return (
    <div className="w-full min-h-screen p-8 bg-gray-100 flex justify-center items-start">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Analyzer
        </h2>

        <textarea
          rows={5}
          className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-gray-800"
          placeholder="Input text.."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !inputText}
          className={`mt-5 w-full py-2.5 rounded-full font-semibold text-white transition-all shadow-md
            ${
              loading || !inputText
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
            }`}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div className="mt-6 border-t pt-5 space-y-4">
            <div className="flex flex-col items-start gap-2">
              <p className="text-gray-600 text-sm">Hasil prediksi:</p>

              <span
                className={`inline-block px-4 py-1 rounded-full text-white text-sm font-medium ${getSentimentColor(
                  result.sentiment
                )}`}
              >
                Sentiment: {result.sentiment}
              </span>

              <span
                className={`inline-block px-4 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(
                  result.category
                )}`}
              >
                Category: {result.category}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
