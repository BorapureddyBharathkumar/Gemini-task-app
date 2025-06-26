// app/api/tasks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, topic } = await req.json();

  if (!title || !topic) {
    return NextResponse.json({ error: "Title and topic are required" }, { status: 400 });
  }

  try {
    await db.insert(tasks).values({
      userId,
      title,
      topic,
      isCompleted: false,
    });

    return NextResponse.json({ message: "Task saved successfully" });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Failed to save task" }, { status: 500 });
  }
}
