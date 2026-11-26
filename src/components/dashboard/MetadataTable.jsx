import { useMemo, useState } from 'react'
import Icon from '../common/Icon'
import MetadataRow from './MetadataRow'
import ExportMenu from './ExportMenu'

const categories = ['all', 'Landscapes', 'Business', 'Still Life', 'Technology']

function MetadataTable({
  rows,
  regeneratingId,
  onRemoveKeyword,
  onEditKeywords,
  onCategoryChange,
  onCopy,
  onRegenerate,
  onDelete,
  onDownloadCSV,
  onExportJSON,
  onDownloadSEOFile,
}) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [exportOpen, setExportOpen] = useState(false)

  const filteredRows = useMemo(() => {
    const term = search.toLowerCase()
    return rows.filter((row) => {
      const matchesCategory = categoryFilter === 'all' || row.category === categoryFilter
      if (!matchesCategory) return false
      if (!term) return true
      const haystack = `${row.filename} ${row.title} ${row.keywords.join(' ')}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [rows, search, categoryFilter])

  const avgTitleLength = rows.length
    ? Math.round(rows.reduce((sum, r) => sum + r.title.length, 0) / rows.length)
    : 0
  const avgTagCount = rows.length
    ? (rows.reduce((sum, r) => sum + r.keywordTotal, 0) / rows.length).toFixed(1)
    : 0

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden">
      <div className="p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest">
        <div>
          <div className="flex items-center gap-space-xs">
            <Icon name="table_chart" className="text-primary text-[22px]" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Generated Metadata Review</h2>
            <span className="font-code-xs text-code-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              {rows.length} of {rows.length} Verified
            </span>
          </div>
          <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">
            Click into titles or descriptions to make live commercial adjustments. Keywords can be re-ordered, appended, or
            deleted before export.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="relative">
            <Icon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by filename, title, or keywords..."
              className="pl-8 pr-3 py-1.5 bg-surface-container-low rounded-lg text-body-xs font-body-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-xs w-64"
            />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-surface-container-low text-on-surface font-label-sm text-label-sm pl-3 pr-8 py-1.5 rounded-lg shadow-xs cursor-pointer focus:outline-none focus:bg-surface-container-lowest"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
            <Icon
              name="expand_more"
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-on-surface-variant"
            />
          </div>
          <ExportMenu
            open={exportOpen}
            onToggle={() => setExportOpen((v) => !v)}
            onClose={() => setExportOpen(false)}
            onDownloadCSV={(type) => {
              setExportOpen(false)
              onDownloadCSV(type)
            }}
            onExportJSON={() => {
              setExportOpen(false)
              onExportJSON()
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-space-md p-space-lg bg-surface-container-low">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-space-md">
              <Icon name="auto_awesome" className="text-[36px]" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">No Image Generated Yet</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-1">
              Upload stock images above to generate commercial titles, descriptions, and keywords ready for export.
            </p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-space-md">
              <Icon name="search_off" className="text-[36px]" />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">No Matches Found</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-1">
              No results match your search or category filter.
            </p>
          </div>
        ) : (
          filteredRows.map((row) => (
            <MetadataRow
              key={row.id}
              row={row}
              isRegenerating={regeneratingId === row.id}
              onRemoveKeyword={onRemoveKeyword}
              onEditKeywords={onEditKeywords}
              onCategoryChange={onCategoryChange}
              onCopy={onCopy}
              onRegenerate={onRegenerate}
              onDelete={onDelete}
              onDownloadSEOFile={onDownloadSEOFile}
            />
          ))
        )}
      </div>

      <div className="p-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm text-body-xs font-body-xs text-on-surface-variant">
 {filteredRows.length > 0 && (
        <div className="flex items-center gap-space-md">
          <span>
            Showing <strong>{filteredRows.length}</strong> items ready for upload
          </span>
          <span>•</span>
          <span>
            Avg Title Length: <strong>{avgTitleLength} chars</strong>
          </span>
          <span>•</span>
          <span>
            Avg Tag Count: <strong>{avgTagCount} keywords</strong>
          </span>
        </div>
         )}
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            onClick={() => onDownloadCSV('adobe')}
            className="px-space-md py-1 bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-semibold rounded shadow-xs transition-colors"
          >
            Quick Export All (CSV)
          </button>
        </div>
      </div>

    </div>
  )
}

export default MetadataTable
