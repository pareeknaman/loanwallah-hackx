export function CubeGraphic() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute opacity-5">
      <defs>
        <path id="cube" d="M0 10 L30 0 L60 10 L30 20 Z M30 20 L30 50 L60 40 L60 10" stroke="#FFFFFF" strokeWidth="1" fill="none" />
        
        <pattern id="cube-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <use href="#cube" x="0" y="0" />
          <use href="#cube" x="30" y="30" />
        </pattern>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#cube-pattern)" />
    </svg>
  );
}

