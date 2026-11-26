const modes = [
  { id: 'completed', label: '● Generation Completed (Default)' },
  { id: 'processing', label: 'AI Generating (Active Pulse)' },
  { id: 'empty', label: 'Empty Dropzone State' },
  { id: 'failed', label: 'Failed / Retry State' },
]

function WorkspaceModeBar({ mode, onModeChange, platformFormatLabel }) {
  return (
    <div className="px-space-xl py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm">
      <div className="flex items-center gap-space-sm">
        <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Workspace Mode:</span>
        <div className="flex items-center gap-1 bg-surface-container-lowest p-0.5 rounded-lg shadow-sm">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onModeChange(m.id)}
              className={`px-space-sm py-1 rounded font-label-sm text-label-sm transition-all ${
                mode === m.id
                  ? 'font-semibold bg-primary-container text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-1 text-on-surface-variant font-code-xs text-code-xs bg-surface-container-lowest px-space-sm py-1 rounded shadow-xs">
          <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
          <span>
            LATENCY: <strong className="text-on-surface">3.2s</strong> / 4 ITEMS
          </span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant font-code-xs text-code-xs bg-surface-container-lowest px-space-sm py-1 rounded shadow-xs">
          <span className="material-symbols-outlined text-[14px] text-tertiary">tune</span>
          <span>
            FORMAT: <strong className="text-on-surface">{platformFormatLabel}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceModeBar
