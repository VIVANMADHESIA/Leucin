"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit, Check, X, RefreshCw, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ErrorFallback } from "@/components/error-fallback"
import { TodoStorage, type Todo } from "@/lib/todo-storage"

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [loading, setLoading] = useState(false)
  const [summarizing, setSummarizing] = useState(false)
  const [slackStatus, setSlackStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos()
  }, [])

  // Update the fetchTodos function to include better error handling and logging
  const fetchTodos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/todos")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Server responded with error:", response.status, errorData)
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error("Error fetching todos:", error)
      setError("Failed to load todos. Please check your configuration and try again.")
      toast({
        title: "Error",
        description: "Failed to load todos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      })

      if (!response.ok) throw new Error("Failed to add todo")

      const addedTodo = await response.json()
      setTodos([addedTodo, ...todos])
      setNewTodo("")
      toast({
        title: "Success",
        description: "Todo added successfully!",
      })
    } catch (error) {
      console.error("Error adding todo:", error)
      toast({
        title: "Error",
        description: "Failed to add todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete todo")

      setTodos(todos.filter((todo) => todo.id !== id))
      toast({
        title: "Success",
        description: "Todo deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting todo:", error)
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText("")
  }

  const saveEdit = async (id: string) => {
    if (!editText.trim()) return

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editText }),
      })

      if (!response.ok) throw new Error("Failed to update todo")

      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, title: editText } : todo)))
      setEditingId(null)
      toast({
        title: "Success",
        description: "Todo updated successfully!",
      })
    } catch (error) {
      console.error("Error updating todo:", error)
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      })

      if (!response.ok) throw new Error("Failed to update todo")

      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)))
    } catch (error) {
      console.error("Error updating todo:", error)
      toast({
        title: "Error",
        description: "Failed to update todo status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const summarizeAndSend = async () => {
    if (todos.length === 0) {
      toast({
        title: "No todos",
        description: "You don't have any todos to summarize.",
        variant: "destructive",
      })
      return
    }

    setSummarizing(true)
    setSlackStatus(null)

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todos }),
      })

      if (!response.ok) throw new Error("Failed to summarize and send")

      const result = await response.json()
      setSlackStatus({
        success: true,
        message: "Summary sent to Slack successfully!",
      })
      toast({
        title: "Success",
        description: "Todo summary sent to Slack!",
      })
    } catch (error) {
      console.error("Error summarizing todos:", error)
      setSlackStatus({
        success: false,
        message: "Failed to send summary to Slack. Please try again.",
      })
      toast({
        title: "Error",
        description: "Failed to summarize and send to Slack.",
        variant: "destructive",
      })
    } finally {
      setSummarizing(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      {error ? (
        <ErrorFallback message={error} onRetry={fetchTodos} />
      ) : (
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">Todo Summary Assistant</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={addTodo} className="flex gap-2 mb-6">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1"
              />
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </form>

            {loading ? (
              <div className="flex justify-center my-8">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center text-gray-500 my-8">No todos yet. Add some tasks to get started!</div>
            ) : (
              <div className="space-y-2 mb-6">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      todo.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-6 w-6 rounded-full ${
                          todo.completed
                            ? "bg-green-100 text-green-600 border-green-200"
                            : "bg-gray-100 text-gray-400 border-gray-200"
                        }`}
                        onClick={() => toggleComplete(todo.id, todo.completed)}
                      >
                        {todo.completed && <Check className="h-3 w-3" />}
                      </Button>

                      {editingId === todo.id ? (
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                      ) : (
                        <span className={`flex-1 ${todo.completed ? "line-through text-gray-500" : ""}`}>
                          {todo.title}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {editingId === todo.id ? (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => saveEdit(todo.id)}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={cancelEditing}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => startEditing(todo)}>
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={summarizeAndSend}
                disabled={summarizing || todos.length === 0}
              >
                {summarizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Summarize & Send to Slack
                  </>
                )}
              </Button>
            </div>

            {slackStatus && (
              <Alert
                className={`mt-4 ${
                  slackStatus.success
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                <AlertDescription>{slackStatus.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
      <Toaster />
    </div>
  )
}
