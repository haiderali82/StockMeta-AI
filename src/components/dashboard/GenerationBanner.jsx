import Icon from '../common/Icon'

function GenerationBanner({ queueCount, isProcessing, onGenerate }) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-md">
        <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center border border-primary/10 shrink-0">
          <Icon name="auto_awesome" className="text-[20px]" />
        </div>
        <div>
          <h3 className="font-label-md text-label-md font-semibold text-on-surface">Run Deep Vision Semantic Tagging</h3>
          <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">
            Analyzes subjects, lighting, mood, framing, and copy-space for commercial microstock relevance.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onGenerate}
        disabled={isProcessing || queueCount === 0}
        className="px-space-lg py-space-sm rounded-xl bg-primary hover:bg-on-primary-fixed-variant disabled:opacity-60 disabled:cursor-not-allowed text-on-primary font-label-md text-label-md font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
      >
        <Icon name={isProcessing ? 'refresh' : 'bolt'} className={`text-[16px] ${isProcessing ? 'animate-spin' : ''}`} />
        <span>{isProcessing ? `Analyzing ${queueCount} Assets…` : `Generate Metadata (${queueCount} Assets)`}</span>
      </button>
    </div>
  )
}

export default GenerationBanner
