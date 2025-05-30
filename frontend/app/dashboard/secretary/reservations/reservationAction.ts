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
            const res = await fetch('http://localhost:3001/api/reservations/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            if (res.ok) {
                removeAction(action.id);
                notify('La réservation a été acceptée et créée.');
            } else {
                throw new Error('Erreur lors de la création de la réservation');
            }
        } catch (e) {
            notify('Erreur lors de la création de la réservation.');
        }
    }

    /**
     * Récupérer toutes les réservations (hors pending) pour une secrétaire donnée
     * @param secretaryId string - l'id de la secrétaire
     */
    static async fetchAllConfirmed(secretaryId: string): Promise<any[]> {
        try {
            const res = await fetch(`http://localhost:3001/api/reservations`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: secretaryId })
            });
            if (!res.ok) throw new Error('Erreur lors de la récupération des réservations confirmées');
            return await res.json();
        } catch (e) {
            console.error("Erreur dans fetchAllConfirmed:", e);
            return [];
        }
    }

    /**
     * Récupérer les réservations en attente (pending) pour une secrétaire
     * @param secretaryId string - l'id de la secrétaire
     */
    static async fetchPending(secretaryId: string): Promise<ReservationAction[]> {
        try {
            console.log("Fetching pending reservations for secretary:", secretaryId);
            const res = await fetch(`http://localhost:3001/api/reservations/pending/list`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: secretaryId })
            });
            if (!res.ok) throw new Error('Erreur lors de la récupération des réservations en attente');
            const data = await res.json();
            console.log("Received pending reservations:", data);
            return data.map((item: any) => new ReservationAction(
                item.id,
                item.date || item.startDate, // Compatibilité avec différentes structures
                item.time || "Full Day", // Valeur par défaut si non fourni
                item.type || 'Employé',
                item.vehicle || '',
                item.description || '',
                'pending'
            ));
        } catch (e) {
            console.error("Erreur dans fetchPending:", e);
            return [];
        }
    }

    static async create(reservationData: any): Promise<any> {
        try {
            const res = await fetch('http://localhost:3001/api/reservations/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(reservationData)
            });
            return await res.json();
        } catch (e) {
            return null;
        }
    }

    // Faire une demande de réservation (pending)
    static async request(reservationData: any): Promise<any> {
        try {
            const res = await fetch('http://localhost:3001/api/reservations/request', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(reservationData)
            });
            return await res.json();
        } catch (e) {
            return null;
        }
    }

    // Check-in d'une réservation
    static async checkIn(spotId: string): Promise<boolean> {
        try {
            const res = await fetch(`http://localhost:3001/api/reservations/checkin/${spotId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    }

    // Récupérer les réservations d'un utilisateur
    static async fetchByUser(userId: string): Promise<any[]> {
        try {
            const res = await fetch(`http://localhost:3001/api/reservations/user/${userId}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            if (!res.ok) throw new Error('Erreur lors de la récupération des réservations utilisateur');
            return await res.json();
        } catch (e) {
            return [];
        }
    }

    // Annuler une réservation
    static async cancel(id: string): Promise<boolean> {
        try {
            const res = await fetch(`http://localhost:3001/api/reservations/cancel/${id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    }

    // Refuser une réservation
    static async refuse(id: string, userId: string): Promise<boolean> {
        try {
            const res = await fetch('http://localhost:3001/api/reservations/refuse', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id, userId })
            });
            return res.ok;
        } catch (e) {
            return false;
        }
    }

    // Modifier une réservation
    static async update(id: string, updatedData: any): Promise<any> {
        try {
            const res = await fetch(`http://localhost:3001/api/reservations/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedData)
            });
            return await res.json();
        } catch (e) {
            return null;
        }
    }
}
