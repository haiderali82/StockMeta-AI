import Icon from '../common/Icon'
import Avatar from '../common/Avatar'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: 'image-library', label: 'Image Library', icon: 'photo_library', badge: '142' },
  { path: 'generated-metadata', label: 'Generated Metadata', icon: 'sell' },
  { path: 'download-history', label: 'Download History', icon: 'history' },
  { path: 'api-integrations', label: 'API & Integrations', icon: 'hub' },
  { path: 'settings', label: 'Settings', icon: 'settings' },
]

function Sidebar({ open = false, onClose = () => {} }) {
  const { email } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-on-surface/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
      <div className="flex flex-col">
        <div className="h-16 px-space-lg flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
              <Icon name="layers" className="text-on-primary text-[18px]" />
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">
              StockMeta<span className="text-primary font-bold ml-0.5">AI</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-space-xs rounded hover:bg-surface-container text-on-surface-variant lg:hidden"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
          <span className="hidden lg:inline font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-space-xs py-0.5 rounded">
            v2.4
          </span>
        </div>
        <nav className="flex flex-col gap-space-xs p-space-md">
          {navItems.map((item) => {
            const isActive = item.path === 'dashboard'
            return (
              <a
                key={item.path}
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-md">
                  <Icon name={item.icon} className="text-[18px]" />
                  <span className="font-body-sm text-body-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="font-label-sm text-label-sm px-space-xs py-0.5 bg-surface-container-high text-on-surface rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            )
          })}
        </nav>
      </div>
      <div className="p-space-md flex flex-col gap-space-md border-t border-outline-variant/20 bg-surface-container-lowest">
        <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-space-xs">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase">Monthly AI Tags</span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">640 / 1,000</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '64%' }} />
          </div>
        </div>
        <div className="flex items-center justify-between pt-space-xs">
          <div className="flex items-center gap-space-sm min-w-0">
            <Avatar email={email} className="w-8 h-8 font-label-sm text-label-sm" />
            <div className="flex flex-col min-w-0">
              <span className="font-body-sm text-body-sm text-on-surface font-medium leading-none truncate">{email || 'Admin'}</span>
              <span className="font-code-xs text-code-xs text-on-surface-variant mt-0.5">Admin</span>
            </div>
          </div>
          <button type="button" className="text-on-surface-variant hover:text-on-surface p-space-xs rounded hover:bg-surface-container">
            <Icon name="more_vert" className="text-[18px]" />
          </button>
        </div>
      </div>
      </aside>
    </>
  )
}

export default Sidebar
