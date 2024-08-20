export default interface Appointment{
    id?: number;
    datetime: string;
    status: 'done' | 'canceled' | 'scheduled' | 'unavailable'
    providerId: number;
    serviceId: number;
    clientId?: number;
}