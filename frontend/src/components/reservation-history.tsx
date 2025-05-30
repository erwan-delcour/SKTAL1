"use client"

import { Calendar } from "lucide-react"

interface HistoryItem {
  id: number
  date: string
  spot: string
  status: "Completed" | "No Show" | "Cancelled"
}

interface ReservationHistoryProps {
  history: HistoryItem[]
}

export function ReservationHistory({ history }: ReservationHistoryProps) {
  return (
    <div className="space-y-4">
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No history</h3>
          <p className="text-sm text-muted-foreground">Your reservation history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{item.date}</p>
                <p className="text-sm text-muted-foreground">Spot {item.spot}</p>
              </div>
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    item.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : item.status === "Cancelled"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
