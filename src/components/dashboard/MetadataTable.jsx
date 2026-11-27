import { useMemo, useState } from 'react'
import Icon from '../common/Icon'
import MetadataRow from './MetadataRow'
import ExportMenu from './ExportMenu'

function MetadataTable({
  rows,
  platform,
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

  const categories = useMemo(
    () => ['all', ...new Set(rows.map((row) => row.category).filter(Boolean))],
    [rows]
  )

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

  const doneRows = rows.filter((row) => row.status === 'done')
  const avgTagCount = doneRows.length
    ? (doneRows.reduce((sum, r) => sum + (r.keywordTotal ?? r.keywords.length), 0) / doneRows.length).toFixed(1)
    : 0
  const schemaLabel = platform === 'adobe' ? 'Schema: Adobe Stock CSV v2' : 'Schema: Shutterstock MShot CSV'

  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-code-xs text-code-xs text-on-surface-variant/70 font-semibold uppercase tracking-wider">Zone 3</span>
          <span className="font-label-md text-label-md font-semibold text-on-surface">Generated Metadata Inspection</span>
          <span className="font-code-xs text-code-xs px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
            {doneRows.length} of {rows.length} Verified
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="relative">
            <Icon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter keywords or title…"
              className="pl-8 pr-3 py-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-lowest font-body-xs text-body-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-56"
            />
          </div>
          {categories.length > 1 && (
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-label-sm text-label-sm pl-3 pr-8 py-1.5 rounded-lg cursor-pointer focus:outline-none"
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
          )}
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

      {rows.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-space-md">
            <Icon name="auto_awesome" className="text-[36px]" />
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">No Images Generated Yet</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-1">
            Upload stock images above to generate commercial titles, descriptions, and keywords ready for export.
          </p>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-space-md">
            <Icon name="search_off" className="text-[36px]" />
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">No Matches Found</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-1">
            No results match your search or category filter.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-md">
          {filteredRows.map((row) => (
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
          ))}
        </div>
      )}

      {doneRows.length > 0 && (
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm font-code-xs text-code-xs text-on-surface-variant flex-wrap justify-center">
            <span>
              {doneRows.length} Asset{doneRows.length === 1 ? '' : 's'} Ready for Distribution
            </span>
            <span>•</span>
            <span>Avg {avgTagCount} Keywords / Asset</span>
            <span>•</span>
            <span className="text-on-surface font-semibold">{schemaLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => onDownloadCSV(platform)}
            className="w-full sm:w-auto px-space-lg py-space-sm rounded-xl bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Icon name="file_download" className="text-[16px]" />
            Download Official CSV Export
          </button>
        </div>
      )}
    </section>
  )
}

export default MetadataTable
