// lib/github.ts
const BASE = 'https://api.github.com'

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }
}

function repo() {
  return process.env.GITHUB_REPO!
}

export async function readFile(filePath: string): Promise<{ content: string; sha: string }> {
  const res = await fetch(`${BASE}/repos/${repo()}/contents/${filePath}`, { headers: headers() })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const data = await res.json()
  return {
    content: Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8'),
    sha: data.sha,
  }
}

export async function commitFile(
  filePath: string,
  content: string,
  sha: string,   // empty string '' for new files, existing SHA for updates
  message: string
): Promise<void> {
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content).toString('base64'),
  }
  if (sha) body.sha = sha  // omit sha for new file creation

  const res = await fetch(`${BASE}/repos/${repo()}/contents/${filePath}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GitHub commit error: ${res.status}`)
}

export async function listFiles(dirPath: string): Promise<string[]> {
  const res = await fetch(`${BASE}/repos/${repo()}/contents/${dirPath}`, { headers: headers() })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const data = await res.json()
  return (data as Array<{ name: string; type: string }>)
    .filter(f => f.type === 'file' && f.name.endsWith('.md'))
    .map(f => f.name)
}
