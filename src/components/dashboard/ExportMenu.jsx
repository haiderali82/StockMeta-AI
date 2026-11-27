import { useEffect, useRef } from 'react'
import Icon from '../common/Icon'

function ExportMenu({ open, onToggle, onClose, onDownloadCSV, onExportJSON }) {
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose()
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [onClose])

  return (
    <div className="relative" ref={containerRef}>
      <div className="inline-flex rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={onToggle}
          className="px-space-md py-1.5 bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
        >
          <Icon name="file_download" className="text-[16px]" />
          <span>Download CSV</span>
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="px-2 py-1.5 bg-primary text-on-primary border-l border-on-primary/20 hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200"
        >
          <Icon name="arrow_drop_down" className={`text-[16px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-xl p-space-xs z-30 flex flex-col gap-1">
          <div className="px-space-sm py-1 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Export Schemas
          </div>
          <button
            type="button"
            onClick={() => onDownloadCSV('adobe')}
            className="flex items-start gap-space-sm p-space-sm rounded-lg hover:bg-surface-container-low text-left transition-all duration-200"
          >
            <div className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center font-bold text-xs">St</div>
            <div className="flex flex-col">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">Download Adobe Stock CSV</span>
              <span className="font-code-xs text-code-xs text-on-surface-variant">Cols: Filename, Title, Keywords, Category</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onDownloadCSV('shutterstock')}
            className="flex items-start gap-space-sm p-space-sm rounded-lg hover:bg-surface-container-low text-left transition-all duration-200"
          >
            <div className="w-6 h-6 rounded bg-red-700 text-white flex items-center justify-center font-bold text-xs">Ss</div>
            <div className="flex flex-col">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">Download Shutterstock CSV</span>
              <span className="font-code-xs text-code-xs text-on-surface-variant">Cols: Filename, Description, Keywords, Categories</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default ExportMenu
