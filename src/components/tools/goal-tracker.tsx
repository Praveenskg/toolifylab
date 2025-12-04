"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline: string;
  createdAt: string;
}
const STORAGE_KEY = "toolifylab-goals";
export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    category: "",
    deadline: "",
  });
  const categories = [
    "Financial",
    "Health & Fitness",
    "Career",
    "Education",
    "Personal",
    "Travel",
    "Business",
    "Other",
  ];
  const saveToLocalStorage = (goalsToSave: Goal[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(goalsToSave));
      } catch (error) {
        console.error("Error saving goals to localStorage:", error);
      }
    }
  };
  const loadFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const savedGoals = localStorage.getItem(STORAGE_KEY);
      if (savedGoals) {
        try {
          const parsedGoals = JSON.parse(savedGoals);
          setGoals(parsedGoals);
          return parsedGoals;
        } catch (error) {
          console.error("Error loading goals from localStorage:", error);
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        // No saved goals found in localStorage
      }
    }
    return [];
  };
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      loadFromLocalStorage();
    }, 0);
  }, []);
  useEffect(() => {
    if (goals.length > 0) {
      saveToLocalStorage(goals);
    }
  }, [goals]);
  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount) return;
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetAmount: Number.parseFloat(newGoal.targetAmount),
      currentAmount: Number.parseFloat(newGoal.currentAmount) || 0,
      category: newGoal.category,
      deadline: newGoal.deadline,
      createdAt: new Date().toISOString(),
    };
    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    saveToLocalStorage(updatedGoals);
    setNewGoal({
      title: "",
      description: "",
      targetAmount: "",
      currentAmount: "",
      category: "",
      deadline: "",
    });
    setIsAddingGoal(false);
  };
  const updateGoalProgress = (goalId: string, newAmount: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, currentAmount: newAmount } : goal
    );
    setGoals(updatedGoals);
    saveToLocalStorage(updatedGoals);
  };
  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    saveToLocalStorage(updatedGoals);
    setIsDeleteDialogOpen(false);
    setGoalToDelete(null);
  };
  const clearAllGoals = () => {
    setGoals([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsClearAllDialogOpen(false);
  };
  const handleDeleteGoal = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete.id);
    }
  };
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };
  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const getStatusColor = (current: number, target: number, deadline: string) => {
    const progress = getProgressPercentage(current, target);
    const daysRemaining = getDaysRemaining(deadline);
    if (progress >= 100) return "text-green-600";
    if (daysRemaining !== null && daysRemaining < 0) return "text-red-600";
    if (daysRemaining !== null && daysRemaining < 30) return "text-yellow-600";
    return "text-blue-600";
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button className="modern-button">
              <Plus className="mr-2 h-4 w-4" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>
                Create a new goal to track your progress towards achieving it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="Enter goal title"
                  value={newGoal.title}
                  onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal"
                  className="resize-none"
                  value={newGoal.description}
                  onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="Target value"
                    value={newGoal.targetAmount}
                    onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentAmount">Current Amount</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    placeholder="Current value"
                    value={newGoal.currentAmount}
                    onChange={e => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={value => setNewGoal({ ...newGoal, category: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newGoal.deadline && "text-muted-foreground",
                          newGoal.deadline && "text-accent-foreground"
                        )}
                      >
                        {newGoal.deadline ? (
                          format(new Date(newGoal.deadline), "PPP")
                        ) : (
                          <CalendarIcon className="mr-2 h-4 w-4" />
                        )}
                        {newGoal.deadline ? "Change date" : "Set deadline"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newGoal.deadline ? new Date(newGoal.deadline) : undefined}
                        onSelect={date => {
                          setNewGoal({
                            ...newGoal,
                            deadline: date?.toISOString() || "",
                          });
                        }}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button onClick={addGoal} className="w-full">
                Add Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {goals.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setIsClearAllDialogOpen(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Goals
          </Button>
        )}
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{goalToDelete?.title}&quot;? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setGoalToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGoal}>
              Delete Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Clear All Goals</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all {goals.length} goals? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsClearAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={clearAllGoals}>
              Clear All Goals
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No Goals Yet</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Start tracking your progress by adding your first goal.
            </p>
            <Button onClick={() => setIsAddingGoal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map(goal => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const statusColor = getStatusColor(
              goal.currentAmount,
              goal.targetAmount,
              goal.deadline
            );
            return (
              <Card key={goal.id} className="modern-card relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription className="mt-1">{goal.description}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setGoalToDelete(goal);
                      }}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {goal.category && (
                    <Badge
                      variant="secondary"
                      className="from-primary/10 to-primary/5 text-primary border-primary/20 w-fit bg-linear-to-r"
                    >
                      {goal.category}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className={statusColor}>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-muted-foreground flex justify-between text-sm">
                      <span>{goal.currentAmount.toLocaleString()}</span>
                      <span>{goal.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  {goal.deadline && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Deadline: </span>
                      <span className={statusColor}>
                        {new Date(goal.deadline).toLocaleDateString()}
                        {daysRemaining !== null && (
                          <span className="ml-1">
                            (
                            {daysRemaining > 0
                              ? `${daysRemaining} days left`
                              : daysRemaining === 0
                                ? "Due today"
                                : `${Math.abs(daysRemaining)} days overdue`}
                            )
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Update progress"
                      className="flex-1"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          const value = Number.parseFloat((e.target as HTMLInputElement).value);
                          if (!isNaN(value)) {
                            updateGoalProgress(goal.id, value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={e => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const value = Number.parseFloat(input.value);
                        if (!isNaN(value)) {
                          updateGoalProgress(goal.id, value);
                          input.value = "";
                        }
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Goal Summary</CardTitle>
            <CardDescription>Overview of your goal progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="modern-card rounded-xl border p-4 text-center">
                <div className="text-2xl font-bold">{goals.length}</div>
                <div className="text-muted-foreground text-sm">Total Goals</div>
              </div>
              <div className="modern-card rounded-xl border p-4 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {
                    goals.filter(g => getProgressPercentage(g.currentAmount, g.targetAmount) >= 100)
                      .length
                  }
                </div>
                <div className="text-muted-foreground text-sm">Completed</div>
              </div>
              <div className="modern-card rounded-xl border p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    goals.filter(g => {
                      const progress = getProgressPercentage(g.currentAmount, g.targetAmount);
                      return progress > 0 && progress < 100;
                    }).length
                  }
                </div>
                <div className="text-muted-foreground text-sm">In Progress</div>
              </div>
              <div className="modern-card rounded-xl border p-4 text-center">
                <div className="text-2xl font-bold">
                  {goals.length > 0
                    ? (
                        goals.reduce(
                          (sum, goal) =>
                            sum + getProgressPercentage(goal.currentAmount, goal.targetAmount),
                          0
                        ) / goals.length
                      ).toFixed(1) + "%"
                    : "0%"}
                </div>
                <div className="text-muted-foreground text-sm">Average Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
