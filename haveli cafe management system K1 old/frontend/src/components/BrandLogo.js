import React from "react";

function BrandLogo({ compact = false, className = "" }) {
  const imageSize = compact ? "h-16 w-16" : "h-20 w-20";

  return (
    <div className={className}>
      <img
        src="/logo.png"
        alt="Haveli Cafe logo"
        className={`${imageSize} shrink-0 object-contain`}
      />
    </div>
  );
}

export default BrandLogo;
