import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/common/Icon'
import { useAuth } from '../context/AuthContext'

const INITIAL_SECONDS = 300
const START_SECONDS = INITIAL_SECONDS

function VerifyCodePage() {
  const { pendingEmail, verifyOtp, resendOtp } = useAuth()
  const navigate = useNavigate()
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS)
  const [resendAgain, setResendAgain] = useState(0)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [secondsLeft])

  useEffect(() => {
    if (resendAgain <= 0) return
    const interval = setInterval(() => {
      setResendAgain((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [resendAgain])

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')
  const progressPct = Math.max(0, (secondsLeft / INITIAL_SECONDS) * 100)

  function handleDigitChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    setError('')
    if (digit && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    if (next.every((d) => d) && !isVerifying) {
      verifyCode(next.join(''))
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
    setError('')
    const nextFocus = Math.min(data.length, 5)
    inputRefs.current[nextFocus]?.focus()
    setFocusedIndex(nextFocus)
    if (next.every((d) => d) && !isVerifying) {
      verifyCode(next.join(''))
    }
  }

  async function handleResend() {
    try {
      await resendOtp()
      setSecondsLeft(INITIAL_SECONDS)
      setResendAgain(60)
      setError('')
    } catch (err) {
      setError(err.message || 'Please wait before requesting a new code.')
    }
  }

  async function verifyCode(code) {
    setIsVerifying(true)
    try {
      await verifyOtp(code)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid code.')
      setDigits(['', '', '', '', '', ''])
      setFocusedIndex(0)
      inputRefs.current[0]?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length === 6) {
      verifyCode(code)
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
                          error
                            ? 'bg-error-container ring-2 ring-error/40'
                            : focusedIndex === index
                              ? 'bg-surface-container-lowest shadow-md ring-2 ring-primary/30'
                              : 'bg-surface-container-low'
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
                          disabled={isVerifying}
                          onChange={(e) => handleDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          onFocus={() => setFocusedIndex(index)}
                        />
                      </div>
                    ))}
                  </div>
                  {error && (
                    <p className="flex items-center gap-1.5 font-label-sm text-label-sm text-error">
                      <Icon name="error" className="text-[16px]" />
                      {error}
                    </p>
                  )}
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
                      disabled={resendAgain > 0}
                      onClick={handleResend}
                      className="font-label-sm text-label-sm text-primary hover:text-primary-container font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {resendAgain > 0 ? `Resend Code (${resendAgain}s)` : 'Resend Code'}
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
                    disabled={isVerifying}
                    className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm rounded-lg flex items-center justify-center gap-space-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Icon name="lock" filled className="text-[20px]" />
                    <span>{isVerifying ? 'Verifying' : 'Verify'}</span>
                    {isVerifying ? (
                      <Icon name="progress_activity" className="text-[18px] animate-spin" />
                    ) : (
                      <Icon name="arrow_forward" className="text-[20px]" />
                    )}
                  </button>
                  <div className="flex items-center justify-end px-1 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="flex items-center gap-1 text-tertiary">
                      <Icon name="verified_user" className="text-[14px]" /> Max-Privilege
                    </span>
                  </div>
                </div>
              </form>


              <div className="flex items-center justify-center mt-4">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/login')
                  }}
                  className="flex items-center gap-space-sm p-space-md bg-surface-container-low hover:bg-surface-container text-left rounded-xl transition-colors group"
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
