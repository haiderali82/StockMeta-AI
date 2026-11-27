import { useNavigate } from 'react-router-dom'
import Icon from '../common/Icon'
import Avatar from '../common/Avatar'
import { useAuth } from '../../context/AuthContext'
import { platforms } from '../../data/dashboardData'

function TopHeader({ onMenuClick = () => {}, platform, onPlatformSelect = () => {} }) {
  const { logout, email } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/30 z-40 px-space-lg flex items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-sm min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="p-space-xs -ml-1 rounded hover:bg-surface-container text-on-surface-variant lg:hidden shrink-0"
        >
          <Icon name="menu" className="text-[22px]" />
        </button>
        <div className="hidden sm:flex items-center gap-space-xs min-w-0">
          <span className="font-body-xs text-body-xs text-on-surface-variant whitespace-nowrap">Workspace</span>
          <span className="text-on-surface-variant/50">/</span>
          <h1 className="font-label-md text-label-md text-on-surface font-semibold whitespace-nowrap truncate">
            AI Metadata Batch Studio
          </h1>
          <span className="hidden lg:inline-flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> GPT-4o Vision Ready
          </span>
        </div>
      </div>
      <div className="flex items-center gap-space-sm shrink-0">
        <div className="hidden md:flex items-center p-0.5 bg-surface-container-low rounded-lg border border-outline-variant/30 font-label-sm text-label-sm">
          {Object.values(platforms).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPlatformSelect(p.id)}
              className={`px-space-sm py-1 rounded-md transition-all ${
                platform === p.id
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="hidden lg:block h-4 w-px bg-outline-variant/40" />
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hidden lg:flex font-body-xs text-body-xs text-on-surface-variant hover:text-on-surface transition-colors items-center gap-1"
        >
          <Icon name="book" className="text-[16px]" />
          Docs
        </a>
        <div className="hidden md:block h-4 w-px bg-outline-variant/40" />
        <button
          type="button"
          aria-label="Notifications"
          className="hidden md:inline-flex relative p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
        >
          <Icon name="notifications" className="text-[20px]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="p-space-xs text-on-surface-variant hover:text-error hover:bg-surface-container rounded-lg transition-colors"
        >
          <Icon name="logout" className="text-[20px]" />
        </button>
        <Avatar email={email} className="w-8 h-8 ring-1 ring-outline-variant/40 font-label-sm text-label-sm" />
      </div>
    </header>
  )
}

export default TopHeader
