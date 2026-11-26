function Avatar({ email, className = '' }) {
  const initial = email ? email.charAt(0).toUpperCase() : '?'
  return (
    <div
      className={`rounded-full bg-primary-container text-on-primary flex items-center justify-center font-semibold shrink-0 ${className}`}
    >
      {initial}
    </div>
  )
}

export default Avatar
