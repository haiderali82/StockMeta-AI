import Icon from '../common/Icon'

function EmptyState({ onRestore }) {
  return (
    <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col items-center justify-center text-center py-16">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-space-md">
        <Icon name="filter_none" className="text-[36px]" />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">No Assets in Queue</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-1">
        Drag high-resolution microstock imagery into the dropzone above or connect an external S3 / Cloud repository to start
        AI indexing.
      </p>
      <button
        type="button"
        onClick={onRestore}
        className="mt-space-lg px-space-lg py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-on-primary-fixed-variant transition-colors"
      >
        Restore Demo Batch (4 Images)
      </button>
    </div>
  )
}

export default EmptyState
