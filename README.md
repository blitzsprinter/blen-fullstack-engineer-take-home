# Next.js Full Stack Engineer Code Challenge: Personal Task Manager

## Overview

Welcome to our Next.js full stack code challenge! This challenge is designed to assess your skills in web application development using Next.js 14+ with the App Router. You'll be building a simple Personal Task Manager application.

## Challenge Requirements

1. Use Next.js 14+ with the App Router
2. Use TypeScript for all code
3. Implement local data storage using SQLite with Drizzle ORM
4. This project comes with Tailwind CSS pre-configured. To save time, we recommend using [shadcn/ui](https://ui.shadcn.com/) for pre-built components. However, you're free to style the application using any method you prefer
5. Implement server actions and mutations for form submissions
6. Use server components as much as possible, only using client components when necessary
7. Ensure your code is properly linted using ESLint (configuration is provided in the project)

## Functionality to Implement

Create the following routes using Next.js App Router:

1. Task List Page (`/`)

   - Display a list of tasks (use a server component)
   - Each task should show its title and due date
   - Include a button to add a new task (client component)
   - Implement a way to refresh the task list

2. Add Task Page (`/add`)

   - Allow users to input a task title, description, and due date
   - Implement form submission using server actions and mutations
   - Validate inputs before saving
   - Save the task to the local SQLite database using Drizzle ORM

3. Task Detail Page (`/[id]`)

   - Show full details of a selected task (server component)
   - Include options to edit or delete the task (client components)

4. Edit Task Page (`/[id]/edit`)
   - Allow users to modify task details
   - Update the task in the local SQLite database using Drizzle ORM

## Getting Started

1. Clone this repository to your local machine
2. Install dependencies: `pnpm install`
3. Run database migrations: `pnpm migrate` or `pnpm drizzle-kit migrate`
4. Start the development server: `pnpm dev`

**Notes:**

- If you would like to manage the database using a GUI, you can use the Drizzle Studio by running `pnpm studio` or `pnpm drizzle-kit studio`.
- If you make any changes to the schema, you will need to generate new Drizzle artifacts by running `pnpm generate` or `pnpm drizzle-kit generate`. Then, you will need to run `pnpm migrate` or `pnpm drizzle-kit migrate` to apply the changes to the database.
- To lint the code, run `pnpm lint`.

## Project Structure

- `src/app/`: Contains the Next.js application routes and components
- `./drizzle.config.ts`: Drizzle configuration
- `src/db/`: Contains the database schema and client setup
- `migrations/`: Contains the database migrations
- `src/styles/`: Global styles (if any)
- `public/`: Static assets

## Important Notes

- This project uses pnpm as the package manager
- SQLite is used for data storage
- Drizzle ORM has been set up with a predefined schema and client
- The Drizzle client is defined in `db/client.ts`
- The Drizzle schema is defined in `db/schema.ts`
- Make sure to use the provided Drizzle setup for database operations
- Implement server actions for form submissions, especially for the task creation form
- Prioritize the use of server components, only using client components when necessary (e.g., for interactivity)
- You may consider using UI libraries such as [shadcn/ui](https://ui.shadcn.com/) for consistent and attractive components, but this is not a requirement

## Bonus Points (Optional)

If you have extra time, consider implementing one or more of the following:

1. Implement a data management library like TanStack Query (or similar) for:
   - Efficient data fetching and caching
   - Data mutations
   - Optimistic updates
   - Cache invalidation
2. Add unit tests for your components and server actions
3. Implement a simple task prioritization feature
4. Implement optimistic updates for a smoother user experience

**Note:** TanStack Query is already added and configured in this project

## Submission Instructions

1. Make sure to submit your work before the deadline indicated in the invitation email
2. Ensure all changes are committed
3. Do not create a pull request
4. Create a bundle: `git bundle create blen_fullstack_challenge.bundle --all`
5. Email your submission to [engineering@blencorp.com] with the subject "Full Stack Code Challenge Submission - [Your Name]"

## Evaluation Criteria

We will evaluate your submission based on:

- Correct implementation of required features
- Effective use of Next.js App Router, server components, and server actions
- Appropriate use of client components only when necessary
- Code quality, organization, and TypeScript usage
- Proper implementation of SQLite with Drizzle ORM
- Git usage and commit history
- Proper code linting and adherence to the provided ESLint configuration
- Bonus features (if implemented, but not required for a strong submission)
- Late submissions are welcome and will be reviewed, though priority will be given to timely submissions

Good luck! We're excited to see your solution.
