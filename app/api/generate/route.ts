import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";



export async function POST(req: NextRequest) {
    const { userId } = await auth(); 

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic } = await req.json();

    if (!topic) {
        return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `Generate a list of 5 concise, actionable tasks to learn about "${topic}". Return only the tasks, no numbering or formatting.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return NextResponse.json({ error: "Failed to generate tasks" }, { status: 500 });
        }

        const generatedTasks = text
            .split("\n")
            .map((task: string) => task.trim())
            .filter((task: string) => task.length > 0);
        const inserts: typeof tasks.$inferInsert[] = generatedTasks.map((task:string) => ({
            userId,
            title: task,
            topic,
            isCompleted: false,
        }));

        await db.insert(tasks).values(inserts);

        return NextResponse.json({ tasks: generatedTasks });
    } catch (error) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: "POST to /api/generate to use the Gemini API." });
}
