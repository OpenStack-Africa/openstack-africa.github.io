import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const OWNER = 'OpenStack-Africa'
const REPO = 'openstack-africa.github.io'
const BRANCH = 'main'

async function getFileContent(path: string) {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return {
    content: Buffer.from(data.content, 'base64').toString('utf8'),
    sha: data.sha,
  }
}

async function updateFile(path: string, content: string, sha: string, message: string) {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString('base64'),
        sha,
        branch: BRANCH,
      }),
    }
  )
  return res.ok
}

export async function POST(request: NextRequest) {
  try {
    // Password check
    const { password, action, template, contributor, readme } = await request.json()

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 })
    }

    if (action === 'add_template') {
      // 1. Update registry.ts
      const registryFile = await getFileContent('data/registry.ts')
      if (!registryFile) return NextResponse.json({ error: 'Could not fetch registry.ts' }, { status: 500 })

      const newEntry = `  {
    id: '${template.id}',
    title: '${template.title}',
    description: '${template.description}',
    category: '${template.category}',
    apis: [${template.apis.map((a: string) => `'${a}'`).join(', ')}],
    path: 'templates/${template.category}/${template.id}',
    author: { name: '${template.authorName}', location: '${template.authorLocation}'${template.authorTwitter ? `, twitter: '${template.authorTwitter}'` : ''}${template.contributorId ? `, contributorId: '${template.contributorId}'` : ''} },
    tags: [${template.tags.map((t: string) => `'${t}'`).join(', ')}],
    n8n_version_min: '1.0.0',
    created_at: '${new Date().toISOString().split('T')[0]}',
    downloads: 0,
    difficulty: '${template.difficulty}',
  },`

      // Insert before the closing bracket of the templates array
      const updatedRegistry = registryFile.content.replace(
        /^(\])\s*\n\nexport const categoryMeta/m,
        `${newEntry}\n]\n\nexport const categoryMeta`
      )

      const registryUpdated = await updateFile(
        'data/registry.ts',
        updatedRegistry,
        registryFile.sha,
        `feat: add template ${template.id}`
      )

      if (!registryUpdated) {
        return NextResponse.json({ error: 'Failed to update registry.ts' }, { status: 500 })
      }

      // 2. Update readmes.ts if readme provided
      if (readme) {
        const readmeFile = await getFileContent('data/readmes.ts')
        if (readmeFile) {
          const escapedReadme = readme.replace(/`/g, '\\`').replace(/\${/g, '\\${')
          const newReadmeEntry = `\n  '${template.id}': \`${escapedReadme}\`,\n`
          const updatedReadmes = readmeFile.content.replace(
            /^(export const readmes[^{]*\{)/m,
            `$1${newReadmeEntry}`
          )
          await updateFile('data/readmes.ts', updatedReadmes, readmeFile.sha, `feat: add readme for ${template.id}`)
        }
      }

      return NextResponse.json({ success: true, message: `Template ${template.id} added successfully` })
    }

    if (action === 'add_contributor') {
      const contributorsFile = await getFileContent('data/contributors.ts')
      if (!contributorsFile) return NextResponse.json({ error: 'Could not fetch contributors.ts' }, { status: 500 })

      const newContributor = `  {
    id: '${contributor.id}',
    name: '${contributor.name}',
    bio: '${contributor.bio}',
    location: '${contributor.location}',${contributor.twitter ? `\n    twitter: '${contributor.twitter}',` : ''}
    joined: '${new Date().toISOString().split('T')[0]}',
  },`

      const updatedContributors = contributorsFile.content.replace(
        /^(\])\s*\n\nexport function getContributorById/m,
        `${newContributor}\n]\n\nexport function getContributorById`
      )

      const updated = await updateFile(
        'data/contributors.ts',
        updatedContributors,
        contributorsFile.sha,
        `feat: add contributor ${contributor.id}`
      )

      if (!updated) return NextResponse.json({ error: 'Failed to update contributors.ts' }, { status: 500 })

      return NextResponse.json({ success: true, message: `Contributor ${contributor.name} added successfully` })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Admin error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
