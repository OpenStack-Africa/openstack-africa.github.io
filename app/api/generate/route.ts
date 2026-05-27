import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'DEEPSEEK_API_KEY not configured' }, { status: 500 })

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 4000,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `You are an expert n8n workflow builder specializing in African business contexts and APIs.

Generate a complete, valid n8n workflow JSON based on the user's description.

Respond with ONLY a JSON object in this exact format (no markdown, no backticks, no explanation outside the JSON):
{
  "workflow": {
    "name": "Workflow name",
    "nodes": [...],
    "connections": {...},
    "settings": { "executionOrder": "v1" },
    "tags": [...]
  },
  "explanation": "3-4 sentence explanation of what this workflow does and how to set it up."
}

Rules:
- Use n8n-nodes-base.httpRequest for African APIs (Paystack, Flutterwave, Termii, Kuda, Moniepoint, Anchor etc.)
- Replace ALL credentials with placeholders: YOUR_PAYSTACK_SECRET_KEY, YOUR_TERMII_API_KEY etc.
- Include 3-6 nodes minimum
- Node positions: x = 240, 460, 680, 900 (left to right), y = 300
- Give each node a unique id like "node-001", "node-002"
- Set typeVersion to 2 for all nodes`
          },
          {
            role: 'user',
            content: `Create an n8n workflow for: ${prompt}`
          }
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('DeepSeek error:', err)
      return NextResponse.json({ error: 'Failed to generate workflow' }, { status: 500 })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    if (!text) return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    try {
      const parsed = JSON.parse(cleaned)
      if (!parsed.workflow || !parsed.explanation) {
        return NextResponse.json({ error: 'Invalid workflow structure returned' }, { status: 500 })
      }
      return NextResponse.json({
        workflow: JSON.stringify(parsed.workflow, null, 2),
        explanation: parsed.explanation,
      })
    } catch {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          workflow: JSON.stringify(parsed.workflow, null, 2),
          explanation: parsed.explanation || 'Workflow generated successfully.',
        })
      }
      return NextResponse.json({ error: 'Could not parse generated workflow' }, { status: 500 })
    }
  } catch (err) {
    console.error('Generate route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
