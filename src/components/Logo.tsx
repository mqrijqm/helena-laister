// Originalni znak: tri tanka, blago pomerena prstena — "dah" koji se širi.
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={`animate-[spin_24s_linear_infinite] ${className}`}
    >
      <ellipse cx="20" cy="20" rx="15" ry="15.6" stroke="currentColor" strokeWidth="1.1" />
      <ellipse cx="20.6" cy="19.6" rx="14.2" ry="15" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
      <ellipse cx="19.4" cy="20.4" rx="15.4" ry="14.4" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    </svg>
  )
}
