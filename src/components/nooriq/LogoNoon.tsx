"use client"

export default function LogoNoon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="NoorIQ Logo - Stylized Noon"
    >
      <circle cx="32" cy="32" r="32" fill="#2E7D32" />
      <path
        d="M20 40 C24 30, 40 30, 44 40"
        stroke="#FAFAFA"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="24" r="6" fill="#FAFAFA" />
    </svg>
  )
}
