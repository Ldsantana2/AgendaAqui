export interface OwnerPatient {
    filter(arg0: (patient: any) => any): OwnerPatient;
    sort(arg0: (a: any, b: any) => number): unknown;
    length: any;
    slice(startIndex: number, endIndex: number): unknown;
    patientId: string;
    gender: string;
    birthDay: Date;
    cpf: string;
    healthPlan: string
    healthPlanId: string
    healthOperatorId: string,
    patientName: string;
    photo: string;
    age: number | null;
    address: {
        [x: string]: any;
        cep?: string | null;
        street?: string | null;
        number?: string | null;
        city?: string | null;
        state?: string;
        complement?: string;
    };
    lastAppointment: Date;
    totalAppointments: number;
    contactInfo: {
        phone?: string;
        email?: string;
    };
    hasAnamnesis: boolean;
    hasExams: boolean;
    hasRequests: boolean;
    medicalHistory: {
        pastDiseases: string;
        chronicDiseases: string;
        familySeriousDiseases: string;
        allergies: string;
    };
    medications: {
        currentMedications: string[];
        pastMedications: string[];
    };
}