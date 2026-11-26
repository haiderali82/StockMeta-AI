function Icon({ name, className = '', filled = false, style, ...props }) {
  const mergedStyle = filled ? { fontVariationSettings: "'FILL' 1", ...style } : style
  return (
    <span className={`material-symbols-outlined ${className}`} style={mergedStyle} {...props}>
      {name}
    </span>
  )
}

export default Icon
