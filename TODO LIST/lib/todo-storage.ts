import { createClient } from "@supabase/supabase-js"

export interface Todo {
  id: string
  title: string
  completed: boolean
  created_at?: string
}

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const isSupabaseConfigured = !!(supabaseUrl && supabaseKey)

// Create a class to handle todo storage with both Supabase and localStorage implementations
export class TodoStorage {
  private static supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseKey!) : null

  static isUsingLocalStorage = !isSupabaseConfigured

  // Generate a unique ID (for localStorage implementation)
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Get all todos
  static async getTodos(): Promise<Todo[]> {
    if (this.supabase) {
      // Use Supabase
      const { data, error } = await this.supabase.from("todos").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error fetching todos:", error)
        throw new Error(error.message)
      }

      return data || []
    } else {
      // Use localStorage
      if (typeof window === "undefined") return [] // Handle server-side rendering

      try {
        const todos = localStorage.getItem("todos")
        return todos ? JSON.parse(todos) : []
      } catch (error) {
        console.error("Error reading from localStorage:", error)
        return []
      }
    }
  }

  // Add a new todo
  static async addTodo(title: string): Promise<Todo> {
    if (this.supabase) {
      // Use Supabase
      const todo = {
        title: title.trim(),
        completed: false,
      }

      const { data, error } = await this.supabase.from("todos").insert([todo]).select()

      if (error) {
        console.error("Error creating todo:", error)
        throw new Error(error.message)
      }

      return data![0]
    } else {
      // Use localStorage
      const newTodo: Todo = {
        id: this.generateId(),
        title: title.trim(),
        completed: false,
        created_at: new Date().toISOString(),
      }

      try {
        const todos = await this.getTodos()
        const updatedTodos = [newTodo, ...todos]
        localStorage.setItem("todos", JSON.stringify(updatedTodos))
        return newTodo
      } catch (error) {
        console.error("Error saving to localStorage:", error)
        throw new Error("Failed to save todo to localStorage")
      }
    }
  }

  // Update a todo
  static async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    if (this.supabase) {
      // Use Supabase
      const { data, error } = await this.supabase.from("todos").update(updates).eq("id", id).select()

      if (error) {
        console.error("Error updating todo:", error)
        throw new Error(error.message)
      }

      if (data.length === 0) {
        throw new Error("Todo not found")
      }

      return data[0]
    } else {
      // Use localStorage
      try {
        const todos = await this.getTodos()
        const todoIndex = todos.findIndex((todo) => todo.id === id)

        if (todoIndex === -1) {
          throw new Error("Todo not found")
        }

        const updatedTodo = { ...todos[todoIndex], ...updates }
        todos[todoIndex] = updatedTodo
        localStorage.setItem("todos", JSON.stringify(todos))

        return updatedTodo
      } catch (error) {
        console.error("Error updating in localStorage:", error)
        throw new Error("Failed to update todo in localStorage")
      }
    }
  }

  // Delete a todo
  static async deleteTodo(id: string): Promise<void> {
    if (this.supabase) {
      // Use Supabase
      const { error } = await this.supabase.from("todos").delete().eq("id", id)

      if (error) {
        console.error("Error deleting todo:", error)
        throw new Error(error.message)
      }
    } else {
      // Use localStorage
      try {
        const todos = await this.getTodos()
        const filteredTodos = todos.filter((todo) => todo.id !== id)
        localStorage.setItem("todos", JSON.stringify(filteredTodos))
      } catch (error) {
        console.error("Error deleting from localStorage:", error)
        throw new Error("Failed to delete todo from localStorage")
      }
    }
  }
}
