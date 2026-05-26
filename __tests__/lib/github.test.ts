// __tests__/lib/github.test.ts
process.env.GITHUB_TOKEN = 'test-token'
process.env.GITHUB_REPO = 'testuser/testrepo'

import { readFile, commitFile, listFiles } from '@/lib/github'

global.fetch = jest.fn()
const mockFetch = fetch as jest.Mock

beforeEach(() => mockFetch.mockReset())

describe('readFile', () => {
  it('returns decoded content and sha', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: Buffer.from('hello world').toString('base64') + '\n',
        sha: 'abc123',
      }),
    })
    const result = await readFile('content/about.md')
    expect(result.content).toBe('hello world')
    expect(result.sha).toBe('abc123')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/testuser/testrepo/contents/content/about.md',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer test-token' }) })
    )
  })

  it('throws when file not found', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({ message: 'Not Found' }) })
    await expect(readFile('nonexistent.md')).rejects.toThrow('GitHub API error: 404')
  })
})

describe('commitFile', () => {
  it('PUTs to GitHub API with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    await commitFile('content/about.md', 'new content', 'abc123', 'update about')
    const call = mockFetch.mock.calls[0]
    expect(call[0]).toBe('https://api.github.com/repos/testuser/testrepo/contents/content/about.md')
    const body = JSON.parse(call[1].body)
    expect(body.sha).toBe('abc123')
    expect(body.message).toBe('update about')
    expect(Buffer.from(body.content, 'base64').toString()).toBe('new content')
  })
})

describe('listFiles', () => {
  it('returns array of file names', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { name: 'project-a.md', type: 'file' },
        { name: 'project-b.md', type: 'file' },
      ],
    })
    const files = await listFiles('content/projects')
    expect(files).toEqual(['project-a.md', 'project-b.md'])
  })
})
