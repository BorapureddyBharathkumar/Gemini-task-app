// app/api/tasks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { eq } from "drizzle-orm";

// ✅ GET: Fetch tasks
export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .limit(5); // optional: fetch only 5

  return NextResponse.json(result);
}

// ✅ POST: Create task
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, topic, isCompleted = false } = await req.json();

  if (!title || !topic) {
    return NextResponse.json({ error: "Title and topic are required" }, { status: 400 });
  }

  try {
    const result = await db.insert(tasks).values({
      userId,
      title,
      topic,
      isCompleted,
    }).returning();

    return NextResponse.json({ message: "Task saved", task: result[0] });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Failed to save task" }, { status: 500 });
  }
}

// ✅ PUT: Update task
export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, isCompleted } = await req.json();
  if (!id) return NextResponse.json({ error: "Task ID required" }, { status: 400 });

  await db.update(tasks)
    .set({ title, isCompleted })
    .where(eq(tasks.id, id));

  return NextResponse.json({ message: "Task updated" });
}

// ✅ DELETE: Delete task
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Task ID required" }, { status: 400 });

  await db.delete(tasks).where(eq(tasks.id, id));

  return NextResponse.json({ message: "Task deleted" });
}
