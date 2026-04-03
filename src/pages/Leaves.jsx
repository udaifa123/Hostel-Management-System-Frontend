import { useState } from "react";
import API from "../services/api";

const Leave = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const submitLeave = async () => {
    await API.post("/student/leave", {
      fromDate,
      toDate,
      reason,
    });

    alert("Leave Applied");
  };

  return (
    <div>
      <input type="date" onChange={(e)=>setFromDate(e.target.value)} />
      <input type="date" onChange={(e)=>setToDate(e.target.value)} />
      <input type="text" placeholder="Reason"
        onChange={(e)=>setReason(e.target.value)} />
      <button onClick={submitLeave}>Apply Leave</button>
    </div>
  );
};

export default Leave;