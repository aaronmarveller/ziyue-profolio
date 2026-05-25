// lib/content.ts
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { Project, Publication, About, Skills } from '@/types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export async function getProjects(): Promise<Project[]> {
  const dir = path.join(CONTENT_DIR, 'projects')
  const files = await fs.readdir(dir)
  const projects = await Promise.all(
    files.filter(f => f.endsWith('.md')).map(async f => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      return { slug: f.replace('.md', ''), ...data, content } as Project
    })
  )
  return projects.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, 'projects', `${slug}.md`), 'utf-8'
    )
    const { data, content } = matter(raw)
    return { slug, ...data, content } as Project
  } catch {
    return null
  }
}

export async function getPublications(): Promise<Publication[]> {
  const dir = path.join(CONTENT_DIR, 'publications')
  const files = await fs.readdir(dir)
  const pubs = await Promise.all(
    files.filter(f => f.endsWith('.md')).map(async f => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      return { slug: f.replace('.md', ''), ...data, content } as Publication
    })
  )
  return pubs.sort((a, b) => b.year - a.year)
}

export async function getAbout(): Promise<About> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, 'about.md'), 'utf-8')
  const { data, content } = matter(raw)
  return { ...data, content } as About
}

export async function getSkills(): Promise<Skills> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, 'skills.md'), 'utf-8')
  const { content } = matter(raw)
  return { content }
}
