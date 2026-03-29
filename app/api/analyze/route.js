import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert senior code reviewer and software architect. Analyze the provided code thoroughly and return a JSON object with the following structure:

{
  "bugs": ["array of critical bug descriptions"],
  "suggestions": ["array of improvement suggestions for performance, readability, best practices"],
  "security": ["array of security vulnerability descriptions"],
  "insights": "deep reasoning explanation of the code's architecture, patterns, and potential issues",
  "score": <number 0-100 representing overall code quality>,
  "complexity": "<Low|Medium|High> - overall code complexity level",
  "documentation": "auto-generated documentation explaining what the code does, its inputs, outputs, and usage",
  "refactoredCode": "improved version of the code with all bugs fixed and suggestions applied"
}

Rules:
- Be thorough and specific in your analysis
- Score fairly: 0-30 poor, 31-50 needs work, 51-70 acceptable, 71-85 good, 86-100 excellent
- Each bug should describe the issue, its impact, and location
- Each suggestion should be actionable
- Security items should note severity (Critical/High/Medium/Low)
- The refactored code must be complete and runnable
- Return ONLY valid JSON, no markdown, no code blocks, no extra text`;

export async function POST(request) {
  try {
    const { code, language } = await request.json();

    if (!code || code.trim().length === 0) {
      return NextResponse.json(
        { error: "No code provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Please set GROQ_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const userMessage = `Analyze the following ${language || "code"} code:\n\n\`\`\`${language || ""}\n${code}\n\`\`\``;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: `AI service error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }

    // Parse JSON with fallback
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json(
            { error: "Failed to parse AI response" },
            { status: 502 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Failed to parse AI response" },
          { status: 502 }
        );
      }
    }

    // Normalize the result
    const normalized = {
      bugs: Array.isArray(result.bugs) ? result.bugs : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
      security: Array.isArray(result.security) ? result.security : [],
      insights: typeof result.insights === "string" ? result.insights : "",
      score: typeof result.score === "number" ? Math.min(100, Math.max(0, result.score)) : 50,
      complexity: ["Low", "Medium", "High"].includes(result.complexity) ? result.complexity : "Medium",
      documentation: typeof result.documentation === "string" ? result.documentation : "",
      refactoredCode: typeof result.refactoredCode === "string" ? result.refactoredCode : "",
    };

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Analysis error:", error);
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: "AI service timed out. The file might be too large or the service is congested." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
