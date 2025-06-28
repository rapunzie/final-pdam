import { useState } from "react";

const PaginatedTable = ({ data = [], itemsPerPage = 50, sentimentColors = {}, categoryColors = {} }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  // Fungsi untuk navigasi halaman
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // pagination max 5 pages
  const getPaginationRange = () => {
    const range = [];
    const maxPageToShow = 10;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < maxPageToShow - 1) {
      if (currentPage <= 3) {
        end = Math.min(totalPages, start + maxPageToShow - 1);
      } else {
        start = Math.max(1, end - maxPageToShow + 1);
      }
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Username</th>
            <th>Complaints</th>
            <th>Sentiment</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((comment, index) => (
            <tr key={index}>
              <td>{comment.timestamp}</td>
              <td>{comment.username || "Unknown"}</td>
              <td>{comment.text}</td>
              <td>
                <span style={{ backgroundColor: sentimentColors[comment.sentiment] }}>
                  {comment.sentiment}
                </span>
              </td>
              <td>
                <span style={{ backgroundColor: categoryColors[comment.category] }}>
                  {comment.category}
                </span>
              </td>
              <td>{comment.replied ? "Replied" : "Not Replied"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Navigasi Pagination */}
      <div className="flex items-center space-x-2 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-800 text-white rounded ${currentPage === 1 ? "opacity-50" : ""}`}
        >
          ← Previous
        </button>

        {getPaginationRange().map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-4 py-2 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-800 text-white"}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-800 text-white rounded ${currentPage === totalPages ? "opacity-50" : ""}`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;