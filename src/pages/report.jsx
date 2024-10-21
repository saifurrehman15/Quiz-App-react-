import { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import { db } from "../utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { message, Spin } from "antd";

function CheatingReport() {
  const { cheatData } = useContext(userContext);
  const [loader, setLoader] = useState(false);
  console.log(cheatData);

  const removeSupension = async (id) => {
    setLoader(true);
    const q = doc(db, "cheatDetector", id);
    await deleteDoc(q);
    message.success("Supension Removed");
    cheatData.length = 0;
    setLoader(false);
  };
  return (
    <div>
      <h2 className="text-white font-bold text-2xl mb-4">Cheaters Report</h2>
      {cheatData.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {cheatData.map((report) => (
            <div className="border border-gray-300 font-mono h-auto  rounded-md w-[300px] text-white p-4 text-center">
              <h2 className="text-2xl font-bold">{report.displayName}</h2>
              <div className="flex justify-between mt-4">
                <p>Reason of Suspension</p>
                <p className="bg-blue-600 rounded p-1 px-2">
                  {report?.reasons[0]}
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <p>Suspended At</p>
                <p>{report.timeSuspend.toDate().toLocaleTimeString()}</p>
              </div>
              <div className="flex justify-between mt-4">
                <p>Suspension Time</p>
                <p>For 10 hours</p>
              </div>
              <button
                onClick={() => removeSupension(report?.id)}
                className="bg-red-500 p-2  rounded mt-4 w-full hover:scale-105 transition-all"
              >
                {loader ? <Spin /> : "Forgive"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <h2 className="text-red-500 font-bold">No Reports Found!</h2>
      )}
    </div>
  );
}

export default CheatingReport;
