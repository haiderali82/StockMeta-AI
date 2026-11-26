import Icon from './Icon'

function Toast({ message, visible, onDismiss, variant = 'success', title }) {
  const isError = variant === 'error'
  const resolvedTitle = title ?? (isError ? 'Something went wrong' : 'Metadata generated successfully!')

  return (
    <div
      className={`fixed bottom-6 right-6 max-w-md bg-inverse-surface text-inverse-on-surface p-space-md rounded-xl shadow-2xl flex items-start gap-space-sm z-50 transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full ${isError ? 'bg-error' : 'bg-emerald-500'} text-white flex items-center justify-center flex-shrink-0 mt-0.5`}
      >
        <Icon name={isError ? 'error' : 'check'} className="text-[16px]" />
      </div>
      <div className="flex flex-col pr-space-md">
        <span className="font-body-sm text-body-sm font-semibold text-white">{resolvedTitle}</span>
        <span className="font-body-xs text-body-xs text-slate-300 mt-0.5">{message}</span>
      </div>
      <button type="button" onClick={onDismiss} className="text-slate-400 hover:text-white transition-colors">
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  )
}

export default Toast
