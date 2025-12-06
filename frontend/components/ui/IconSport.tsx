// components/IconSport.tsx
interface IconSportProps {
  sport: "cycling" | "swimming" | "running";
  className?: string;
  size?: number;
  color?: string;
}

export default function IconSport({
  sport,
  className = "",
  size = 24,
  color = "currentColor",
}: IconSportProps) {
  const icons: Record<string, string> = {
    cycling: "icons/cycling.svg",
    swimming: "icons/swimming.svg",
    running: "icons/running.svg",
  };

  return (
    <div className="bg-neutral-700 flex p-4 rounded-full w-max h-max">
      <div
        className={className}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          mask: `url(${icons[sport]}) no-repeat center / contain`,
          WebkitMask: `url(${icons[sport]}) no-repeat center / contain`,
        }}
      />
    </div>
  );
}
