import Icon from '../common/Icon'

function MetadataRow({
  row,
  platform,
  isRegenerating,
  onRemoveKeyword,
  onEditKeywords,
  onCategoryChange,
  onCategory2Change,
  onCopy,
  onRegenerate,
  onDelete,
  onDownloadSEOFile,
}) {
  const description = row.description ?? ''
  const borderClass =
    row.status === 'done'
      ? 'border-primary-container'
      : row.status === 'generating'
        ? 'border-primary-container animate-pulse'
        : 'border-amber-500'

  return (
    <div
      id={`metadata-row-${row.id}`}
      className={`bg-surface-container-lowest rounded-2xl border-2 ${borderClass} shadow-xs p-space-lg flex flex-col lg:flex-row gap-space-lg hover:shadow-md transition-colors`}
    >
      <div className="flex lg:flex-col items-center lg:items-start gap-space-md lg:w-44 flex-shrink-0">
        <div className="w-24 h-24 lg:w-full lg:h-32 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20 shadow-xs flex-shrink-0">
          <img className="w-full h-full object-cover" src={row.img} alt={row.filename} />
        </div>
        <button
          type="button"
          onClick={() => onDelete(row.id)}
          title="Delete"
          aria-label="Delete image"
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-error/30 bg-error-container/30 text-error font-label-sm text-label-sm font-medium hover:bg-error-container/60 hover:border-error/50 transition-colors"
        >
          <Icon name="delete" className="text-[15px]" />
          Delete
        </button>
        <div className="flex flex-col text-on-surface-variant min-w-0">
          <span className="font-body-xs text-body-xs font-semibold text-on-surface truncate max-w-[180px]" title={row.filename}>
            {row.filename}
          </span>
          <span className="font-code-xs text-code-xs text-on-surface-variant mt-0.5">
            {row.dims} • {row.size}
          </span>
          {row.badge && (
            <span className="font-code-xs text-code-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <Icon name="check" className="text-[13px]" /> {row.badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between gap-space-md">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-space-sm">
            <span className="font-code-xs text-code-xs text-on-surface-variant uppercase tracking-wider">
              Commercial Title (Editable)
            </span>
            <div className="flex items-center gap-space-sm">
              <span className="font-code-xs text-code-xs text-on-surface-variant">{row.title.length} chars</span>
              <button
                type="button"
                onClick={() => onDownloadSEOFile(row.id)}
                className="font-label-sm text-label-sm font-semibold text-primary hover:text-on-primary-fixed-variant flex items-center gap-1"
              >
                <Icon name="download" className="text-[14px]" />
                SEO File
              </button>
              <button
                type="button"
                onClick={() => onCopy(row.id, 'title')}
                className="font-label-sm text-label-sm font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1"
              >
                <Icon name="content_copy" className="text-[14px]" />
                Copy
              </button>
            </div>
          </div>
          <div
            className="font-label-md text-label-md font-semibold text-on-surface p-space-sm rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low focus:bg-surface-container-lowest border border-outline-variant/20 focus:ring-1 focus:ring-primary outline-none transition-colors"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
          >
            {row.title || 'Title…'}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-space-sm">
            <span className="font-code-xs text-code-xs text-on-surface-variant uppercase tracking-wider">Description</span>
            <div className="flex items-center gap-space-sm">
              <span className="font-code-xs text-code-xs text-on-surface-variant">{description.length} chars</span>
              <button
                type="button"
                onClick={() => onCopy(row.id, 'description')}
                className="font-label-sm text-label-sm font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1"
              >
                <Icon name="content_copy" className="text-[14px]" />
                Copy
              </button>
            </div>
          </div>
          <div
            className="font-body-sm text-body-sm text-on-surface p-space-sm rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low focus:bg-surface-container-lowest border border-outline-variant/20 focus:ring-1 focus:ring-primary outline-none transition-colors min-h-[2.75rem]"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
          >
            {description || 'Description or generated prompt…'}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-space-sm">
            <span className="font-code-xs text-code-xs text-on-surface-variant uppercase tracking-wider">Keywords &amp; Intent Ordering</span>
            <span className="font-code-xs text-code-xs text-on-surface font-medium">
              {row.keywordTotal ?? row.keywords.length} / {row.keywordMax} keywords
              {row.keywordTotal >= row.keywordMax ? ' (Maxed)' : ''}
            </span>
          </div>
          {row.keywords.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant italic py-space-sm">No keywords generated yet.</p>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              {row.keywords.map((kw, idx) => (
                <span
                  key={`${kw}-${idx}`}
                  className="inline-flex items-center gap-1 font-body-xs text-body-xs px-2.5 py-1 rounded-md bg-surface-container-low text-on-surface-variant"
                >
                  {kw}
                  <button
                    type="button"
                    className="hover:text-error text-on-surface-variant/70 ml-0.5"
                    onClick={() => onRemoveKeyword(row.id, idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => onEditKeywords(row.id)}
                className="font-label-sm text-label-sm font-semibold text-primary hover:text-on-primary-fixed-variant px-2 py-0.5 rounded transition-colors"
              >
                + Add tag
              </button>
            </div>
          )}
        </div>

        <div className="pt-space-sm border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="font-body-xs text-body-xs text-on-surface-variant">Platform Category:</span>
            <select
              value={row.category}
              onChange={(e) => onCategoryChange(row.id, e.target.value)}
              className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 font-label-sm text-label-sm font-medium text-on-surface rounded-lg px-space-sm py-1 focus:outline-none cursor-pointer"
            >
              {row.categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                  {row.categoryNumber != null && opt === row.category ? ` (#${row.categoryNumber})` : ''}
                </option>
              ))}
            </select>
            {platform === 'shutterstock' && (
              <select
                value={row.category2 ?? ''}
                onChange={(e) => onCategory2Change(row.id, e.target.value)}
                className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 font-label-sm text-label-sm font-medium text-on-surface-variant rounded-lg px-space-sm py-1 focus:outline-none cursor-pointer"
              >
                <option value="">+ Secondary category</option>
                {row.categoryOptions
                  .filter((opt) => opt !== row.category)
                  .map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
              </select>
            )}
            {row.needsReview && (
              <span className="inline-flex items-center gap-1 font-code-xs text-code-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                <Icon name="flag" className="text-[13px]" />
                Needs manual review
              </span>
            )}
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={() => onCopy(row.id, 'all')}
              className="px-space-sm py-1 rounded-lg font-label-sm text-label-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low flex items-center gap-1 transition-colors"
            >
              <Icon name="content_copy" className="text-[15px]" />
              Copy
            </button>
            <button
              type="button"
              onClick={() => onRegenerate(row.id)}
              className="px-space-sm py-1 rounded-lg font-label-sm text-label-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low flex items-center gap-1 transition-colors"
            >
              <Icon name="refresh" className={`text-[15px] ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Generating…' : row.status === 'pending' ? 'Generate' : 'Regenerate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetadataRow
