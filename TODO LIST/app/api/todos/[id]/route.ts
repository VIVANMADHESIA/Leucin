import { NextResponse } from "next/server"
import { TodoStorage } from "@/lib/todo-storage"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await TodoStorage.deleteTodo(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Unexpected error in DELETE /api/todos/[id]:", error)
    return NextResponse.json({ error: error.message || "Failed to delete todo" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validate the request body
    if (
      body.title !== undefined &&
      (typeof body.title !== "string" || body.title.trim() === "") &&
      body.completed === undefined
    ) {
      return NextResponse.json({ error: "Invalid update data" }, { status: 400 })
    }

    // Prepare update data
    const updateData: { title?: string; completed?: boolean } = {}
    if (body.title !== undefined) {
      updateData.title = body.title.trim()
    }
    if (body.completed !== undefined) {
      updateData.completed = body.completed
    }

    const updatedTodo = await TodoStorage.updateTodo(id, updateData)
    return NextResponse.json(updatedTodo)
  } catch (error: any) {
    console.error("Unexpected error in PUT /api/todos/[id]:", error)
    return NextResponse.json({ error: error.message || "Failed to update todo" }, { status: 500 })
  }
}
