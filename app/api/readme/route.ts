import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { templateName, apis, description, authorName, authorLocation, authorTwitter } = await request.json()

    if (!templateName) return NextResponse.json({ error: 'Template name is required' }, { status: 400 })

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
        max_tokens: 1500,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: `You are a technical writer creating README documentation for n8n workflow templates focused on African APIs.

Write a complete, helpful README.md for an n8n workflow template. Be specific and practical. 
Use markdown formatting. Include all required sections.
Do not add any preamble or explanation — output only the markdown content.`
          },
          {
            role: 'user',
            content: `Write a README.md for this n8n workflow template:

Template name: ${templateName}
APIs used: ${apis?.join(', ') || 'Not specified'}
Description: ${description || 'Not provided'}
Author: ${authorName || 'Unknown'}, ${authorLocation || ''}

Include these exact sections:
1. # ${templateName} (H1 title)
2. ## What this does (2-3 sentences describing the problem it solves)
3. ## APIs used (list each API with what it does in the workflow)
4. ## Prerequisites (n8n instance + each API account needed)
5. ## Setup (numbered steps: import, add credentials, replace placeholders, activate)
6. ## How it works (brief explanation of each major step)
7. ## Example use case (a real Nigerian/African business scenario)
8. ## Author section with name, location${authorTwitter ? ', and Twitter handle @' + authorTwitter : ''}

Make the setup steps specific to the APIs mentioned. For credential placeholders use format YOUR_APINAME_SECRET_KEY.`
          }
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('DeepSeek README error:', err)
      return NextResponse.json({ error: 'Failed to generate README' }, { status: 500 })
    }

    const data = await response.json()
    const readme = data.choices?.[0]?.message?.content || ''

    if (!readme) return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })

    return NextResponse.json({ readme })
  } catch (err) {
    console.error('README generation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
