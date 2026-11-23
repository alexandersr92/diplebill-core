export interface ICategory {
  id: string;
  name: string;
  organization_id?: string;
  slug?: string;
  parent_id?: string | null;
  level?: number;
  sort_order?: number;
  status?: 'active' | 'inactive';
  full_path?: string;
  created_at?: string;
  updated_at?: string;
  products_count?: number;
  children_count?: number;
}

export interface ICategoryNode extends ICategory {
  children?: ICategoryNode[];
}

export interface ICreateCategoryPayload {
  name: string;
  parent_id?: string | null;
  sort_order?: number;
  status?: 'active' | 'inactive';
}

export interface IUpdateCategoryPayload {
  name?: string;
  parent_id?: string | null;
  sort_order?: number;
  status?: 'active' | 'inactive';
}
