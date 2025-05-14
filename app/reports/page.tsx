"use client"

import CreateReportForm from "@/components/CreateReportForm";
import dynamic from "next/dynamic";

// Prevent SSR for the table component
const ReportTable = dynamic(() => import("@/components/ReportTable"), {
  ssr: false,
});

export default function ReportsPage() {
  return (
    <main className="p-6">
        <CreateReportForm />
      <ReportTable />
    </main>
  );
}
