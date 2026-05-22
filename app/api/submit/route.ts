import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      templateName,
      slug,
      category,
      description,
      apis,
      difficulty,
      workflowJson,
      readmeContent,
      authorName,
      authorLocation,
      authorTwitter,
    } = body

    // Validate required fields
    if (!templateName || !slug || !category || !workflowJson || !readmeContent || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate JSON
    try {
      JSON.parse(workflowJson)
    } catch {
      return NextResponse.json({ error: 'Invalid workflow JSON — please check the format' }, { status: 400 })
    }

    // Check for credentials
    const credentialPatterns = /sk_live|sk_test|Bearer [a-zA-Z0-9]{20,}/
    if (credentialPatterns.test(workflowJson)) {
      return NextResponse.json({ error: 'Possible real credentials detected. Replace all API keys with YOUR_* placeholders' }, { status: 400 })
    }

    const token = process.env.GITHUB_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
    }

    const owner = 'OpenStack-Africa'
    const repo = 'templates'
    const branch = `submit/${slug}-${Date.now()}`
    const folderPath = `templates/${category}/${slug}`

    // Get main branch SHA
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    })
    const refData = await refRes.json()
    const baseSha = refData.object?.sha

    if (!baseSha) {
      return NextResponse.json({ error: 'Could not access repository' }, { status: 500 })
    }

    // Create branch
    await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
    })

    // Create workflow.json
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}/workflow.json`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `add: ${templateName} workflow`,
        content: Buffer.from(workflowJson).toString('base64'),
        branch,
      }),
    })

    // Create README.md
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}/README.md`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `add: ${templateName} README`,
        content: Buffer.from(readmeContent).toString('base64'),
        branch,
      }),
    })

    // Open PR
    const prBody = `## Template Submission

### Template details
- **Template name:** ${templateName}
- **Category:** ${category}
- **APIs used:** ${apis.join(', ')}
- **Difficulty:** ${difficulty}

### About the contributor
- **Name:** ${authorName}
- **Location:** ${authorLocation || 'Not provided'}
- **Twitter/X:** ${authorTwitter ? `@${authorTwitter}` : 'Not provided'}

### Description
${description}

---
*Submitted via OpenStack Africa contribution form*`

    const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `add: ${templateName}`,
        body: prBody,
        head: branch,
        base: 'main',
      }),
    })

    const prData = await prRes.json()

    if (!prData.html_url) {
      return NextResponse.json({ error: 'Failed to create pull request' }, { status: 500 })
    }

    return NextResponse.json({ prUrl: prData.html_url, prNumber: prData.number })
  } catch (err) {
    console.error('Submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
