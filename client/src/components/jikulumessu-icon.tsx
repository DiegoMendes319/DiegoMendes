interface JikulumessuIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function JikulumessuIcon({ className = "", size = 'md' }: JikulumessuIconProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10",
    xl: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 40 40"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Face outline - circular */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="var(--angola-red)"
          className="text-gray-800 dark:text-gray-200"
        />
        
        {/* Eye (representing "opening the eye") */}
        <ellipse
          cx="20"
          cy="18"
          rx="12"
          ry="6"
          fill="white"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gray-800 dark:text-gray-200"
        />
        
        {/* Iris */}
        <circle
          cx="20"
          cy="18"
          r="4"
          fill="var(--angola-black)"
        />
        
        {/* Pupil */}
        <circle
          cx="20"
          cy="18"
          r="2"
          fill="black"
        />
        
        {/* Highlight in eye (alert/awareness) */}
        <circle
          cx="21"
          cy="17"
          r="0.8"
          fill="white"
        />
        
        {/* Eyebrow (showing alertness) */}
        <path
          d="M10 12 Q15 10 20 10 Q25 10 30 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          className="text-gray-800 dark:text-gray-200"
        />
        
        {/* Small mouth (neutral but alert expression) */}
        <path
          d="M16 28 Q20 30 24 28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          className="text-gray-800 dark:text-gray-200"
        />
      </svg>
    </div>
  );
}