"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/Progress";

// NEW: Circular ProgressBar component
function CircularProgress({ value }: { value: number }) {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="w-22 h-20 relative"> 
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#3b82f6"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center  text-center justify-center text-sm font-semibold">
        {Math.round(value)}%
      </div>
    </div>
  );
}

type TaskItem = {
  id?: number; 
  title: string;
  topic: string;
  isCompleted?: boolean;
};

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      const parsed: TaskItem[] = JSON.parse(saved);
      setTasks(parsed);
      const comp: Record<number, boolean> = {};
      parsed.forEach((task, i) => {
        comp[i] = !!task.isCompleted;
      });
      setCompleted(comp);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const generateTasks = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    const newTasks: TaskItem[] = (data.tasks || []).map((t: string) => ({
      title: t,
      topic,
      isCompleted: false,
    }));
    setTasks(newTasks);
    setCompleted({});
    setLoading(false);
  };

  const toggleComplete = (index: number) => {
    const updated = [...tasks];
    updated[index].isCompleted = !updated[index].isCompleted;
    setTasks(updated);
    setCompleted((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const saveTask = async (task: TaskItem, index: number) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        topic: task.topic,
        isCompleted: task.isCompleted || false,
      }),
    });

    if (res.ok) {
      const result = await res.json();
      setTasks((prev) => {
        const copy = [...prev];
        copy[index] = { ...task, id: result.task?.id };
        return copy;
      });
      alert("✅ Task saved to database");
    } else {
      alert("❌ Failed to save task");
    }
  };

  const deleteTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedTitle(tasks[index].title);
  };

  const applyEdit = (index: number) => {
    const updated = [...tasks];
    updated[index].title = editedTitle;
    setTasks(updated);
    setEditingIndex(null);
    setEditedTitle("");
  };

  const completedCount = tasks.filter((task) => task.isCompleted).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Generate AI Tasks</h1>

      <div className="flex gap-2">
        <Input
          placeholder="Enter a topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button onClick={generateTasks} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {tasks.length > 0 && (
        <div className="flex items-center gap-4">
          <Progress value={progress} className="flex-1" />
          <CircularProgress value={progress} />
        </div>
      )}

      <ul className="space-y-3">
        {tasks.map((task, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded shadow"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={!!completed[i]}
                onCheckedChange={() => toggleComplete(i)}
              />
              {editingIndex === i ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => applyEdit(i)}
                  autoFocus
                />
              ) : (
                <span
                  className={completed[i] ? "line-through text-gray-500" : ""}
                  onDoubleClick={() => startEditing(i)}
                >
                  {task.title}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => saveTask(task, i)}>
                Save
              </Button>
              <Button variant="destructive" onClick={() => deleteTask(i)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
