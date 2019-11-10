
export interface GnRequestParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    filters?: {
        [key: string]: string
    };
    path?: string;
    extract?: {
        [key: string]: any
    };
}

export interface GetAllResponse<T> {
    totalResults?: number;
    results: T[];
}
