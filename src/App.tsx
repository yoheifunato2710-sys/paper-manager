import { useState, useEffect, useCallback } from 'react'
import type { Folder, Paper } from './types'
import { loadFolders, saveFolders, loadPapers, savePapers, nextFolderOrder, generateId } from './store'
import { parsePaperDocument } from './parser'
import { FolderList } from './components/FolderList'
import { PaperList } from './components/PaperList'
import { PasteArea } from './components/PasteArea'
import { FolderNameModal } from './components/FolderNameModal'
import { PaperDetailModal } from './components/PaperDetailModal'
import './App.css'

export default function App() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [papers, setPapers] = useState<Paper[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null)
  const [showPaste, setShowPaste] = useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [showPaperDetailModal, setShowPaperDetailModal] = useState(false)

  useEffect(() => {
    setFolders(loadFolders())
    setPapers(loadPapers())
  }, [])

  const persistFolders = useCallback((next: Folder[]) => {
    setFolders(next)
    saveFolders(next)
  }, [])

  const persistPapers = useCallback((next: Paper[]) => {
    setPapers(next)
    savePapers(next)
  }, [])

  const addFolder = useCallback(() => {
    setShowNewFolderModal(true)
  }, [])

  const confirmNewFolder = useCallback(
    (name: string) => {
      if (!name?.trim()) return
      const newFolder: Folder = {
        id: generateId(),
        name: name.trim(),
        order: nextFolderOrder(folders),
      }
      persistFolders([...folders, newFolder])
      setSelectedFolderId(newFolder.id)
    },
    [folders, persistFolders]
  )

  const deleteFolder = useCallback(
    (id: string) => {
      if (!confirm('このフォルダを削除しますか？フォルダ内の論文は残りますが、フォルダ未割り当てになります。')) return
      persistFolders(folders.filter((f) => f.id !== id))
      persistPapers(papers.map((p) => (p.folderId === id ? { ...p, folderId: '' } : p)))
      if (selectedFolderId === id) setSelectedFolderId(null)
    },
    [folders, papers, selectedFolderId, persistFolders, persistPapers]
  )

  const papersInFolder = selectedFolderId
    ? papers.filter((p) => p.folderId === selectedFolderId)
    : []

  const selectedPaper =
    selectedFolderId && selectedPaperId
      ? papersInFolder.find((p) => p.id === selectedPaperId) ?? null
      : null

  const handlePasted = useCallback(
    (text: string, folderId: string) => {
      const parsed = parsePaperDocument(text)
      const newPaper: Paper = {
        id: generateId(),
        folderId,
        ...parsed,
        createdAt: Date.now(),
      }
      persistPapers([...papers, newPaper])
      setShowPaste(false)
      setSelectedPaperId(newPaper.id)
      setShowPaperDetailModal(true)
      if (folderId !== selectedFolderId) setSelectedFolderId(folderId)
    },
    [papers, selectedFolderId, persistPapers]
  )

  const deletePaper = useCallback(
    (id: string) => {
      if (!confirm('この論文を削除しますか？')) return
      persistPapers(papers.filter((p) => p.id !== id))
      if (selectedPaperId === id) setSelectedPaperId(null)
    },
    [papers, selectedPaperId, persistPapers]
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>論文マネージャー</h1>
          <button type="button" className="btn-add-folder" onClick={() => setShowNewFolderModal(true)} title="フォルダを追加">
            ＋ フォルダ
          </button>
        </div>
        <FolderList
          folders={folders}
          selectedId={selectedFolderId}
          onSelect={(id) => {
            setSelectedFolderId(id)
            setSelectedPaperId(null)
          }}
          onDelete={deleteFolder}
        />
      </aside>
      <main className="main">
        <div className="toolbar">
          <button
            type="button"
            className="btn-paste"
            onClick={() => setShowPaste(true)}
            disabled={!selectedFolderId}
          >
            文書を貼り付けて追加
          </button>
        </div>
        <div className="content">
          <section className="paper-list-section">
            <h2>{selectedFolderId ? folders.find((f) => f.id === selectedFolderId)?.name ?? '論文' : 'フォルダを選択'}</h2>
            {selectedFolderId ? (
              <PaperList
                papers={papersInFolder}
                selectedId={selectedPaperId}
                onSelect={(id) => {
                  setSelectedPaperId(id)
                  setShowPaperDetailModal(true)
                }}
                onDelete={deletePaper}
              />
            ) : (
              <p className="hint">左のフォルダを選択するか、新規フォルダを作成してください。</p>
            )}
          </section>
        </div>
      </main>
      {showNewFolderModal && (
        <FolderNameModal
          onConfirm={confirmNewFolder}
          onClose={() => setShowNewFolderModal(false)}
        />
      )}
      {showPaperDetailModal && selectedPaper && (
        <PaperDetailModal
          paper={selectedPaper}
          onClose={() => setShowPaperDetailModal(false)}
        />
      )}
      {showPaste && selectedFolderId && (
        <PasteArea
          folderName={folders.find((f) => f.id === selectedFolderId)?.name ?? ''}
          onPaste={handlePasted}
          onClose={() => setShowPaste(false)}
          folderId={selectedFolderId}
        />
      )}
    </div>
  )
}
