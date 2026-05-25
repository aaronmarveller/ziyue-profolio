// __tests__/lib/content.test.ts
import { getProjects, getProject, getPublications, getAbout, getSkills } from '@/lib/content'

jest.mock('fs/promises')
import * as fs from 'fs/promises'
const mockFs = fs as jest.Mocked<typeof fs>

const PROJECT_MD = `---
title: Test Project
date: "2024-06"
tags: ["NLP", "usability"]
summary: A test project
featured: true
---
Project body here`

const PUB_MD = `---
title: Test Paper
journal: Test Journal
year: 2024
doi: 10.test/123
pdf_url: /files/test.pdf
---
Abstract here`

const ABOUT_MD = `---
name: Test User
title: Researcher
tagline: Testing things
email: test@test.com
cv_url: /files/cv.pdf
---
Bio here`

const SKILLS_MD = `---
---
## Skills
Some skills`

describe('getProjects', () => {
  it('returns parsed projects sorted by date descending', async () => {
    const olderMd = PROJECT_MD.replace('2024-06', '2023-01').replace('Test Project', 'Older Project')
    mockFs.readdir.mockResolvedValue(['test-project.md', 'older-project.md'] as any)
    mockFs.readFile
      .mockResolvedValueOnce(PROJECT_MD)
      .mockResolvedValueOnce(olderMd)

    const projects = await getProjects()
    expect(projects).toHaveLength(2)
    expect(projects[0].slug).toBe('test-project')
    expect(projects[0].title).toBe('Test Project')
    expect(projects[0].featured).toBe(true)
    expect(projects[1].slug).toBe('older-project')
  })
})

describe('getProject', () => {
  it('returns a single project by slug', async () => {
    mockFs.readFile.mockResolvedValue(PROJECT_MD)
    const project = await getProject('test-project')
    expect(project?.slug).toBe('test-project')
    expect(project?.content).toContain('Project body here')
  })

  it('returns null for missing slug', async () => {
    mockFs.readFile.mockRejectedValue(new Error('ENOENT'))
    const project = await getProject('nonexistent')
    expect(project).toBeNull()
  })
})

describe('getPublications', () => {
  it('returns publications sorted by year descending', async () => {
    const older = PUB_MD.replace('2024', '2022')
    mockFs.readdir.mockResolvedValue(['test-paper.md', 'older-paper.md'] as any)
    mockFs.readFile.mockResolvedValueOnce(PUB_MD).mockResolvedValueOnce(older)

    const pubs = await getPublications()
    expect(pubs[0].year).toBe(2024)
    expect(pubs[1].year).toBe(2022)
  })
})

describe('getAbout', () => {
  it('returns parsed about data', async () => {
    mockFs.readFile.mockResolvedValue(ABOUT_MD)
    const about = await getAbout()
    expect(about.name).toBe('Test User')
    expect(about.content).toContain('Bio here')
  })
})

describe('getSkills', () => {
  it('returns skills content', async () => {
    mockFs.readFile.mockResolvedValue(SKILLS_MD)
    const skills = await getSkills()
    expect(skills.content).toContain('## Skills')
  })
})
