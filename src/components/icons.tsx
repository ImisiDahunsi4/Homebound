/* Minimal inline stroke icons — match the rounded hand-drawn feel.
   Decorative only; keep aria-hidden and pair with visible labels. */

type IconProps = { size?: number; className?: string };

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
});

export function MenuIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ReportIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M12 17s-2.5-1.8-2.5-3.6a1.4 1.4 0 0 1 2.5-.9 1.4 1.4 0 0 1 2.5.9c0 1.8-2.5 3.6-2.5 3.6z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AlertIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10 19a2.2 2.2 0 0 0 4 0" />
    </svg>
  );
}

export function ReuniteIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M4 20c0-3 2-5 4.5-5h7c2.5 0 4.5 2 4.5 5" />
      <path d="M12 12.6s-1.7-1.2-1.7-2.4a1 1 0 0 1 1.7-.6 1 1 0 0 1 1.7.6c0 1.2-1.7 2.4-1.7 2.4z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PawIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <ellipse cx="12" cy="15.5" rx="3.4" ry="2.8" />
      <ellipse cx="6.5" cy="10" rx="1.7" ry="2.1" />
      <ellipse cx="17.5" cy="10" rx="1.7" ry="2.1" />
      <ellipse cx="9.5" cy="6.4" rx="1.7" ry="2.1" />
      <ellipse cx="14.5" cy="6.4" rx="1.7" ry="2.1" />
    </svg>
  );
}
