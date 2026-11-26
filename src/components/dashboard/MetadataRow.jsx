import Icon from '../common/Icon'

function MetadataRow({ row, isRegenerating, onRemoveKeyword, onAddKeyword, onCategoryChange, onCopy, onRegenerate, onDelete }) {
  return (
    <tr className="hover:bg-surface-container-low/60 transition-colors group">
      <td className="py-3 px-space-md align-top">
        <div className="flex items-start gap-space-sm">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 shadow-xs">
            <img className="w-full h-full object-cover" src={row.img} alt={row.filename} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-body-xs text-body-xs font-semibold text-on-surface truncate" title={row.filename}>
              {row.filename}
            </span>
            <span className="font-code-xs text-code-xs text-on-surface-variant mt-0.5">
              {row.dims} • {row.size}
            </span>
            <span className="font-code-xs text-code-xs text-emerald-600 font-medium">{row.badge}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-space-md align-top">
        <div className="relative group/edit">
          <div
            className="font-body-sm text-body-sm font-medium text-on-surface p-1 rounded hover:bg-surface-container focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
          >
            {row.title}
          </div>
          <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-code-xs text-code-xs">
            <Icon name="edit" className="text-[12px]" />
            <span>{row.title.length} / 200 chars</span>
            <span className="text-emerald-600 ml-1">• {row.seoNote}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-space-md align-top">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1">
            {row.keywords.map((kw, idx) => (
              <span
                key={`${kw}-${idx}`}
                className="inline-flex items-center gap-1 bg-surface-container text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded-full"
              >
                {kw}{' '}
                <button type="button" className="hover:text-error text-on-surface-variant" onClick={() => onRemoveKeyword(row.id, idx)}>
                  ×
                </button>
              </span>
            ))}
            <span className="font-code-xs text-code-xs text-on-surface-variant px-1">+{row.moreCount} more</span>
            <button type="button" className="font-label-sm text-label-sm text-primary hover:underline px-1" onClick={() => onAddKeyword(row.id)}>
              + Add
            </button>
          </div>
          <div className="flex items-center justify-between font-code-xs text-code-xs text-on-surface-variant">
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
              {row.keywordTotal} / {row.keywordMax} keywords{row.keywordTotal >= row.keywordMax ? ' (Maxed)' : ' generated'}
            </span>
            <span>Density: {row.density}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-space-md align-top">
        <div className="flex flex-col gap-1">
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
      </td>
      <td className="py-3 px-space-md align-top text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="Copy Metadata"
            onClick={() => onCopy(row.id)}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <Icon name="content_copy" className="text-[18px]" />
          </button>
          <button
            type="button"
            title="Regenerate with AI"
            onClick={() => onRegenerate(row.id)}
            className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <Icon name="autorenew" className={`text-[18px] ${isRegenerating ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            title="Delete Item"
            onClick={() => onDelete(row.id)}
            className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors"
          >
            <Icon name="delete" className="text-[18px]" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default MetadataRow
