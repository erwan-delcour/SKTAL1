export class ReservationAction {
    constructor(
        public id: number,
        public date: string,
        public time: string,
        public type: string,
        public vehicle: string,
        public description: string,
        public status: string
    ) {
    }

    // Action: Supprimer la demande
    static remove(actionList: ReservationAction[], id: number): ReservationAction[] {
        // Simule la suppression en retirant la demande de la liste
        return actionList.filter(action => action.id !== id);
    }

    // Action: Accepter la demande et créer la réservation via l'API
    static async acceptWithSpot(
        action: ReservationAction,
        spot: { id: string; isAvailable: boolean; hasCharger: boolean; row: string; spotNumber: string },
        userId: string,
        removeAction: (id: number) => void,
        notify: (msg: string) => void
    ) {
        const body = {
            userId: userId,
            spot: {
                id: spot.id,
                isAvailable: spot.isAvailable,
                hasCharger: spot.hasCharger,
                row: spot.row,
                spotNumber: spot.spotNumber
            },
            pendingReservationId: action.id,
            needsCharger: spot.hasCharger,
            startDate: action.date,
            endDate: action.date
        };
        try {
            console.log("We are right here with body:", body);
            // const res = await fetch('/reservation/create', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify(body)
            // });
            let res = 1;
            if (res == 1) {
                removeAction(action.id);
                notify('La réservation a été acceptée et créée.');
            } else {
                throw new Error('Erreur lors de la création de la réservation');
            }
        } catch (e) {
            notify('Erreur lors de la création de la réservation.');
        }
    }

    // Action: Récupérer les réservations en attente (pending) via l'API
    static async fetchPending(): Promise<any[]> {
        try {
            const res = await fetch('/reservation/request', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            if (!res.ok) throw new Error('Erreur lors de la récupération des réservations en attente');
            return await res.json();
        } catch (e) {
            return [];
        }
    }

    // Action: Récupérer toutes les réservations (sauf pending) via l'API
    static async fetchAllConfirmed(): Promise<any[]> {
        try {
            const res = await fetch('/reservation/getReservations', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            if (!res.ok) throw new Error('Erreur lors de la récupération des réservations confirmées');
            return await res.json();
        } catch (e) {
            return [];
        }
    }
}
