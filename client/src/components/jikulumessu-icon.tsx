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
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft red circular background */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#F56565"
          opacity="0.9"
        />
        
        {/* Person's head */}
        <circle
          cx="50"
          cy="40"
          r="20"
          fill="#C17A47"
        />
        
        {/* Hair */}
        <path
          d="M30 28 Q35 20 42 22 Q50 18 58 22 Q65 20 70 28 Q70 35 65 40 Q58 38 50 40 Q42 38 35 40 Q30 35 30 28 Z"
          fill="#2D1B11"
        />
        
        {/* Left eye (winking) */}
        <path
          d="M40 37 Q43 35 46 37"
          stroke="#2D1B11"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Right eye (open and alert) */}
        <circle
          cx="56"
          cy="37"
          r="4"
          fill="white"
        />
        <circle
          cx="56"
          cy="37"
          r="2.5"
          fill="#654321"
        />
        <circle
          cx="56"
          cy="36"
          r="1"
          fill="white"
        />
        
        {/* Eyebrows */}
        <path
          d="M38 32 Q43 30 46 32"
          stroke="#2D1B11"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M52 32 Q56 30 60 32"
          stroke="#2D1B11"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Nose */}
        <ellipse
          cx="50"
          cy="42"
          rx="2"
          ry="3"
          fill="#A66A3A"
        />
        
        {/* Mouth (smiling) */}
        <path
          d="M45 48 Q50 53 55 48"
          stroke="#2D1B11"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <rect
          x="47"
          y="48"
          width="6"
          height="3"
          rx="1"
          fill="white"
        />
        
        {/* Pointing finger */}
        <rect
          x="30"
          y="33"
          width="18"
          height="4"
          rx="2"
          fill="#C17A47"
        />
        <circle
          cx="30"
          cy="35"
          r="3"
          fill="#C17A47"
        />
        
        {/* Body/shirt */}
        <rect
          x="42"
          y="58"
          width="16"
          height="25"
          rx="8"
          fill="#8B4513"
        />
        
        {/* Ears */}
        <circle
          cx="32"
          cy="40"
          r="3"
          fill="#C17A47"
        />
        <circle
          cx="68"
          cy="40"
          r="3"
          fill="#C17A47"
        />
      </svg>
    </div>
  );
}