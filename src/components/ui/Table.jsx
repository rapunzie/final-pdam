const Table = ({ headers = [], data = [] }) => {
  console.log('ini data : ', data)
    return (
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border border-gray-300">
                {/* {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                    {cell}
                  </td>
                ))} */}
                <td className="border border-gray-300 px-4 py-2">{row['id']}</td>
                <td className="border border-gray-300 px-4 py-2">{row['text']}</td>
                <td className="border border-gray-300 px-4 py-2">{row['sentiment']}</td>
                <td className="border border-gray-300 px-4 py-2">{row['category']}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center p-4">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  
  export default Table;  