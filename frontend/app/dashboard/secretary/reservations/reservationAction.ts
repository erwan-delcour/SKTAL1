export class ReservationAction {
    constructor(
        public id: string,
        public date: string,
        public time: string,
        public type: string,
        public vehicle: string,
        public description: string,
        public status: string
    ) {
    }

    static async acceptWithSpot(pendingReservationId: string) {
        console.log("Accepting reservation with body:", pendingReservationId);
        if (!pendingReservationId) {
            return false;
        }

        const body = {
            pendingReservationId: pendingReservationId,
        };
        try {
            console.log("Accepting reservation with body:", body);
            const res = await fetch('http://localhost:3001/api/reservations/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            if (res.ok) {
                console.log("Reservation created successfully.");
                return true;
            } else {
                const errorData = await res.json().catch(() => null);
                console.error("Error response:", errorData);
                throw new Error('Erreur lors de la création de la réservation');
            }
        } catch (e) {
            console.error("Error accepting reservation:", e);
            return false;
        }
    }

    /**
     * Récupérer toutes les réservations (hors pending) pour une secrétaire donnée
     * @param secretaryId string - l'id de la secrétaire
     */
    static async fetchAllConfirmed(secretaryId: string): Promise<any[]> {
        try {
            console.log("Fetching all confirmed reservations for secretary:", secretaryId);
            const res = await fetch(`http://localhost:3001/api/reservations/${secretaryId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId: secretaryId})
            });
            if (!res.ok) {
                return [];
            }
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
                body: JSON.stringify({userId: secretaryId})
            });
            if (!res.ok){
                return [];
            }
            const data = await res.json();
            console.log("Received pending reservations:", data);

            // Vérification des IDs dans les données reçues
            const validItems = data.filter((item: any) => {
                if (!item.id) {
                    console.warn("Réservation en attente sans ID détectée:", item);
                    return false;
                }
                return true;
            });

            return validItems.map((item: any) => new ReservationAction(
                item.id,
                item.date || item.startDate,
                item.time || "Full Day",
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
                method: 'DELETE',
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
                body: JSON.stringify({id, userId})
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
