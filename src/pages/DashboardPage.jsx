import { useRef, useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import TopHeader from '../components/layout/TopHeader'
import WorkspaceModeBar from '../components/dashboard/WorkspaceModeBar'
import StatCard from '../components/dashboard/StatCard'
import PlatformSelector from '../components/dashboard/PlatformSelector'
import UploadZone from '../components/dashboard/UploadZone'
import QueueItemCard from '../components/dashboard/QueueItemCard'
import MetadataTable from '../components/dashboard/MetadataTable'
import EmptyState from '../components/dashboard/EmptyState'
import FailedState from '../components/dashboard/FailedState'
import Toast from '../components/common/Toast'
import Icon from '../components/common/Icon'
import { statCards, platforms, initialQueueItems, initialMetadataRows } from '../data/dashboardData'

function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mode, setMode] = useState('completed')
  const [platform, setPlatform] = useState('adobe')
  const [queueItems, setQueueItems] = useState(initialQueueItems)
  const [metadataRows, setMetadataRows] = useState(initialMetadataRows)
  const [regeneratingId, setRegeneratingId] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const timeoutRef = useRef(null)

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

  function handleModeChange(nextMode) {
    setMode(nextMode)
    const messages = {
      completed: 'Showing Generation Completed State: All 4 images processed and ready.',
      processing: 'Simulating active multi-modal vision indexing...',
      empty: 'Showing Empty Dropzone State: No assets queued.',
      failed: 'Showing Failed / Retry State: 2 assets encountered API limit.',
    }
    showToast(messages[nextMode])
  }

  function triggerAIGenerationDemo() {
    setMode('processing')
    showToast('Simulating active multi-modal vision indexing...')
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setMode('completed')
      showToast('Batch processing complete: 4 images indexed in 3.14 seconds.')
    }, 1800)
  }

  function handleRemoveQueueItem(id) {
    setQueueItems((items) => items.filter((item) => item.id !== id))
    showToast('Asset removed from queue.')
  }

  function handleClearQueue() {
    if (window.confirm('Clear all queued assets?')) {
      setQueueItems([])
      setMode('empty')
    }
  }

  function handleRestoreDemoBatch() {
    setQueueItems(initialQueueItems)
    setMode('completed')
  }

  function handleBrowseFiles() {
    showToast('File selector opened: Selected high-res stock files.')
    setMode('completed')
  }

  function handleImportCloud() {
    showToast('Connecting to external cloud storage provider...')
  }

  function handleRetryFailedBatch() {
    setMode('completed')
    showToast('Re-submitting throttled assets with exponential backoff...')
    setTimeout(() => {
      showToast('All 4 assets recovered and metadata successfully generated.')
    }, 1200)
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

  function handleRegenerate(rowId) {
    setRegeneratingId(rowId)
    setTimeout(() => {
      setRegeneratingId(null)
      showToast('Regenerated metadata for asset with high-confidence keywords.')
    }, 900)
  }

  function handleDeleteRow(rowId) {
    if (!window.confirm('Remove this metadata entry from the export payload?')) return
    setMetadataRows((rows) => rows.filter((row) => row.id !== rowId))
    showToast('Asset row removed from export queue.')
  }

  function handleDownloadCSV(type) {
    showToast(`Generated & downloaded stock_metadata_${type}_export.csv with ${metadataRows.length} assets.`)
  }

  function handleExportJSON() {
    showToast('Exported full IPTC / XMP compliant JSON payload.')
  }

  const currentPlatform = platforms[platform]

  return (
    <div className="bg-surface font-body-sm text-body-sm text-on-surface antialiased min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="w-full pt-16 bg-surface">
          <div className="flex flex-col w-full">
            <WorkspaceModeBar mode={mode} onModeChange={handleModeChange} platformFormatLabel={currentPlatform.formatLabel} />

            <div className="p-space-md sm:p-space-xl flex flex-col gap-space-xl">
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg">
                {statCards.map((stat) => (
                  <StatCard key={stat.id} stat={stat} />
                ))}
              </div> */}

              <PlatformSelector selected={platform} onSelect={handlePlatformSelect} />

              <UploadZone queueCount={queueItems.length} onBrowseFiles={handleBrowseFiles} onImportCloud={handleImportCloud} />


              {(mode === 'completed' || mode === 'processing' || mode === 'failed') && (
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
              )}

              {mode === 'empty' && <EmptyState onRestore={handleRestoreDemoBatch} />}

              {mode === 'failed' && <FailedState onRetry={handleRetryFailedBatch} onDismiss={() => setMode('completed')} />}
            </div>
          </div>
        </main>
      </div>

      <Toast message={toast.message} visible={toast.visible} onDismiss={dismissToast} />
    </div>
  )
}

export default DashboardPage
