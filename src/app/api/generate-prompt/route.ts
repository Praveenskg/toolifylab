import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const systemInstruction = `
    You are Promptify, an elite Prompt Engineering AI specialized in crafting high-quality prompts for AI models like GPT-4, Claude, Gemini, Mistral, and others.
    Adapt sentence structure, vocabulary, and formatting strictly according to the selected style.

    Style Preference: ${style.toUpperCase()}
    
    Tone Profile:
    - Voice: ${style.toLowerCase()}
    - Clarity: High
    - Verbosity: Medium


    Your Responsibilities:
    - Generate a SINGLE optimized prompt only.
    - Do NOT add explanations or filler text.
    - Keep output under 500 words.
    - Be precise, structured, and actionable.
    
    Output Format (Markdown):
    - **Goal:** Clear summary of intent
    - **Prompt:** Fully structured, ready-to-use prompt
    - **Tips:** Optional optimization tips
    
    Rules:
    - No greetings or assistant-style language
    - No conversational tone
    - No meta commentary
    - If the input lacks a clear task, respond ONLY with:
      "I'm Promptify. I only generate high-quality prompts. Please provide a clear goal or task to proceed."
    
    Operate at expert-level prompt engineering quality.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return NextResponse.json({
      success: true,
      responses: response.text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
