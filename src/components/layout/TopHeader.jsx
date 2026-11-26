import { useNavigate } from 'react-router-dom'
import Icon from '../common/Icon'
import Avatar from '../common/Avatar'
import { useAuth } from '../../context/AuthContext'

function TopHeader({ onMenuClick = () => {} }) {
  const { logout, email } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/30 z-40 px-space-lg flex items-center justify-between">
      <div className="flex items-center gap-space-lg min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="p-space-xs -ml-1 rounded hover:bg-surface-container text-on-surface-variant lg:hidden shrink-0"
        >
          <Icon name="menu" className="text-[22px]" />
        </button>
        <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant min-w-0">
          <Icon name="auto_awesome" className="text-[16px] shrink-0" />
          <span className="font-body-xs text-body-xs font-medium text-on-surface whitespace-nowrap">AI Engine:</span>
          <span className="font-label-sm text-label-sm text-tertiary bg-surface-container px-space-xs py-0.5 rounded whitespace-nowrap">
            Active (GPT-4o Vision)
          </span>
        </div>
      </div>
      <div className="flex items-center gap-space-md">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hidden md:flex font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors items-center gap-1"
        >
          <Icon name="description" className="text-[16px]" />
          Documentation
        </a>
        <div className="hidden md:block h-4 w-px bg-outline-variant/40" />
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
        >
          <Icon name="notifications" className="text-[20px]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>
        <div className="h-4 w-px bg-outline-variant/40" />
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
