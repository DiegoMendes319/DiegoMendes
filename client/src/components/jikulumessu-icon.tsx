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
        {/* Face outline - generic emoji style */}
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="#FFDD44"
          stroke="#E6B800"
          strokeWidth="1.5"
        />
        
        {/* Left eye (normal) */}
        <circle
          cx="15"
          cy="17"
          r="2"
          fill="black"
        />
        
        {/* Right eye being "opened" - larger to show alertness */}
        <ellipse
          cx="25"
          cy="17"
          rx="3"
          ry="2.5"
          fill="white"
          stroke="black"
          strokeWidth="1"
        />
        
        {/* Right eye pupil */}
        <circle
          cx="25"
          cy="17"
          r="1.5"
          fill="black"
        />
        
        {/* Eye highlight */}
        <circle
          cx="25.5"
          cy="16.5"
          r="0.5"
          fill="white"
        />
        
        {/* Mouth - slightly smiling */}
        <path
          d="M16 25 Q20 28 24 25"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Hand/finger pointing to eye - "abre o olho" gesture */}
        <path
          d="M30 14 L33 16 L32 17.5 L29 15.5 Z"
          fill="#FFDD44"
          stroke="#E6B800"
          strokeWidth="1"
        />
        
        {/* Fingertip */}
        <circle
          cx="30"
          cy="14"
          r="1.2"
          fill="#FFCC00"
          stroke="#E6B800"
          strokeWidth="0.5"
        />
        
        {/* Simple eyebrow over opened eye to show alertness */}
        <path
          d="M22 13 Q25 12 28 13"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}