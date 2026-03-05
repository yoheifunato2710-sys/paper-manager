import type { Folder, Paper } from './types'

const FOLDERS_KEY = 'paper-manager-folders'
const PAPERS_KEY = 'paper-manager-papers'

function loadJson<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key)
    if (s == null) return fallback
    return JSON.parse(s) as T
  } catch {
    return fallback
  }
}

function saveJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadFolders(): Folder[] {
  return loadJson<Folder[]>(FOLDERS_KEY, [])
}

export function saveFolders(folders: Folder[]): void {
  saveJson(FOLDERS_KEY, folders)
}

export function loadPapers(): Paper[] {
  return loadJson<Paper[]>(PAPERS_KEY, [])
}

export function savePapers(papers: Paper[]): void {
  saveJson(PAPERS_KEY, papers)
}

export function nextFolderOrder(folders: Folder[]): number {
  if (folders.length === 0) return 0
  return Math.max(...folders.map((f) => f.order), 0) + 1
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
