"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import removeMarkdown from "remove-markdown";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Trash2 } from "lucide-react";
import { TypewriterMarkdown } from "../TypewriterMarkdown";

const styles = ["Funny", "Formal", "Creative", "Professional"] as const;
type PromptStyle = (typeof styles)[number];

type PromptHistoryItem = {
  prompt: string;
  response: string;
  style: PromptStyle;
  timestamp: string;
};

export default function GeneratePrompt() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<PromptStyle>("Creative");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("prompt-history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const saveToHistory = (item: PromptHistoryItem) => {
    const updatedHistory = [item, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem("prompt-history", JSON.stringify(updatedHistory));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");
    setError("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResponse(data.responses);

      saveToHistory({
        prompt,
        response: data.responses,
        style,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!response) return;

    const plainText = removeMarkdown(response);
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const deleteItem = (timestamp: string) => {
    const updated = history.filter(item => item.timestamp !== timestamp);
    setHistory(updated);
    localStorage.setItem("prompt-history", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("prompt-history");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Prompt Generator */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Prompt Generator
            </CardTitle>
            <CardDescription>
              Generate creative, funny, formal, or professional AI prompts instantly!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Prompt Style</Label>
              <Select value={style} onValueChange={(val: PromptStyle) => setStyle(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(s => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Your Prompt</Label>
              <Textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe what you want..."
                rows={6}
                className="min-h-25 resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-600">Error: {error}</p>}

            <Button onClick={handleSubmit} disabled={loading || !prompt.trim()}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </CardContent>
        </Card>
        <Card className="modern-card w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Prompt</CardTitle>
            {response && (
              <Button onClick={handleCopy} variant="secondary" size="sm">
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading && <p className="text-muted-foreground text-sm">Generating prompt...</p>}

            {!loading && !response && !error && (
              <p className="text-muted-foreground text-sm">
                Your generated prompt will appear here.
              </p>
            )}

            {!loading && error && <p className="text-sm text-red-600">Error: {error}</p>}

            {!loading && response && (
              <div className="w-full p-4">
                <div className="prose dark:prose-invert max-w-none break-words whitespace-pre-wrap">
                  <TypewriterMarkdown text={response} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Prompt History</CardTitle>
          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all prompts and responses from your history. Are
                    you sure?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearHistory}
                    className="bg-destructive hover:bg-destructive/90 text-white"
                  >
                    Yes, delete all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No prompt history yet.</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {history.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="line-clamp-1 font-medium">{item.prompt}</span>
                      <span className="text-muted-foreground text-xs">
                        {item.style} • {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-2">
                    <div>
                      <p className="mb-1 font-semibold">Prompt:</p>
                      <p className="text-muted-foreground">{item.prompt}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-semibold">Response:</p>
                      <div className="prose prose-blue dark:prose-invert max-w-none">
                        <Markdown rehypePlugins={[rehypeHighlight]}>{item.response}</Markdown>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive mt-3">
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this prompt?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove this prompt and its response from history. This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteItem(item.timestamp)}
                              className="bg-destructive hover:bg-destructive/90 text-white"
                            >
                              Yes, delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
