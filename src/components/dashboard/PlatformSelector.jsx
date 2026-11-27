import Icon from '../common/Icon'
import { platforms } from '../../data/dashboardData'

const guidelineNotes = {
  adobe: 'Auto-tailoring tags strictly for Adobe Stock requirements (5–49 tags).',
  shutterstock: 'Auto-tailoring tags strictly for Shutterstock requirements (7–50 tags, dual categories).',
}

function PlatformCard({ platform, active, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer bg-surface-container-lowest p-space-lg rounded-2xl transition-all relative flex flex-col justify-between group ${
        active ? 'border-2 border-primary shadow-md' : 'border border-outline-variant/40 shadow-xs hover:border-outline-variant'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-space-md">
          <div className={`w-10 h-10 rounded-xl text-white font-bold text-base flex items-center justify-center shadow-xs ${platform.logoBg}`}>
            {platform.logoText ? platform.logoText : <Icon name={platform.logoIcon} className="text-[22px]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-[15px] font-semibold text-on-surface">{platform.name}</h3>
              {active && (
                <span className="font-code-xs text-code-xs px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-semibold border border-primary/10">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">{platform.tagline}</p>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            active ? 'border-primary' : 'border-outline-variant'
          }`}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-primary' : 'bg-transparent'}`} />
        </div>
      </div>
      <div className="mt-space-md pt-space-sm border-t border-outline-variant/20 flex items-center flex-wrap gap-space-sm font-code-xs text-code-xs text-on-surface-variant">
        {platform.badges.map((badge, idx) =>
          idx < 2 ? (
            <span key={badge} className="bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/30 text-on-surface">
              {badge}
            </span>
          ) : (
            <span key={badge} className="text-on-surface-variant">
              {badge}
            </span>
          )
        )}
      </div>
    </div>
  )
}

function PlatformSelector({ selected, onSelect }) {
  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div className="flex items-center gap-2">
          <span className="font-code-xs text-code-xs text-on-surface-variant/70 font-semibold uppercase tracking-wider">Zone 1</span>
          <span className="font-label-md text-label-md font-semibold text-on-surface">Target Marketplace Algorithm</span>
        </div>
        <span className="font-body-xs text-body-xs text-on-surface-variant">{guidelineNotes[selected]}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {Object.values(platforms).map((p) => (
          <PlatformCard key={p.id} platform={p} active={selected === p.id} onSelect={() => onSelect(p.id)} />
        ))}
      </div>
    </section>
  )
}

export default PlatformSelector
