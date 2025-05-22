### Todo Summary Assistant

A full-stack application that allows users to create and manage personal to-do items, summarize pending to-dos using an LLM (OpenAI), and send the generated summary to a Slack channel.

## Features

- **User Authentication**

- Register with email and password
- Login/logout functionality
- Password reset flow
- Protected routes



- **Todo Management**

- Create, read, update, and delete to-do items
- Mark to-dos as completed
- User-specific todos (each user only sees their own)



- **AI-Powered Summaries**

- Generate summaries of pending to-dos using OpenAI
- Intelligent organization of tasks by priority or theme



- **Slack Integration**

- Send summaries to a Slack channel via webhooks
- Formatted messages for better readability



- **Responsive Design**

- Works on mobile, tablet, and desktop
- Intuitive user interface





## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **LLM Integration**: OpenAI API
- **Slack Integration**: Incoming Webhooks


## Installation

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account
- OpenAI API key
- Slack workspace with permission to create webhooks

### Setup

1. Clone the repository:

```shellscript
git clone https://github.com/yourusername/todo-summary-assistant.git
cd todo-summary-assistant
```


2. Install dependencies:

```shellscript
npm install
# or
yarn install
```


3. Set up environment variables:

1. Copy `.env.example` to `.env.local`
2. Fill in the required environment variables (see below)



4. Run the development server:

```shellscript
npm run dev
# or
yarn dev
```


5. Open [http://localhost:3000](http://localhost:3000) in your browse

## Environment Variables

Create a `.env.local` file with the following variables:

```plaintext
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI API configuration
OPENAI_API_KEY=your_openai_api_key

# Slack webhook configuration
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Enable email authentication in the Authentication section
3. Create the todos table with the following SQL:


```sql
-- Enable the auth schema
create extension if not exists "uuid-ossp";

-- Create the todos table with user_id foreign key
create table public.todos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  completed boolean default false,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default now()
);

-- Create an RLS policy to restrict access to user's own todos
alter table public.todos enable row level security;

create policy "Users can only access their own todos"
  on public.todos
  for all
  using (auth.uid() = user_id);
```

4. Get your Supabase URL and keys from the API section in the Supabase dashboard


## OpenAI API Setup

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key from the API section
3. Add the API key to your `.env.local` file


## Slack Webhook Setup

1. Create a new Slack app in your workspace at [api.slack.com/apps](https://api.slack.com/apps)
2. Enable Incoming Webhooks
3. Create a new webhook URL for a specific channel
4. Add the webhook URL to your `.env.local` file


## Usage

### Registration and Login

1. Visit the application and register with your email and password
2. Verify your email if required
3. Log in with your credentials


### Managing Todos

1. Add new todos using the input field and "Add" button
2. Mark todos as complete by clicking the checkbox
3. Edit todos by clicking the edit icon
4. Delete todos by clicking the trash icon


### Generating Summaries

1. Click the "Summarize & Send to Slack" button
2. The application will generate a summary of your pending todos using OpenAI
3. The summary will be sent to your configured Slack channel
4. You'll see a success message when the summary is sent


### User Profile

1. Access your profile page from the navigation menu
2. View your account information
3. Change your password if needed


## Project Structure

```plaintext
todo-summary-assistant/
├── app/                      # Next.js app directory
│   ├── (auth)/               # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/
│   │   └── profile/
│   ├── api/                  # API routes
│   │   ├── todos/
│   │   └── summarize/
├── components/               # React components
├── contexts/                 # React contexts
├── lib/                      # Utility functions
└── public/                   # Static assets
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in the Vercel project settings
4. Deploy


### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add the environment variables in the Netlify project settings
4. Deploy


### Manual Deployment

1. Build the application:

```shellscript
npm run build
# or
yarn build
```


2. Deploy the `.next` folder to your hosting provider


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [OpenAI](https://openai.com/)
- [Slack API](https://api.slack.com/)
