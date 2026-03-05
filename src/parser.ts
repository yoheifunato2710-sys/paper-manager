import type { ParsedPaper } from './types'

const trim = (s: string) => s.replace(/\s+$/m, '').trim()

/** 番号付きセクションで分割: "1. Reference", "2. Basic Information", ... */
function splitSections(text: string): Map<number, string> {
  const sections = new Map<number, string>()
  const re = /^(\d+)\.\s+.+$/gm
  let lastEnd = 0
  let lastNum = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const num = parseInt(m[1], 10)
    if (lastNum > 0) {
      const content = text.slice(lastEnd, m.index)
      sections.set(lastNum, trim(content))
    }
    lastNum = num
    lastEnd = re.lastIndex
  }
  if (lastNum > 0) {
    sections.set(lastNum, trim(text.slice(lastEnd)))
  }
  return sections
}

/**
 * 貼り付けた文書から ①～⑦ を抽出する。
 */
export function parsePaperDocument(text: string): ParsedPaper {
  const sections = splitSections(text)

  // ① 英語タイトル: 先頭行（"1. Reference" の前まで）
  let englishTitle = ''
  const beforeRef = text.split(/\n1\.\s+Reference\b/m)[0] ?? ''
  englishTitle = trim(beforeRef)

  // ③ Reference
  const reference = sections.get(1) ?? ''

  // ② 日本語タイトル & ①の補正: 3. Title（「形式: 」プレフィックスがあれば除去）
  let titleSection = sections.get(3) ?? ''
  titleSection = titleSection.replace(/^形式:\s*/, '').trim()
  let japaneseTitle = ''
  if (titleSection) {
    const jaMatch = titleSection.match(/[（(]([^）)]+)[）)]\s*$/) ?? titleSection.match(/（([^）]+)）/)
    if (jaMatch) japaneseTitle = trim(jaMatch[1])
    const enInTitle = titleSection.replace(/\s*[（(][^）)]+[）)]\s*$/, '').trim()
    if (enInTitle) englishTitle = enInTitle
  }

  return {
    englishTitle,
    japaneseTitle,
    reference,
    abstract: sections.get(4) ?? '',
    introductionPurpose: sections.get(5) ?? '',
    methods: sections.get(7) ?? '',
    results: sections.get(8) ?? '',
  }
}
