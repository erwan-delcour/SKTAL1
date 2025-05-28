"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Calendar, Car, Zap} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {useToast} from "@/hooks/useToast";

interface Reservation {
    id: number
    date: string
    spot: string
    time: string
    isElectric: boolean
}

interface ReservationsListProps {
    reservations: Reservation[]
    onReservationCancelled: (id: number) => void
}

export function ReservationsList({reservations, onReservationCancelled}: ReservationsListProps) {
    const {toast} = useToast()
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
    const [reservationToCancel, setReservationToCancel] = useState<number | null>(null)

    const handleCancelClick = (reservationId: number) => {
        setReservationToCancel(reservationId)
        setCancelDialogOpen(true)
    }

    const confirmCancellation = () => {
        if (reservationToCancel !== null) {
            // In a real app, this would make an API call to cancel the reservation
            onReservationCancelled(reservationToCancel)

            // Show success toast
            // toast({
            //     title: "Reservation cancelled",
            //     description: "Your parking reservation has been successfully cancelled.",
            // })

            // Close the dialog
            setCancelDialogOpen(false)
            setReservationToCancel(null)
        }
    }

    return (
        <div className="space-y-4">
            {reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-2"/>
                    <h3 className="text-lg font-medium">No reservations</h3>
                    <p className="text-sm text-muted-foreground">You don&apos;t have any upcoming reservations.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reservations.map((reservation) => (
                        <div key={reservation.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Car className="h-5 w-5 text-primary"/>
                                    <span className="font-medium">Spot {reservation.spot}</span>
                                    {reservation.isElectric && <Zap className="h-4 w-4 text-yellow-500"/>}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-destructive hover:text-destructive"
                                    onClick={() => handleCancelClick(reservation.id)}
                                >
                                    Cancel
                                </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p>{reservation.date}</p>
                                <p>{reservation.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Reservation</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this parking reservation? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                            Keep Reservation
                        </Button>
                        <Button variant="destructive" onClick={confirmCancellation}>
                            Yes, Cancel Reservation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
