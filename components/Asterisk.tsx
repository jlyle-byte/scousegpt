export default function Asterisk({
  size = 42,
  color = "#f0e8d0",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2 L13 10 L21 8 L14 12 L21 16 L13 14 L12 22 L11 14 L3 16 L10 12 L3 8 L11 10 Z"
        fill={color}
      />
    </svg>
  );
}
