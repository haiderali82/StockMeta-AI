import Icon from '../common/Icon'

function QueueItemCard({ item, onRemove }) {
  const isAnalyzing = item.status === 'analyzing'

  return (
    <div
      className={`bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-space-sm group hover:bg-surface-container transition-all shadow-xs ${
        isAnalyzing ? 'ring-1 ring-primary/40' : ''
      }`}
    >
      <div className="relative w-full h-36 rounded-lg overflow-hidden bg-surface-container-high">
        <img className="w-full h-full object-cover" src={item.img} alt={item.filename} />
        <span className="absolute top-2 left-2 font-code-xs text-code-xs bg-surface-container-lowest/90 backdrop-blur-md px-1.5 py-0.5 rounded text-on-surface font-semibold">
          {item.ext}
        </span>
        <button
          type="button"
          title="Remove"
          onClick={() => onRemove(item.id)}
          className="absolute top-2 right-2 w-7 h-7 rounded bg-surface-container-lowest/80 text-on-surface hover:text-error hover:bg-surface-container-lowest flex items-center justify-center transition-colors"
        >
          <Icon name="delete" className="text-[16px]" />
        </button>
        {isAnalyzing ? (
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2">
            <div className="w-full px-4">
              <div className="flex justify-between font-code-xs text-code-xs mb-1 font-semibold text-white drop-shadow">
                <span>Vision Analysis</span>
                <span>{item.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-primary-fixed animate-pulse" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-code-xs text-code-xs text-white bg-on-surface/70 backdrop-blur-sm px-2 py-0.5 rounded">
            <span>{item.dims}</span>
            <span>{item.size}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-body-xs text-body-xs font-semibold text-on-surface truncate" title={item.filename}>
          {item.filename}
        </span>
        <div className="flex items-center justify-between mt-1">
          {isAnalyzing ? (
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" /> Analyzing Features...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Ready for AI
            </span>
          )}
          <span className="font-code-xs text-code-xs text-on-surface-variant">{isAnalyzing ? item.size : item.dpi}</span>
        </div>
      </div>
    </div>
  )
}

export default QueueItemCard
