
type Patient = {
    id?: string;
    name?: string;
    age?: number;
    address?: string;
};

type doctor = {
    id: string;
    name: string;
    specialty: string;
};

type Record = {
    id: string;
    date: string;
    size: number;
    patientId: string;
    doctorId: string;
};

type Summary = {
    id: string;
    recordId: string;
    patientId: string;
    doctorId: string;
    summaryText: string;
}

type RequestInfo = {
    ip: string;
    requestCount:number;
    time:number;
}

export {
    type Patient,
    type doctor,
    type Record,
    type Summary,
    type RequestInfo
};