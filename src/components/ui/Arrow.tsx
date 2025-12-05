interface ArrowProps {
  size?: number;
  className?: string;
}

export function Arrow({ size = 24, className }: ArrowProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="Up-Right-2-Short-Arrow--Streamline-Guidance-Free"
      height={size}
      width={size}
      className={className}
    >
      <desc>
        {
          "\n    Up Right 2 Short Arrow Streamline Icon: https://streamlinehq.com\n  "
        }
      </desc>
      <path
        stroke="currentColor"
        d="M20.991 3.009 3.001 21m16.93 -2.081c-0.786 -0.786 -1.183 -2.737 -1.382 -4.51 -0.258 -2.282 -0.159 -4.6 0.381 -6.834 0.404 -1.673 1.056 -3.543 2.07 -4.557M5.081 4.07c0.786 0.785 2.737 1.182 4.51 1.381 2.282 0.258 4.6 0.159 6.834 -0.381 1.673 -0.404 3.543 -1.056 4.557 -2.07"
        strokeWidth={1}
      />
    </svg>
  );
}
