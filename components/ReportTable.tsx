'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ import context

export default function ReportTable() {
  const { currentUser } = useAuth(); // ✅ get currentUser from context
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      if (!currentUser?.uid) return;
  
      try {
        const res = await fetch(`/api/reports?userId=${currentUser.uid}`);
  
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Request failed: ${res.status} — ${errText}`);
        }
  
        const data = await res.json();
  
        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          return;
        }
  
        setReports(data);
      } catch (err) {
        console.error("Error loading reports:", err.message || err);
      }
    }
  
    fetchReports();
  }, [currentUser]);
  

  return (
    <section>
      <h2>Generated Reports</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.id}>
              <strong>{report.title}</strong> — {report.category} — ${report.total}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
