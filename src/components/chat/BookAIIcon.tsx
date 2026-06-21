interface Props {
  className?: string;
}

/**
 * The FindGrinds book logo (exact lucide `BookOpen`, matching the header) with
 * "A" on the left page and "I" on the right page — i.e. "AI". Uses currentColor
 * so it renders white on the green launcher, just like the header logo.
 */
export function BookAIIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* lucide-react v0.563 BookOpen — identical to the site header logo */}
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      {/* "AI" — one letter per page */}
      <text
        x="7"
        y="11"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="6.5"
        fontWeight="700"
        fontFamily="inherit"
        stroke="none"
        fill="currentColor"
      >
        A
      </text>
      <text
        x="17"
        y="11"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="6.5"
        fontWeight="700"
        fontFamily="inherit"
        stroke="none"
        fill="currentColor"
      >
        I
      </text>
    </svg>
  );
}
