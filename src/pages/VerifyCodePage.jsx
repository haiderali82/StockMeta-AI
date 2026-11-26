import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/common/Icon'
import { useAuth } from '../context/AuthContext'

const INITIAL_SECONDS = 60
const START_SECONDS = 42

function VerifyCodePage() {
  const { pendingEmail, completeVerification } = useAuth()
  const navigate = useNavigate()
  const [digits, setDigits] = useState(['8', '4', '2', '', '', ''])
  const [trustDevice, setTrustDevice] = useState(true)
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS)
  const [focusedIndex, setFocusedIndex] = useState(3)
  const inputRefs = useRef([])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [secondsLeft])

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')
  const progressPct = Math.max(0, (secondsLeft / INITIAL_SECONDS) * 100)

  function handleDigitChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    if (digit && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const data = e.clipboardData.getData('text').trim().replace(/\D/g, '')
    if (!data) return
    const next = Array.from({ length: 6 }, (_, i) => data[i] || '')
    setDigits(next)
    const nextFocus = Math.min(data.length, 5)
    inputRefs.current[nextFocus]?.focus()
    setFocusedIndex(nextFocus)
  }

  function resetTimer() {
    setSecondsLeft(INITIAL_SECONDS)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length === 6) {
      completeVerification()
      navigate('/dashboard', { replace: true })
    } else {
      const firstEmptyIndex = digits.findIndex((d) => !d)
      inputRefs.current[firstEmptyIndex]?.focus()
    }
  }

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      <header className="w-full py-space-xl flex items-center justify-center">
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <Icon name="layers" className="text-on-primary text-[18px]" />
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">
            StockMeta<span className="text-primary font-bold ml-0.5">AI</span>
          </span>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center px-gutter">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-xl mx-auto my-auto py-space-xl flex flex-col items-center">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-10 right-10 w-72 h-72 bg-tertiary-fixed/30 rounded-full blur-2xl pointer-events-none -z-10" />

            <div className="flex items-center gap-space-xs px-space-md py-1 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm rounded-full mb-space-lg shadow-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-code-xs text-code-xs tracking-wider uppercase text-primary font-semibold">
                Security Step 02/02
              </span>
              <span className="text-outline-variant">/</span>
              <span>Two-Factor Authentication</span>
            </div>

            <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl p-space-xl sm:p-8 flex flex-col">
              <div className="flex items-start justify-between gap-space-md mb-space-lg">
                <div className="flex flex-col">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Enter Verification Code</h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    We sent a 6-digit confirmation code to{' '}
                    <span className="font-code-xs text-code-xs text-on-surface bg-surface-container-low px-1.5 py-0.5 rounded font-medium">
                      {pendingEmail}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="text-primary hover:text-primary-container font-label-sm text-label-sm ml-1 transition-colors underline underline-offset-2"
                    >
                      Edit
                    </button>
                  </p>
                </div>
                <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-lg bg-surface-container-low text-primary shrink-0 shadow-sm">
                  <Icon name="mark_email_read" className="text-[24px]" />
                </div>
              </div>

              <form className="flex flex-col gap-space-xl" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-code-xs text-code-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                      One-Time Security Passcode
                    </span>
                    <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 font-medium">
                      <Icon name="bolt" className="text-[14px]" /> Auto-filling active
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-2 sm:gap-3">
                    {digits.map((digit, index) => (
                      <div
                        key={index}
                        className={`relative flex items-center justify-center h-14 rounded-lg shadow-sm transition-all focus-within:bg-surface-container-lowest focus-within:shadow-md ${
                          focusedIndex === index ? 'bg-surface-container-lowest shadow-md ring-2 ring-primary/30' : 'bg-surface-container-low'
                        }`}
                      >
                        <input
                          ref={(el) => (inputRefs.current[index] = el)}
                          className="otp-box w-full h-full text-center bg-transparent font-code-xs text-[22px] leading-none text-on-surface font-semibold focus:outline-none"
                          inputMode="numeric"
                          maxLength={1}
                          pattern="[0-9]*"
                          type="text"
                          value={digit}
                          onChange={(e) => handleDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          onFocus={() => setFocusedIndex(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-lg">
                  <div className="flex items-center justify-between text-body-xs font-body-xs">
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <Icon name="timer" className="text-[16px] text-tertiary" />
                      <span>Code expires in:</span>
                      <span className="font-code-xs text-code-xs font-semibold text-on-surface">
                        {mins}:{secs}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={secondsLeft > 0}
                      onClick={resetTimer}
                      className="font-label-sm text-label-sm text-primary hover:text-primary-container font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Resend Code
                    </button>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-space-sm">
                  <button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm rounded-lg flex items-center justify-center gap-space-sm shadow-md transition-all active:scale-[0.99]"
                  >
                    <Icon name="lock" filled className="text-[20px]" />
                    <span>Verify &amp; Launch Dashboard</span>
                    <Icon name="arrow_forward" className="text-[20px]" />
                  </button>
                  <div className="flex items-center justify-between px-1 text-on-surface-variant font-label-sm text-label-sm">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={trustDevice}
                        onChange={(e) => setTrustDevice(e.target.checked)}
                        className="rounded w-3.5 h-3.5 accent-primary cursor-pointer"
                      />
                      <span>Trust this machine for 30 days</span>
                    </label>
                    <span className="flex items-center gap-1 text-tertiary">
                      <Icon name="verified_user" className="text-[14px]" /> Max-Privilege
                    </span>
                  </div>
                </div>
              </form>

              <div className="my-space-xl flex flex-col gap-space-sm">
                <div className="flex items-center gap-space-md">
                  <div className="flex-1 h-px bg-surface-container-high" />
                  <span className="font-code-xs text-code-xs uppercase tracking-widest text-outline">Alternative Options</span>
                  <div className="flex-1 h-px bg-surface-container-high" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-xs">
                  <button
                    type="button"
                    className="flex items-center gap-space-sm p-space-sm bg-surface-container-low hover:bg-surface-container text-left rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-sm">
                      <Icon name="key" className="text-[18px]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">Security Key</span>
                      <span className="font-code-xs text-code-xs text-on-surface-variant truncate">FIDO2 / YubiKey</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-space-sm p-space-sm bg-surface-container-low hover:bg-surface-container text-left rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-sm">
                      <Icon name="phonelink_lock" className="text-[18px]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">TOTP App</span>
                      <span className="font-code-xs text-code-xs text-on-surface-variant truncate">Google / 1Password</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/login')
                  }}
                  className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors group"
                >
                  <Icon name="arrow_back" className="text-[16px] group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to sign in with different email</span>
                </a>
              </div>
            </div>

            <div className="mt-space-lg flex flex-col sm:flex-row items-center gap-space-sm text-center sm:text-left px-space-md text-on-surface-variant font-label-sm text-label-sm">
              <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary">
                <Icon name="security" className="text-[15px]" />
              </div>
              <span>256-bit TLS contributor session · High-security microstock pipeline</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-space-xl px-gutter">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-label-sm text-label-sm">
          <div className="flex items-center gap-space-sm">
            <span>© 2025 StockMeta AI Inc.</span>
            <span className="inline-block w-1 h-1 rounded-full bg-outline-variant" />
            <span>Microstock Metadata Engine</span>
          </div>
          <div className="flex items-center gap-space-lg">
            <a className="hover:text-on-surface transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-on-surface transition-colors" href="#">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default VerifyCodePage
