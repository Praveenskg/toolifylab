import TodoList from "@/components/tools/todo-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TodoPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto w-full">
            <div className="group text-center">
              <h1 className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent transition duration-300 group-hover:brightness-110 group-hover:saturate-150">
                Todo List
              </h1>
              <p className="text-muted-foreground text-lg">
                Create, manage, and complete your daily tasks efficiently
              </p>
            </div>
            <div className="my-4 flex w-full justify-center sm:justify-start">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <Card className="border-border border shadow-md">
              <CardContent className="p-6">
                <TodoList />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: "To-Do List - Simple Task Manager | Tools by Praveen Singh",
  description:
    "Stay organized with this minimal and effective online to-do list. Add, delete, and manage your daily tasks with ease.",
  keywords: [
    "to-do list",
    "task manager",
    "online checklist",
    "daily planner",
    "todo app",
    "task organizer",
    "productivity tool",
    "simple todo",
    "personal tasks",
    "notes and tasks",
  ],
  openGraph: {
    title: "To-Do List - Simple Task Manager | Tools by Praveen Singh",
    description:
      "Manage your daily tasks with this free and simple to-do list. Designed for clarity and productivity.",
    url: "https://tools.praveensingh.online/todo-list",
    siteName: "Tools by Praveen Singh",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://tools.praveensingh.online/og/todo-list.png",
        width: 1200,
        height: 630,
        alt: "To-Do List OpenGraph Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "To-Do List - Simple Task Manager | Tools by Praveen Singh",
    description:
      "Free online to-do list to manage tasks, goals, and personal reminders. Clean interface for better focus.",
    images: ["https://tools.praveensingh.online/og/todo-list.png"],
  },
};
