import { NextResponse } from "next/server"
import { TodoStorage } from "@/lib/todo-storage"

export async function GET() {
  try {
    const todos = await TodoStorage.getTodos()
    return NextResponse.json(todos)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/todos:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch todos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title } = body

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newTodo = await TodoStorage.addTodo(title)
    return NextResponse.json(newTodo, { status: 201 })
  } catch (error: any) {
    console.error("Unexpected error in POST /api/todos:", error)
    return NextResponse.json({ error: error.message || "Failed to create todo" }, { status: 500 })
  }
}
