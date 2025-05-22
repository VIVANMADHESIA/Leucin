# Todo Summary Assistant

A full-stack application that allows users to create and manage personal to-do items, summarize pending to-dos using an LLM (OpenAI), and send the generated summary to a Slack channel.

## Features

- Create, edit, and delete to-do items
- Mark to-dos as completed
- Generate AI-powered summaries of pending to-dos
- Send summaries to a Slack channel
- Responsive UI built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **LLM Integration**: OpenAI API
- **Slack Integration**: Incoming Webhooks

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account
- OpenAI API key
- Slack workspace with permission to create webhooks

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/todo-summary-assistant.git
   cd todo-summary-assistant
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables (see below)

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url
\`\`\`

### Supabase Setup

1. Create a new Supabase project
2. Create a new table called `todos` with the following schema:

\`\`\`sql
create table todos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);
\`\`\`

3. Get your Supabase URL and service role key from the project settings

### OpenAI Setup

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key from the API section
3. Add the API key to your `.env.local` file

### Slack Setup

1. Create a new Slack app in your workspace
2. Enable Incoming Webhooks
3. Create a new webhook URL for a specific channel
4. Add the webhook URL to your `.env.local` file

## Architecture Decisions

### Frontend

- Used Next.js for both frontend and backend to simplify deployment and development
- Implemented a responsive UI with Tailwind CSS for easy styling
- Used shadcn/ui components for a consistent and accessible design
- Added loading states and error handling for a better user experience

### Backend

- Used Next.js API routes to handle backend logic
- Implemented RESTful endpoints for CRUD operations
- Added proper error handling and validation

### Database

- Used Supabase for its simplicity and PostgreSQL compatibility
- Structured the todos table with necessary fields for the application

### LLM Integration

- Used OpenAI's GPT-3.5 Turbo for generating summaries
- Implemented a system prompt to guide the AI in creating useful summaries

### Slack Integration

- Used Incoming Webhooks for simplicity
- Formatted messages to be readable and useful in Slack

## Deployment

This application can be deployed to Vercel with minimal configuration:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in the Vercel project settings
4. Deploy

## License

MIT
