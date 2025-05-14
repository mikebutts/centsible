import { NextRequest } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseServer"; // Make sure this points to server-safe Firebase config

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    console.log("Incoming request for reports. userId:", userId);

    if (!userId) {
      console.warn("Missing userId in query param");
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const q = query(collection(db, "reports"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log(`Fetched ${reports.length} reports for user ${userId}`);

    return new Response(JSON.stringify(reports), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("🔥 API /reports error:", err.message || err);
    return new Response(JSON.stringify({ error: "Failed to fetch reports" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
