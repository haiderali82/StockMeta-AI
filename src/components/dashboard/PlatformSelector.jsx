import Icon from '../common/Icon'
import { platforms } from '../../data/dashboardData'

function PlatformCard({ platform, active, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer relative p-space-lg rounded-xl transition-all duration-200 bg-surface-container-lowest ${
        active
          ? 'shadow-md ring-2 ring-primary bg-gradient-to-br from-surface-container-lowest via-primary-fixed/15 to-surface-container-lowest'
          : 'shadow-sm hover:shadow-md hover:bg-surface-container-low/50'
      }`}
    >
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-center gap-space-md">
          <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-display-lg text-[22px] font-bold shadow-sm ${platform.logoBg} ${platform.logoText ? 'tracking-tighter' : ''}`}>
            {platform.logoText ? platform.logoText : <Icon name={platform.logoIcon} className="text-[28px]" />}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm text-on-surface">{platform.name}</span>
              {active && (
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm bg-primary-container text-on-primary px-2 py-0.5 rounded-full shadow-xs">
                  <Icon name="check" className="text-[13px]" /> Active Selection
                </span>
              )}
            </div>
            <span className="font-code-xs text-code-xs text-on-surface-variant mt-0.5">{platform.tagline}</span>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            active ? 'bg-primary text-on-primary' : 'bg-surface-container-highest'
          }`}
        >
          {active ? (
            <Icon name="check_circle" className="text-[16px]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-transparent" />
          )}
        </div>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-md">{platform.description}</p>
      <div className="mt-space-md pt-space-xs flex items-center gap-space-sm flex-wrap font-code-xs text-code-xs">
        {platform.badges.map((badge) => (
          <span key={badge} className="bg-surface-container-high px-space-xs py-0.5 rounded text-on-surface">
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}

function PlatformSelector({ selected, onSelect }) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs">
            <Icon name="layers" className="text-primary text-[20px]" /> Target Microstock Platform
          </h2>
          <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">
            Select the marketplace algorithm to tailor character limits, category structures, and keyword density.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Switch Platform:</span>
          <div className="inline-flex bg-surface-container-low p-1 rounded-full shadow-inner">
            {Object.values(platforms).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                className={`px-space-md py-1 rounded-full font-label-sm text-label-sm transition-all ${
                  selected === p.id
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {Object.values(platforms).map((p) => (
          <PlatformCard key={p.id} platform={p} active={selected === p.id} onSelect={() => onSelect(p.id)} />
        ))}
      </div>
    </div>
  )
}

export default PlatformSelector
