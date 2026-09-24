export type Review = {
    id: string;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
    patient_id: string;
    clinic_id: string;
    appointmentId: string;
    Patient: User;
};