import React, { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";

export default function WordCloud() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/get_comments")
      .then((res) => res.json())
      .then((data) => {
        const wordFreq = {};
        data.forEach((comment) => {
          const text = comment.text?.toLowerCase().replace(/[.,?!]/g, "") || "";
          text.split(" ").forEach((word) => {
            if (word.length > 3) {
              wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
          });
        });

        const wordArray = Object.keys(wordFreq).map((word) => ({
          text: word,
          value: wordFreq[word],
        }));

        setWords(wordArray);
      })
      .catch((err) => console.error("Error fetching comments:", err));
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Word Cloud of Customer Complaints
      </h2>
      {words.length > 0 ? (
        <div className="h-[500px]">
          <ReactWordcloud words={words} />
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading word cloud...</p>
      )}
    </div>
  );
}
