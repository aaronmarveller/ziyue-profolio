import { readFile } from '@/lib/github'
import { ContentEditor } from '@/components/admin/ContentEditor'

export default async function AdminAboutPage() {
  const [about, skills] = await Promise.all([
    readFile('content/about.md'),
    readFile('content/skills.md'),
  ])

  return (
    <div className="space-y-12">
      <ContentEditor
        filePath="content/about.md"
        initialContent={about.content}
        sha={about.sha}
        label="About Me"
      />
      <ContentEditor
        filePath="content/skills.md"
        initialContent={skills.content}
        sha={skills.sha}
        label="Skills"
      />
    </div>
  )
}
