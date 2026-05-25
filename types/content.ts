// types/content.ts
export interface Project {
  slug: string
  title: string
  date: string       // "YYYY-MM"
  tags: string[]
  summary: string
  featured: boolean
  content: string    // markdown body
}

export interface Publication {
  slug: string
  title: string
  journal: string
  year: number
  doi: string
  pdf_url: string
  content: string    // abstract in markdown
}

export interface About {
  name: string
  title: string
  tagline: string
  email: string
  cv_url: string
  content: string    // bio in markdown
}

export interface Skills {
  content: string    // freeform markdown
}
