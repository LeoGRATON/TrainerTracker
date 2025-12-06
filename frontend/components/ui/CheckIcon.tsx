import React from "react";

interface CheckIconProps {
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  isActive,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        w-6 h-6
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        ${isActive ? "bg-accent-500" : "bg-neutral-400 border-neutral-600"}
        ${className}
      `}
    >
      {isActive && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-800"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  );
};
