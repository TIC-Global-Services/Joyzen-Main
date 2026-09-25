import type { HTMLAttributes, ReactNode } from "react"

export interface IpadProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string
  height?: number | string
  src?: string
  children?: ReactNode
}

export function Ipad({
  width = 520,
  height = 400,
  src,
  children,
  className = "",
  style,
  ...props
}: IpadProps) {
  const widthStyle = typeof width === "number" ? `${width}px` : width

  return (
    <div
      className={`relative w-full aspect-[520/400] select-none ${className}`}
      style={{
        maxWidth: widthStyle && widthStyle !== "100%" ? widthStyle : undefined,
        ...style,
      }}
      {...props}
    >
      {/* iPad Frame Graphic */}
      <svg
        viewBox="0 0 520 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block pointer-events-none"
        aria-hidden="true"
      >
        <path
          fill="#aaabac"
          d="M479.04,14.14H88.14v-.59c0-.16-.13-.3-.3-.3h-16.7c-.16,0-.3.13-.3.3v.59h-3.46v-.59c0-.16-.13-.3-.3-.3h-16.7c-.16,0-.3.13-.3.3v.59h-9.13c-13.4,0-24.27,10.78-24.45,24.14h-.48c-.16,0-.3.13-.3.3v20.07c0,.16.13.3.3.3h.47v303.38c0,13.51,10.95,24.45,24.45,24.45h438.08c13.51,0,24.45-10.95,24.45-24.45V38.6c0-13.51-10.95-24.45-24.45-24.45Z"
        />
        <rect
          fill="#000"
          x="18.58"
          y="15.94"
          width="482.84"
          height="368.91"
          rx="23.29"
          ry="23.29"
        />
        <rect
          fill="#ffffff"
          x="31.37"
          y="28.47"
          width="457.25"
          height="342.87"
          rx="9.61"
          ry="9.61"
        />
        <circle fill="#0a1054" cx="245.1" cy="22.23" r="2.44" />
        <circle fill="#333" cx="274.98" cy="22.23" r=".88" />
      </svg>

      {/* Screen Container with iOS Safari hardware-acceleration clipping fixes */}
      <div
        className="absolute overflow-hidden bg-white"
        style={{
          left: "6.033%",
          top: "7.118%",
          width: "87.933%",
          height: "85.718%",
          borderRadius: "2.102% / 2.803%",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          maskImage: "radial-gradient(white, black)",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          isolation: "isolate",
        }}
      >
        {src && (
          <img
            src={src}
            alt="iPad screen"
            className="w-full h-full object-cover"
          />
        )}
        {children}
      </div>
    </div>
  )
}