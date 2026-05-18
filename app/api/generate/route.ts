import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not set in environment' }, { status: 500 })
    }

    const fullPrompt = `You are an expert n8n workflow builder for African business contexts.

Respond with ONLY a valid JSON object, no markdown, no backticks, no extra text.

Format:
{
  "workflow": {
    "name": "Workflow name here",
    "nodes": [
      {
        "id": "node-001",
        "name": "Webhook",
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 2,
        "position": [240, 300],
        "parameters": {
          "httpMethod": "POST",
          "path": "webhook-path"
        }
      }
    ],
    "connections": {
      "Webhook": {
        "main": [[{ "node": "Next Node Name", "type": "main", "index": 0 }]]
      }
    },
    "settings": { "executionOrder": "v1" },
    "tags": ["tag1", "tag2"]
  },
  "explanation": "3-4 sentence explanation of what this workflow does and how to set it up."
}

Rules:
- Use n8n-nodes-base.httpRequest for African APIs (Paystack, Flutterwave, Termii etc.)
- Replace all API keys with placeholders like YOUR_PAYSTACK_SECRET_KEY
- Include 3-6 nodes minimum
- Positions go left to right: x = 240, 460, 680, 900. y = 300

Create a workflow for: ${prompt}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4000,
            responseMimeType: 'application/json',
          }
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini error status:', response.status, JSON.stringify(data))
      return NextResponse.json({
        error: `Gemini API error: ${data?.error?.message || response.status}`
      }, { status: 500 })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!text) {
      console.error('Empty Gemini response:', JSON.stringify(data))
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 500 })
    }

    // Clean any accidental markdown
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    try {
      const parsed = JSON.parse(cleaned)

      if (!parsed.workflow || !parsed.explanation) {
        console.error('Missing fields in parsed response:', Object.keys(parsed))
        return NextResponse.json({ error: 'Invalid workflow structure returned' }, { status: 500 })
      }

      return NextResponse.json({
        workflow: JSON.stringify(parsed.workflow, null, 2),
        explanation: parsed.explanation,
      })
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr)
      console.error('Raw text was:', cleaned.slice(0, 300))
      return NextResponse.json({
        error: 'Could not parse the generated workflow. Please try again.'
      }, { status: 500 })
    }

  } catch (err) {
    console.error('Generate route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
