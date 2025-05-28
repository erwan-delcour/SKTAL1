import type React from "react"
import { cn } from "@/lib/utils"

interface ParkingLayoutProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function ParkingLayout({ className, ...props }: ParkingLayoutProps) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto", className)}
      {...props}
    >
      <rect width="600" height="400" rx="8" fill="#f1f5f9" />

      {/* Row labels */}
      <text x="20" y="50" fill="#0f172a" fontSize="16" fontWeight="bold">
        A
      </text>
      <text x="20" y="110" fill="#0f172a" fontSize="16" fontWeight="bold">
        B
      </text>
      <text x="20" y="170" fill="#0f172a" fontSize="16" fontWeight="bold">
        C
      </text>
      <text x="20" y="230" fill="#0f172a" fontSize="16" fontWeight="bold">
        D
      </text>
      <text x="20" y="290" fill="#0f172a" fontSize="16" fontWeight="bold">
        E
      </text>
      <text x="20" y="350" fill="#0f172a" fontSize="16" fontWeight="bold">
        F
      </text>

      {/* Row A - Electric */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={`A${i + 1}`}>
          <rect x={50 + i * 50} y="20" width="40" height="30" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          <text x={70 + i * 50} y="40" fill="#1e40af" fontSize="12" textAnchor="middle">
            A{(i + 1).toString().padStart(2, "0")}
          </text>
        </g>
      ))}

      {/* Row B */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={`B${i + 1}`}>
          <rect x={50 + i * 50} y="80" width="40" height="30" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          <text x={70 + i * 50} y="100" fill="#334155" fontSize="12" textAnchor="middle">
            B{(i + 1).toString().padStart(2, "0")}
          </text>
        </g>
      ))}

      {/* Row C */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={`C${i + 1}`}>
          <rect x={50 + i * 50} y="140" width="40" height="30" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          <text x={70 + i * 50} y="160" fill="#334155" fontSize="12" textAnchor="middle">
            C{(i + 1).toString().padStart(2, "0")}
          </text>
        </g>
      ))}

      {/* Row D */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={`D${i + 1}`}>
          <rect x={50 + i * 50} y="200" width="40" height="30" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          <text x={70 + i * 50} y="220" fill="#334155" fontSize="12" textAnchor="middle">
            D{(i + 1).toString().padStart(2, "0")}
          </text>
        </g>
      ))}

      {/* Row E */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={`E${i + 1}`}>
          <rect x={50 + i * 50} y="260" width="40" height="30" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          <text x={70 + i * 50} y="280" fill="#334155" fontSize="12" textAnchor="middle">
            E{(i + 1).toString().padStart(2, "0")}
          </text>
        </g>
      ))}

      {/* Row F - Electric */}
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={`F${i + 1}`}>
          <rect x={50 + i * 50} y="320" width="40" height="30" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
          <text x={70 + i * 50} y="340" fill="#1e40af" fontSize="12" textAnchor="middle">
            F{(i + 1).toString().padStart(2, "0")}
          </text>
        </g>
      ))}

      {/* Legend */}
      <rect x="50" y="370" width="15" height="15" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
      <text x="75" y="382" fill="#0f172a" fontSize="12">
        Electric Charging Spots
      </text>

      <rect x="250" y="370" width="15" height="15" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
      <text x="275" y="382" fill="#0f172a" fontSize="12">
        Standard Parking Spots
      </text>
    </svg>
  )
}
