import { useRef, useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import TopHeader from '../components/layout/TopHeader'
import PlatformSelector from '../components/dashboard/PlatformSelector'
import UploadZone from '../components/dashboard/UploadZone'
import GenerationBanner from '../components/dashboard/GenerationBanner'
import MetadataTable from '../components/dashboard/MetadataTable'
import Toast from '../components/common/Toast'
import {
  initialMetadataRows,
  adobeCategories,
  shutterstockCategories,
  formatFileSize,
  buildMockMetadata,
  densityFor,
} from '../data/dashboardData'
import { generateMetadata } from '../lib/generateApi'

function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [platform, setPlatform] = useState('adobe')
  const [metadataRows, setMetadataRows] = useState(initialMetadataRows)
  const [regeneratingId, setRegeneratingId] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const nextIdRef = useRef(1)

  function showToast(message) {
    setToast({ visible: true, message })
  }

  function dismissToast() {
    setToast((t) => ({ ...t, visible: false }))
  }

  function handlePlatformSelect(id) {
    setPlatform(id)
    showToast(
      id === 'adobe'
        ? 'Switched algorithm profile to Adobe Stock: 5-49 keywords, 1 category.'
        : 'Switched algorithm profile to Shutterstock: 7-50 keywords, dual categories.'
    )
  }

  function handleFilesSelected(files, rejectedCount = 0) {
    if (files.length > 0) {
      const newRows = files.map((file) => {
        const id = nextIdRef.current++
        const objectUrl = URL.createObjectURL(file)
        return {
          id,
          filename: file.name,
          dims: 'Loading…',
          size: formatFileSize(file.size),
          badge: null,
          img: objectUrl,
          title: '',
          description: '',
          keywords: [],
          keywordTotal: 0,
          keywordMax: platform === 'adobe' ? 49 : 50,
          density: '—',
          category: '',
          categoryOptions: platform === 'adobe' ? adobeCategories.map((c) => c.name) : shutterstockCategories,
          categoryNumber: null,
          status: 'pending',
          file,
        }
      })

      setMetadataRows((rows) => [...rows, ...newRows])

      newRows.forEach((row) => {
        const img = new Image()
        img.onload = () => {
          setMetadataRows((rows) =>
            rows.map((r) => (r.id === row.id ? { ...r, dims: `${img.naturalWidth} x ${img.naturalHeight}` } : r))
          )
        }
        img.src = row.img
      })
    }

    if (files.length > 0 && rejectedCount > 0) {
      showToast(`${files.length} image${files.length > 1 ? 's' : ''} added. ${rejectedCount} file(s) skipped (only JPEG/PNG allowed).`)
    } else if (files.length > 0) {
      showToast(`${files.length} image${files.length > 1 ? 's' : ''} added to the queue.`)
    } else if (rejectedCount > 0) {
      showToast('Only JPEG and PNG images are allowed.')
    }
  }

  async function generateOne(row) {
    setRegeneratingId(row.id)
    setMetadataRows((rows) => rows.map((r) => (r.id === row.id ? { ...r, status: 'generating' } : r)))

    try {
      const result = await generateMetadata(row.file, platform)
      applyGeneratedMetadata(row, result)
      return false
    } catch (err) {
      if (err.status === 401) {
        showToast('Your session expired. Please log in again.')
        return true
      }
      if (err.status === 429) {
        showToast('Daily limit reached, try again tomorrow.')
        return true
      }
      showToast(`AI generation failed for "${row.filename}" — used placeholder metadata instead.`)
      applyMockMetadata(row)
      return false
    } finally {
      setRegeneratingId(null)
    }
  }

  function applyGeneratedMetadata(row, result) {
    const keywordMax = platform === 'adobe' ? 49 : 50
    const keywords = result.keywords ?? []
    setMetadataRows((rows) =>
      rows.map((r) =>
        r.id === row.id
          ? {
              ...r,
              title: result.title ?? '',
              description: result.description ?? '',
              keywords,
              keywordTotal: keywords.length,
              keywordMax,
              density: densityFor(keywords.length, keywordMax),
              category: result.category ?? '',
              categoryNumber: result.categoryNumber ?? null,
              categoryOptions: platform === 'adobe' ? adobeCategories.map((c) => c.name) : shutterstockCategories,
              status: 'done',
            }
          : r
      )
    )
  }

  function applyMockMetadata(row) {
    const meta = buildMockMetadata(row.filename, platform)
    setMetadataRows((rows) => rows.map((r) => (r.id === row.id ? { ...r, ...meta, status: 'done' } : r)))
  }

  async function handleGenerateAll() {
    const pending = metadataRows.filter((row) => row.status === 'pending')
    if (pending.length === 0) {
      showToast('No new images in the queue.')
      return
    }
    setIsGenerating(true)
    for (const row of pending) {
      const stop = await generateOne(row)
      if (stop) break
    }
    setIsGenerating(false)
    showToast('Finished generating metadata for the queue.')
  }

  function handleRemoveKeyword(rowId, keywordIndex) {
    setMetadataRows((rows) =>
      rows.map((row) =>
        row.id === rowId ? { ...row, keywords: row.keywords.filter((_, i) => i !== keywordIndex) } : row
      )
    )
    showToast('Keyword removed.')
  }

  function handleEditKeywords(rowId) {
    const input = window.prompt(`Enter a new commercial keyword for asset #${rowId}:`)
    const trimmed = input?.trim()
    if (!trimmed) return
    setMetadataRows((rows) =>
      rows.map((row) => (row.id === rowId ? { ...row, keywords: [...row.keywords, trimmed] } : row))
    )
    showToast(`Added keyword "${trimmed}"`)
  }

  function handleCategoryChange(rowId, category) {
    setMetadataRows((rows) => rows.map((row) => (row.id === rowId ? { ...row, category } : row)))
  }

  function handleCopy(rowId, field = 'title') {
    const row = metadataRows.find((r) => r.id === rowId)
    if (!row) return
    const value = field === 'keywords' ? row.keywords.join(', ') : field === 'description' ? row.description ?? '' : row.title
    navigator.clipboard?.writeText(value)
    showToast(`Copied ${field}: "${value.substring(0, 30)}${value.length > 30 ? '...' : ''}" to clipboard`)
  }

  function handleDownloadSEOFile(rowId) {
    const row = metadataRows.find((r) => r.id === rowId)
    if (!row) return
    showToast(`Downloaded SEO file for "${row.filename}"`)
  }

  async function handleRegenerate(rowId) {
    const row = metadataRows.find((r) => r.id === rowId)
    if (!row) return
    await generateOne(row)
    showToast('Regenerated metadata for asset with high-confidence keywords.')
  }

  function handleDeleteRow(rowId) {
    if (!window.confirm('Remove this metadata entry from the export payload?')) return
    setMetadataRows((rows) => {
      const row = rows.find((r) => r.id === rowId)
      if (row?.img?.startsWith('blob:')) URL.revokeObjectURL(row.img)
      return rows.filter((r) => r.id !== rowId)
    })
    showToast('Asset row removed from export queue.')
  }

  function handleDownloadCSV(type) {
    showToast(`Generated & downloaded stock_metadata_${type}_export.csv with ${metadataRows.length} assets.`)
  }

  function handleExportJSON() {
    showToast('Exported full IPTC / XMP compliant JSON payload.')
  }

  return (
    <div className="bg-surface font-body-sm text-body-sm text-on-surface antialiased min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="w-full pt-16 bg-surface">
          <div className="flex flex-col w-full">
            <div className="p-space-md sm:p-space-xl flex flex-col gap-space-xl">
              <PlatformSelector selected={platform} onSelect={handlePlatformSelect} />

              <UploadZone onFilesSelected={handleFilesSelected} />

              <GenerationBanner
                queueCount={metadataRows.filter((row) => row.status === 'pending').length}
                isProcessing={isGenerating}
                onGenerate={handleGenerateAll}
              />

              <MetadataTable
                rows={metadataRows}
                regeneratingId={regeneratingId}
                onRemoveKeyword={handleRemoveKeyword}
                onEditKeywords={handleEditKeywords}
                onCategoryChange={handleCategoryChange}
                onCopy={handleCopy}
                onRegenerate={handleRegenerate}
                onDelete={handleDeleteRow}
                onDownloadCSV={handleDownloadCSV}
                onExportJSON={handleExportJSON}
                onDownloadSEOFile={handleDownloadSEOFile}
              />
            </div>
          </div>
        </main>
      </div>

      <Toast message={toast.message} visible={toast.visible} onDismiss={dismissToast} />
    </div>
  )
}

export default DashboardPage
