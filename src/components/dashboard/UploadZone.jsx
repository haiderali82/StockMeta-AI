import { useRef, useState } from 'react'
import Icon from '../common/Icon'
import { formatFileSize } from '../../data/dashboardData'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg']

const statusMeta = {
  pending: { label: 'Queued', dot: 'bg-on-surface-variant', text: 'text-on-surface-variant' },
  generating: { label: 'Analyzing', dot: 'bg-amber-500 animate-pulse', text: 'text-amber-600' },
  done: { label: 'Ready', dot: 'bg-emerald-500', text: 'text-emerald-600' },
}

function StagedCard({ row }) {
  const meta = statusMeta[row.status] ?? statusMeta.pending
  const ext = row.filename.split('.').pop()?.toUpperCase().slice(0, 4) || 'IMG'

  return (
    <div className="bg-surface-container-lowest p-space-xs rounded-xl border border-outline-variant/30 shadow-xs flex flex-col gap-space-xs group hover:border-outline-variant transition-colors">
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface-container">
        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={row.img} alt={row.filename} />
        <span className="absolute top-2 left-2 font-code-xs text-code-xs px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
          {ext}
        </span>
        {row.dims && row.dims !== 'Loading…' && (
          <span className="absolute bottom-2 left-2 font-code-xs text-code-xs text-white/90 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
            {row.dims.replace(' x ', '×')}
          </span>
        )}
      </div>
      <div className="flex flex-col px-space-xs pb-space-xs">
        <span className="font-body-xs text-body-xs font-semibold text-on-surface truncate" title={row.filename}>
          {row.filename}
        </span>
        <div className="flex items-center justify-between font-code-xs text-code-xs text-on-surface-variant mt-0.5">
          <span>{row.size}</span>
          <span className={`font-body-xs font-medium flex items-center gap-1 ${meta.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} /> {meta.label}
          </span>
        </div>
      </div>
    </div>
  )
}

function UploadZone({ onFilesSelected, rows = [] }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function openPicker() {
    inputRef.current?.click()
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList)
    const accepted = files.filter((file) => ACCEPTED_TYPES.includes(file.type))
    const rejectedCount = files.length - accepted.length
    if (accepted.length > 0 || rejectedCount > 0) {
      onFilesSelected(accepted, rejectedCount)
    }
  }

  const totalBytes = rows.reduce((sum, row) => sum + (row.file?.size || 0), 0)

  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div className="flex items-center gap-2">
          <span className="font-code-xs text-code-xs text-on-surface-variant/70 font-semibold uppercase tracking-wider">Zone 2</span>
          <span className="font-label-md text-label-md font-semibold text-on-surface">Asset Ingestion &amp; Staging</span>
        </div>
        {rows.length > 0 && (
          <span className="font-code-xs text-code-xs text-on-surface-variant">
            {rows.length} Asset{rows.length === 1 ? '' : 's'} in Queue ({formatFileSize(totalBytes)} Total)
          </span>
        )}
      </div>

      <div
        onClick={openPicker}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={`border-2 border-dashed rounded-2xl p-space-xl bg-surface-container-lowest transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-xs ${
          isDragging ? 'border-primary bg-surface-container-low' : 'border-outline-variant/40 hover:border-outline-variant hover:bg-surface-container-low/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <div className="w-12 h-12 rounded-xl bg-surface-container-low group-hover:bg-primary-fixed text-on-surface-variant group-hover:text-primary border border-outline-variant/30 flex items-center justify-center transition-colors mb-space-sm">
          <Icon name="cloud_upload" className="text-[24px]" />
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap justify-center">
          <span className="font-body-sm text-body-sm font-semibold text-on-surface">Drag &amp; drop your stock assets here</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">or</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              openPicker()
            }}
            className="font-body-sm text-body-sm font-semibold text-primary hover:text-on-primary-fixed-variant underline underline-offset-2"
          >
            browse files
          </button>
        </div>
        <p className="font-body-xs text-body-xs text-on-surface-variant/70 mt-1">
          Supports high-res JPG, PNG up to 50MB per asset
        </p>
      </div>

      {rows.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
          {rows.map((row) => (
            <StagedCard key={row.id} row={row} />
          ))}
        </div>
      )}
    </section>
  )
}

export default UploadZone
