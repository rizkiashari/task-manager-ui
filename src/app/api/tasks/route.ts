import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import moment from "moment";
import { Task, CreateTaskRequest } from "../../../types/task";

interface Database {
  tasks: Task[];
}

const dbPath = path.join(process.cwd(), "db.json");

async function readDatabase(): Promise<Database> {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { tasks: [] };
  }
}

async function writeDatabase(data: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const db = await readDatabase();
    return NextResponse.json(db.tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskRequest = await request.json();
    const { title, description } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (title.trim().length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (title.trim().length > 100) {
      return NextResponse.json(
        { error: "Title must be less than 100 characters" },
        { status: 400 }
      );
    }

    if (description && description.trim().length > 500) {
      return NextResponse.json(
        { error: "Description must be less than 500 characters" },
        { status: 400 }
      );
    }

    const db = await readDatabase();
    const now = moment().toISOString();

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      priority: "medium", // Default priority
      dueDate: undefined, // No due date
      createdAt: now,
      updatedAt: now,
    };

    db.tasks.unshift(newTask); // Add to beginning of array
    await writeDatabase(db);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
