import { NextResponse } from "next/server";
import { collection, getDocs, query, where, Timestamp, addDoc } from "firebase/firestore";
import { db } from "@/firebaseServer";

export async function GET() {
    return new Response("Method not allowed", { status: 405 });
  }

export async function POST(request: Request) {
  try {
    const { title, category, userId } = await request.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Invalid or missing title" }, { status: 400 });
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Missing or invalid userId" }, { status: 400 });
    }

    const subsRef = collection(db, "subscriptions");

    let q;
    if (category && category !== "All") {
      q = query(subsRef, where("category", "==", category), where("userId", "==", userId));
    } else {
      q = query(subsRef, where("userId", "==", userId));
    }

    const snapshot = await getDocs(q);

    const total = snapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      const amount = parseFloat(data.cost || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    await addDoc(collection(db, "reports"), {
      title,
      category: category || "All",
      total,
      userId, // ✅ required for security rules
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ message: "Report created", total });
  } catch (error: any) {
    console.error("Error generating report:", error.message);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
