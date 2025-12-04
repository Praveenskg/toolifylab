"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getFromStorage, isStorageAvailable, setToStorage } from "@/lib/utils";
import { format, isPast, isToday, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Check, CheckSquare, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  priority?: "high" | "medium" | "low";
  edited?: boolean;
}

const STORAGE_KEY = "toolifylab-todos";

export default function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDueDate, setNewDueDate] = useState<Date | undefined>();
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [isEditingMainInput, setIsEditingMainInput] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  const saveTodosToLocalStorage = (todosToSave: TodoItem[]) => {
    if (!isStorageAvailable()) {
      return;
    }

    const success = setToStorage(STORAGE_KEY, todosToSave);
    if (!success) {
      // Could show a toast notification here if needed
    }
  };

  const loadFromLocalStorage = (): TodoItem[] => {
    if (!isStorageAvailable()) {
      return [];
    }

    const savedTodos = getFromStorage(STORAGE_KEY, []);
    setTodos(savedTodos);
    return savedTodos;
  };

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      loadFromLocalStorage();
    }, 0);
  }, []);
  useEffect(() => {
    if (todos.length > 0) {
      saveTodosToLocalStorage(todos);
    }
  }, [todos]);

  const handleAddOrUpdate = () => {
    if (!newTask.trim()) return;

    if (isEditingMainInput && editingTodoId) {
      setTodos(
        todos.map(t =>
          t.id === editingTodoId
            ? {
                ...t,
                task: newTask.trim(),
                dueDate: newDueDate?.toISOString(),
                priority: newPriority,
                edited: true,
              }
            : t
        )
      );
    } else {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        task: newTask.trim(),
        completed: false,
        dueDate: newDueDate?.toISOString(),
        createdAt: new Date().toISOString(),
        priority: newPriority,
      };
      setTodos([newTodo, ...todos]);
    }

    setNewTask("");
    setNewDueDate(undefined);
    setNewPriority("medium");
    setIsEditingMainInput(false);
    setEditingTodoId(null);
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      setTodos(todos.filter(t => t.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    }
  };

  const confirmClear = () => {
    setTodos([]);
    localStorage.removeItem(STORAGE_KEY);
    setNewTask("");
    setNewDueDate(undefined);
    setNewPriority("medium");
    setIsEditingMainInput(false);
    setEditingTodoId(null);
    setConfirmClearAll(false);
  };

  const filteredTodos = [...todos]
    .filter(t =>
      filter === "completed" ? t.completed : filter === "pending" ? !t.completed : true
    )
    .sort((a, b) => {
      const comp = Number(a.completed) - Number(b.completed);
      if (comp !== 0) return comp;
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && !b.dueDate) return -1;
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="text-primary h-5 w-5" /> Todo Summary
          </CardTitle>
          <CardDescription>Overview of your tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="modern-card rounded-lg border p-4 text-center">
            <div className="text-xl font-bold">{todos.length}</div>
            <div className="text-muted-foreground text-sm">Total Tasks</div>
          </div>
          <div className="modern-card rounded-lg border p-4 text-center">
            <div className="text-xl font-bold text-green-600">
              {todos.filter(t => t.completed).length}
            </div>
            <div className="text-muted-foreground text-sm">Completed</div>
          </div>
          <div className="modern-card rounded-lg border p-4 text-center">
            <div className="text-xl font-bold text-yellow-600">
              {todos.filter(t => !t.completed).length}
            </div>
            <div className="text-muted-foreground text-sm">Pending</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Manage Your Tasks</CardTitle>
          {todos.length > 0 && (
            <Dialog open={confirmClearAll} onOpenChange={setConfirmClearAll}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear All
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear All Tasks</DialogTitle>
                  <DialogDescription>
                    This will delete all your tasks. Are you sure?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setConfirmClearAll(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmClear}>
                    Confirm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Add a new task"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddOrUpdate()}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDueDate ? format(newDueDate, "PPP") : "Set Due Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={newDueDate}
                  onSelect={setNewDueDate}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
            <Select
              value={newPriority}
              onValueChange={val => setNewPriority(val as "high" | "medium" | "low")}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {[
                  {
                    value: "high",
                    color: "bg-red-500",
                    label: "High",
                    desc: "Urgent task",
                  },
                  {
                    value: "medium",
                    color: "bg-yellow-500",
                    label: "Medium",
                    desc: "Important but not urgent",
                  },
                  {
                    value: "low",
                    color: "bg-green-500",
                    label: "Low",
                    desc: "Nice to have",
                  },
                ].map(({ value, color, label, desc }) => (
                  <TooltipProvider key={value}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SelectItem value={value}>
                          <span className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${color}`} />
                            {label}
                          </span>
                        </SelectItem>
                      </TooltipTrigger>
                      <TooltipContent side="right">{desc}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddOrUpdate}>{isEditingMainInput ? "Update" : "Add"}</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "completed", "pending"].map(type => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                onClick={() => setFilter(type as "all" | "completed" | "pending")}
                size="sm"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredTodos.length === 0 ? (
              <p className="text-muted-foreground text-center">No tasks found.</p>
            ) : (
              filteredTodos.map(todo => (
                <Card key={todo.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p
                        className={`text-sm font-medium ${todo.completed ? "text-muted-foreground line-through" : ""}`}
                      >
                        {todo.task}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={todo.completed ? "secondary" : "outline"}>
                          {todo.completed ? "Completed" : "Pending"}
                        </Badge>
                        {todo.dueDate && (
                          <Badge
                            variant="outline"
                            className={
                              isPast(parseISO(todo.dueDate)) && !todo.completed
                                ? "bg-red-200 text-red-800"
                                : isToday(parseISO(todo.dueDate))
                                  ? "bg-yellow-200 text-yellow-800"
                                  : ""
                            }
                          >
                            Due: {format(new Date(todo.dueDate), "dd MMM yyyy")}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            todo.priority === "high"
                              ? "bg-red-200 text-red-800"
                              : todo.priority === "medium"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-green-200 text-green-800"
                          }
                        >
                          Priority: {todo.priority}
                        </Badge>

                        {todo.edited && <Badge variant="outline">Edited</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => toggleComplete(todo.id)}
                              className="text-green-600"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Mark as {todo.completed ? "Incomplete" : "Completed"}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setNewTask(todo.task);
                                setNewDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
                                setNewPriority(todo.priority || "medium");
                                setIsEditingMainInput(true);
                                setEditingTodoId(todo.id);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Task</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => setConfirmDeleteId(todo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Task</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <Dialog open={!!confirmDeleteId} onOpenChange={open => !open && setConfirmDeleteId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{todos.find(t => t.id === confirmDeleteId)?.task}</strong>?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
