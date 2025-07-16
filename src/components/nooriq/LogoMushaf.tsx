"use client"

export default function LogoMushaf({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="NoorIQ Logo - Open Mushaf Shape"
    >
      <rect x="8" y="8" width="48" height="48" rx="8" fill="#2E7D32" />
      <path
        d="M16 16H48V48H16V16Z"
        stroke="#FAFAFA"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 24H40V40H24V24Z"
        stroke="#FAFAFA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="24" y1="32" x2="40" y2="32" stroke="#FAFAFA" strokeWidth="1.5" />
      <line x1="32" y1="24" x2="32" y2="40" stroke="#FAFAFA" strokeWidth="1.5" />
    </svg>
  )
}
