import Icon from '../common/Icon'

function MetadataRow({
  row,
  isRegenerating,
  onRemoveKeyword,
  onEditKeywords,
  onCategoryChange,
  onCopy,
  onRegenerate,
  onDelete,
  onDownloadSEOFile,
}) {
  const description = row.description ?? ''

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col lg:flex-row gap-space-lg">
      <div className="flex lg:flex-col items-start gap-space-md lg:w-44 flex-shrink-0">
        <div className="relative w-28 h-28 lg:w-full lg:h-28 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 shadow-xs">
          <img className="w-full h-full object-cover" src={row.img} alt={row.filename} />
          <button
            type="button"
            title="Delete Item"
            onClick={() => onDelete(row.id)}
            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-error text-on-error hover:opacity-90 transition-opacity shadow-sm"
          >
            <Icon name="delete" className="text-[16px]" />
          </button>
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="font-body-xs text-body-xs font-semibold text-on-surface truncate" title={row.filename}>
            {row.filename}
          </span>
          <span className="font-code-xs text-code-xs text-on-surface-variant">
            {row.dims} • {row.size}
          </span>
          {row.badge && <span className="font-code-xs text-code-xs text-emerald-600 font-medium">{row.badge}</span>}
          <select
            value={row.category}
            onChange={(e) => onCategoryChange(row.id, e.target.value)}
            className="bg-surface-container-low text-on-surface font-body-xs text-body-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          >
            {row.categoryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="font-code-xs text-code-xs text-on-surface-variant">Adobe Category #{row.categoryNumber}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-space-md">
        <div>
          <div className="flex items-center justify-between gap-space-sm mb-1">
            <div className="flex items-center gap-1.5">
              <Icon name="title" className="text-primary text-[18px]" />
              <span className="font-label-md text-label-md font-semibold text-on-surface">Title</span>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="font-code-xs text-code-xs text-on-surface-variant">{row.title.length} chars</span>
              <button
                type="button"
                onClick={() => onDownloadSEOFile(row.id)}
                className="px-space-sm py-1 bg-primary text-on-primary font-label-sm text-label-sm font-semibold rounded-md flex items-center gap-1 hover:bg-on-primary-fixed-variant transition-colors"
              >
                <Icon name="download" className="text-[14px]" />
                SEO File
              </button>
              <button
                type="button"
                onClick={() => onCopy(row.id, 'title')}
                className="px-space-sm py-1 bg-surface-container-low text-on-surface font-label-sm text-label-sm font-semibold rounded-md flex items-center gap-1 hover:bg-surface-container transition-colors"
              >
                <Icon name="content_copy" className="text-[14px]" />
                Copy
              </button>
            </div>
          </div>
          <div
            className="font-body-sm text-body-sm text-on-surface bg-surface-container-low rounded-lg px-space-md py-space-sm min-h-[2.5rem] hover:bg-surface-container focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
          >
            {row.title || 'Title...'}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-space-sm mb-1">
            <div className="flex items-center gap-1.5">
              <Icon name="notes" className="text-primary text-[18px]" />
              <span className="font-label-md text-label-md font-semibold text-on-surface">Description</span>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="font-code-xs text-code-xs text-on-surface-variant">{description.length} chars</span>
              <button
                type="button"
                onClick={() => onCopy(row.id, 'description')}
                className="px-space-sm py-1 bg-surface-container-low text-on-surface font-label-sm text-label-sm font-semibold rounded-md flex items-center gap-1 hover:bg-surface-container transition-colors"
              >
                <Icon name="content_copy" className="text-[14px]" />
                Copy
              </button>
            </div>
          </div>
          <div
            className="font-body-sm text-body-sm text-on-surface bg-surface-container-low rounded-lg px-space-md py-space-sm min-h-[3.25rem] hover:bg-surface-container focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
          >
            {description || 'Description or Generated Prompt...'}
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-space-md">
          <div className="flex items-center justify-between gap-space-sm mb-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="sell" className="text-amber-500 text-[18px]" />
              <span className="font-label-md text-label-md font-semibold text-amber-600">Keywords</span>
              <span className="font-label-md text-label-md font-semibold text-on-surface">{row.keywordTotal ?? row.keywords.length}</span>
            </div>
            <div className="flex items-center gap-space-sm">
              <button
                type="button"
                onClick={() => onEditKeywords(row.id)}
                className="px-space-sm py-1 bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold rounded-md flex items-center gap-1 hover:bg-surface-container-high transition-colors"
              >
                <Icon name="edit" className="text-[14px]" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onCopy(row.id, 'keywords')}
                className="px-space-sm py-1 bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold rounded-md flex items-center gap-1 hover:bg-surface-container-high transition-colors"
              >
                <Icon name="content_copy" className="text-[14px]" />
                Copy
              </button>
            </div>
          </div>
          {row.keywords.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant italic text-center py-space-sm">
              No keywords generated yet.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                {row.keywords.map((kw, idx) => (
                  <span
                    key={`${kw}-${idx}`}
                    className="inline-flex items-center gap-1 bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded-full shadow-xs"
                  >
                    {kw}
                    <button
                      type="button"
                      className="hover:text-error text-on-surface-variant"
                      onClick={() => onRemoveKeyword(row.id, idx)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between font-code-xs text-code-xs text-on-surface-variant mt-space-sm">
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                  {row.keywordTotal} / {row.keywordMax} keywords{row.keywordTotal >= row.keywordMax ? ' (Maxed)' : ' generated'}
                </span>
                <span>Density: {row.density}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onRegenerate(row.id)}
            className="px-space-lg py-space-sm bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg flex items-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
          >
            <Icon name="autorenew" className={`text-[18px] ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  )
}

export default MetadataRow
