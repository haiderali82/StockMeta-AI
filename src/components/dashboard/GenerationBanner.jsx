import Icon from '../common/Icon'

function GenerationBanner({ queueCount, isProcessing, onGenerate }) {
  return (
    <div className="relative rounded-2xl p-space-xl bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary shadow-xl overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm uppercase bg-white/20 px-2 py-0.5 rounded text-white font-semibold tracking-wider">
              Multi-Modal Vision Engine
            </span>
            <span className="font-label-sm text-label-sm bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded">
              Taxonomy Certified
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-white">
            Generate Commercial Stock Metadata
          </h2>
          <p className="font-body-sm text-body-sm text-white/80 mt-1">
            AI will analyze image lighting, subjects, emotion, context, and copy space to synthesize high-conversion titles,
            descriptions, categorized tags, and platform categories.
          </p>
          <div className="flex flex-wrap items-center gap-space-md mt-space-md pt-space-xs text-white/90">
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-space-sm py-1 rounded-lg">
              <Icon name="tag" className="text-[16px] text-tertiary-fixed" />
              <span className="font-body-xs text-body-xs">Keyword Count:</span>
              <span className="font-label-sm text-label-sm font-bold text-white">Max (49 Keywords)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-space-sm py-1 rounded-lg">
              <Icon name="translate" className="text-[16px] text-tertiary-fixed" />
              <span className="font-body-xs text-body-xs">Target Language:</span>
              <span className="font-label-sm text-label-sm font-bold text-white">English (US)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-space-sm py-1 rounded-lg">
              <Icon name="category" className="text-[16px] text-tertiary-fixed" />
              <span className="font-body-xs text-body-xs">Output Style:</span>
              <span className="font-label-sm text-label-sm font-bold text-white">Commercial &amp; Editorial</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md">
          <button
            type="button"
            onClick={onGenerate}
            className="group relative overflow-hidden px-space-xl py-4 rounded-xl bg-surface-container-lowest text-primary font-headline-sm text-headline-sm font-bold shadow-xl hover:bg-surface hover:shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-space-sm"
          >
            {isProcessing ? (
              <>
                <Icon name="refresh" className="text-primary text-[24px] animate-spin" />
                <span>AI Vision Engine Analyzing {queueCount} Assets...</span>
                <span className="font-label-sm text-label-sm bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-bold">
                  In-Progress
                </span>
              </>
            ) : (
              <>
                <Icon name="bolt" className="text-primary text-[24px] group-hover:rotate-12 transition-transform" />
                <span>Generate Metadata with AI</span>
                <span className="font-label-sm text-label-sm bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-bold">
                  {queueCount} Images
                </span>
              </>
            )}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerationBanner
