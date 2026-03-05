import type { Paper } from '../types'

interface PaperDetailProps {
  paper: Paper
}

const labels: Record<string, string> = {
  englishTitle: '① 英語論文タイトル',
  japaneseTitle: '② 日本語論文タイトル',
  reference: '③ Reference (参考文献書式)',
  abstract: '④ Abstract (要旨)',
  introductionPurpose: '⑤ Introduction & Purpose (Full Translation)',
  methods: '⑥ Methods: Analysis Process',
  results: '⑦ Results (Corresponding to Purpose)',
}

export function PaperDetail({ paper }: PaperDetailProps) {
  const blocks: (keyof Paper)[] = [
    'englishTitle',
    'japaneseTitle',
    'reference',
    'abstract',
    'introductionPurpose',
    'methods',
    'results',
  ]

  return (
    <div className="paper-detail">
      {blocks.map((key) => {
        const value = paper[key]
        if (typeof value !== 'string') return null
        const text = value.trim()
        if (!text) return null
        return (
          <div key={key} className="block">
            <h3>{labels[key] ?? key}</h3>
            <pre>{text}</pre>
          </div>
        )
      })}
    </div>
  )
}
