export interface Folder {
  id: string
  name: string
  order: number
}

export interface Paper {
  id: string
  folderId: string
  /** ① 英語論文タイトル */
  englishTitle: string
  /** ② 日本語論文タイトル */
  japaneseTitle: string
  /** ③ Reference (参考文献書式) */
  reference: string
  /** ④ Abstract (要旨) */
  abstract: string
  /** ⑤ Introduction & Purpose (Full Translation) */
  introductionPurpose: string
  /** ⑥ Methods: Analysis Process */
  methods: string
  /** ⑦ Results (Corresponding to Purpose) */
  results: string
  createdAt: number
}

export interface ParsedPaper {
  englishTitle: string
  japaneseTitle: string
  reference: string
  abstract: string
  introductionPurpose: string
  methods: string
  results: string
}
