import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert coding assistant. The user has shared their code with you. Answer their questions about the code clearly and concisely. You can:
- Explain code functionality
- Suggest optimizations
- Find edge cases and bugs
- Help with refactoring
- Answer general programming questions

Be helpful, specific, and give code examples when relevant. Use markdown formatting.`;

export async function POST(request) {
  try {
    const { message, code, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (code) {
      messages.push({
        role: "user",
        content: `Here is the code I'm working with:\n\`\`\`\n${code}\n\`\`\``,
      });
      messages.push({
        role: "assistant",
        content: "I can see your code. What would you like to know about it?",
      });
    }

    // Add conversation history
    history.forEach((msg) => {
      messages.push({ role: msg.role, content: msg.content });
    });

    messages.push({ role: "user", content: message });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.5,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
