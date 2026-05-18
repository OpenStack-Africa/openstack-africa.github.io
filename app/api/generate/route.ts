import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const systemInstruction = `You are an expert n8n workflow builder specializing in African business contexts and APIs.

Your job is to generate a complete, valid n8n workflow JSON based on the user's description.

You must respond with ONLY a JSON object in this exact format (no markdown, no backticks, no explanation outside the JSON):
{
  "workflow": { ...complete n8n workflow JSON... },
  "explanation": "A clear 3-5 sentence explanation of what this workflow does and how to set it up."
}

Rules for the workflow JSON:
- Must be valid n8n workflow format with "name", "nodes", "connections", "settings" fields
- Use realistic node types: n8n-nodes-base.webhook, n8n-nodes-base.httpRequest, n8n-nodes-base.code, n8n-nodes-base.slack, n8n-nodes-base.googleSheets, n8n-nodes-base.scheduleTrigger, n8n-nodes-base.if, n8n-nodes-base.respondToWebhook
- For African APIs (Paystack, Flutterwave, Termii, Kuda, Moniepoint, Anchor etc.) use n8n-nodes-base.httpRequest nodes with the correct API endpoints
- Replace all credentials and API keys with placeholders like YOUR_PAYSTACK_SECRET_KEY, YOUR_TERMII_API_KEY etc.
- Include at least 3 nodes, maximum 8 nodes
- Give each node a unique id (use format: "node-001", "node-002" etc.)
- Position nodes logically left to right (x: 240, 460, 680, 900... y: 300)
- Set "typeVersion" to 2 for most nodes
- The workflow name should be descriptive and specific
- Tags should include relevant API names and use case`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [{
            parts: [{ text: `Create an n8n workflow for: ${prompt}` }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4000,
          }
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini API error:', err)
      return NextResponse.json({ error: 'Failed to generate workflow' }, { status: 500 })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!text) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Strip markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    try {
      const parsed = JSON.parse(cleaned)
      return NextResponse.json({
        workflow: JSON.stringify(parsed.workflow, null, 2),
        explanation: parsed.explanation || 'Workflow generated successfully.',
      })
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          workflow: JSON.stringify(parsed.workflow, null, 2),
          explanation: parsed.explanation || 'Workflow generated successfully.',
        })
      }
      console.error('Could not parse Gemini response:', cleaned.slice(0, 200))
      return NextResponse.json({ error: 'Could not parse generated workflow' }, { status: 500 })
    }
  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
