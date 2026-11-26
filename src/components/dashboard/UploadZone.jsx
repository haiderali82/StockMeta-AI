import Icon from '../common/Icon'

function UploadZone({ queueCount, onBrowseFiles, onImportCloud }) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Icon name="cloud_upload" className="text-primary text-[20px]" />
          <span className="font-headline-sm text-headline-sm text-on-surface">Asset Ingestion</span>
        </div>
        {/* <div className="bg-primary-fixed px-space-md py-1 rounded-full flex items-center gap-1.5 text-on-primary-fixed">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="font-label-sm text-label-sm font-semibold">{queueCount} Images Staged for AI Processing</span>
        </div> */}
      </div>

      <div
        onClick={onBrowseFiles}
        className="relative group p-space-xl rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden shadow-inner"
      >
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="24" id="upload-grid" patternUnits="userSpaceOnUse" width="24">
              <circle className="text-outline-variant" cx="2" cy="2" fill="currentColor" r="1" />
            </pattern>
          </defs>
          <rect fill="url(#upload-grid)" height="100%" width="100%" />
        </svg>
        <div className="relative z-10 flex flex-col items-center max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-lowest text-primary shadow-md flex items-center justify-center mb-space-md group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
            <Icon name="upload_file" className="text-[32px]" />
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Upload Your Stock Images</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Drag and drop your high-resolution images here 
          </p>
          <div className="flex items-center gap-space-sm mt-space-lg">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onBrowseFiles()
              }}
              className="px-space-lg py-space-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-on-primary-fixed-variant transition-colors shadow-sm flex items-center gap-2"
            >
              <Icon name="folder_open" className="text-[18px]" /> Browse Files
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-space-md gap-y-1 mt-space-lg pt-space-xs font-code-xs text-code-xs text-on-surface-variant">
            <span>• JPEG, PNG, Only</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadZone
