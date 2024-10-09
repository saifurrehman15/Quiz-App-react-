import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ResultPage() {
  const [data, setData] = useState({ studentResults: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getData();
  }, [id]); // Fetch data when the id changes

  const getData = async () => {
    try {
      const userDoc = doc(db, "users", id);
      const querySnapshot = await getDoc(userDoc);
      if (querySnapshot.exists()) {
        // If the document exists, set the data state
        setData({ studentResults: querySnapshot.data().result || [] });
      } else {
        setError("No results found for this user.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-white mb-5 text-center">Results</h1>
      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-gray-700 rounded-lg shadow-lg">
            <thead className="bg-blue-600">
              <tr className="text-center text-white">
                <th className="border-b-2 border-gray-300 px-4 py-2">SNo</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Date</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Course</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Quiz</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Score</th>
                <th className="border-b-2 border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.studentResults.map((result, ind) => (
                <tr key={ind} className="hover:bg-gray-600 text-center">
                  <td className="border-b border-gray-300 px-4 py-2 text-white">{ind + 1}</td>
                  <td className="border-b border-gray-300 px-4 py-2 text-white">
                    {result.date ? result.date.toDate().toLocaleDateString() : "N/A"}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2 text-white">{result.course || "N/A"}</td>
                  <td className="border-b border-gray-300 px-4 py-2 text-white">{result.subject || "N/A"}</td>
                  <td className="border-b border-gray-300 px-4 py-2 text-white">
                    {`${result.scores.toFixed(0)}%`}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    <span
                      className={`${
                        result.scores >= 70 ? "bg-green-500" : "bg-red-500"
                      } text-white rounded-full px-4 py-1`}
                    >
                      {result.scores >= 70 ? "Passed" : "Failed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResultPage;
