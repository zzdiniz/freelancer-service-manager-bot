export default interface Service{
    id?:number;
    name: string;
    description: string;
    price: number;
    providerId: number;
    faq?:string
}