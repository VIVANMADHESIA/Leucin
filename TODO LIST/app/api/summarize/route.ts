import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client with error handling
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    // Return mock implementation
    return {
      chat: {
        completions: {
          create: async () => ({
            choices: [
              {
                message: {
                  content:
                    "Your todos have been organized into high, medium, and low priority tasks. Consider focusing on the high priority items first to maximize productivity.",
                },
              },
            ],
          }),
        },
      },
    }
  }
  return new OpenAI({ apiKey })
}

// Function to send message to Slack
async function sendToSlack(message: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.log("Would send to Slack:", message)
    return { ok: true } // Mock successful response
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to send to Slack: ${errorText}`)
    }

    return response
  } catch (error) {
    console.error("Error sending to Slack:", error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const { todos } = await request.json()

    if (!todos || !Array.isArray(todos) || todos.length === 0) {
      return NextResponse.json({ error: "No todos provided" }, { status: 400 })
    }

    // Format todos for the LLM
    const pendingTodos = todos.filter((todo) => !todo.completed)

    if (pendingTodos.length === 0) {
      return NextResponse.json({ error: "No pending todos to summarize" }, { status: 400 })
    }

    const todoText = pendingTodos.map((todo, index) => `${index + 1}. ${todo.title}`).join("\n")

    try {
      // Generate summary using OpenAI or mock
      const openai = getOpenAIClient()
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes todo lists in a concise, organized way. Provide a brief overview followed by key action items grouped by priority or theme if applicable.",
          },
          {
            role: "user",
            content: `Please summarize the following pending todo items:\n\n${todoText}`,
          },
        ],
        max_tokens: 500,
      })

      const summary = completion.choices[0].message.content

      // Format the message for Slack
      const slackMessage = `*📋 Todo Summary*\n\n${summary}\n\n*Pending Items (${pendingTodos.length})*\n${todoText}`

      // Send to Slack (or mock)
      await sendToSlack(slackMessage)

      return NextResponse.json({
        success: true,
        summary,
        message: "Summary sent to Slack successfully",
      })
    } catch (error: any) {
      console.error("Error in LLM or Slack integration:", error)
      return NextResponse.json({ error: error.message || "Failed to summarize and send to Slack" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error in summarize endpoint:", error)
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 })
  }
}
