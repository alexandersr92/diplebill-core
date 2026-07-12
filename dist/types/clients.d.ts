export interface IClient {
    id?: string;
    name: string;
    cedula_ruc?: string | null;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
    has_credit: boolean;
    wholesaler: boolean;
    created_at?: string;
    updated_at?: string;
    stores: string[];
}
export type TClients = IClient[];
export interface ISingleClient {
    id?: string;
    name: string;
    cedula_ruc?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
    address?: string | null;
    country?: string | null;
    has_credit: boolean;
    notes?: string | null;
    organization_id?: string;
    wholesaler: boolean;
    created_at?: string;
    updated_at?: string;
    stores?: string[];
}
export interface IUpdatedClient {
    id?: string;
    name: string;
    cedula_ruc?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    wholesaler: boolean;
    has_credit: boolean;
    notes?: string | null;
}
export interface IAddClient {
    name: string;
    cedula_ruc?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    wholesaler: boolean;
    organization_id: string;
    notes?: string | null;
    stores: string[];
}
