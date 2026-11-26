import Icon from '../common/Icon'

function FailedState({ onRetry, onDismiss }) {
  return (
    <div className="bg-error-container text-on-error-container p-space-lg rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-md">
        <div className="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0">
          <Icon name="warning" className="text-[20px]" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm font-semibold">2 Assets Failed Rate-Limit Validation</span>
          <span className="font-body-xs text-body-xs opacity-90 mt-0.5">
            External API gateway returned code 429: Vision Model Tokens throttled. Remaining 2 assets succeeded.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-space-sm">
        <button
          type="button"
          onClick={onRetry}
          className="px-space-md py-1.5 bg-error text-on-error rounded-lg font-label-sm text-label-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Retry Failed Assets
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="px-space-md py-1.5 bg-surface-container-lowest text-on-surface rounded-lg font-label-sm text-label-sm font-semibold hover:bg-surface-container transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

export default FailedState
