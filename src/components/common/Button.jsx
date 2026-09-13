const variants = {
  primary: 'btn',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button type={type} className={`${variants[variant] || variants.primary} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
