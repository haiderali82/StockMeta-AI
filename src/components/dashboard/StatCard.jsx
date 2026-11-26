import Icon from '../common/Icon'

const accentClasses = {
  primary: { bar: 'group-hover:bg-primary', iconBg: 'bg-surface-container-low group-hover:bg-primary-fixed', icon: 'text-primary' },
  secondary: { bar: 'group-hover:bg-secondary', iconBg: 'bg-secondary-fixed/40 group-hover:bg-secondary-fixed', icon: 'text-secondary' },
  tertiary: { bar: 'group-hover:bg-tertiary', iconBg: 'bg-tertiary-fixed group-hover:bg-tertiary-fixed-dim', icon: 'text-tertiary' },
  neutral: { bar: 'group-hover:bg-primary', iconBg: 'bg-surface-container-high group-hover:bg-surface-dim', icon: 'text-on-surface' },
}

function StatCard({ stat }) {
  const accent = accentClasses[stat.accent]
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-surface-container-high transition-colors ${accent.bar}`} />
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
          <span className="font-display-lg text-display-lg text-on-surface font-semibold mt-1">{stat.value}</span>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${accent.iconBg} ${accent.icon}`}>
          <Icon name={stat.icon} filled={stat.iconFilled} className="text-[22px]" />
        </div>
      </div>
      <div className="flex items-center gap-space-xs mt-space-md pt-space-xs">
        {stat.trend ? (
          <>
            <span className="inline-flex items-center gap-0.5 font-label-sm text-label-sm text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <Icon name={stat.trendIcon} className="text-[14px]" /> {stat.trend}
            </span>
            <span className="font-body-xs text-body-xs text-on-surface-variant">{stat.note}</span>
          </>
        ) : (
          <>
            <span
              className={
                stat.id === 'keywords'
                  ? 'inline-flex items-center font-code-xs text-code-xs text-tertiary bg-surface-container-high px-1.5 py-0.5 rounded'
                  : 'font-label-sm text-label-sm text-on-surface font-medium'
              }
            >
              {stat.chip}
            </span>
            <span className="font-body-xs text-body-xs text-on-surface-variant">{stat.note}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default StatCard
