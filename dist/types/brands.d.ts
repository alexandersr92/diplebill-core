export interface IBrand {
    id: string;
    name: string;
    organization_id?: string;
    slug?: string;
    status?: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    products_count?: number;
}
export interface ICreateBrandPayload {
    name: string;
    status?: 'active' | 'inactive';
}
export interface IUpdateBrandPayload {
    name?: string;
    status?: 'active' | 'inactive';
}
