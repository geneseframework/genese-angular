
export interface GnRequest {
    gnPage?: number;
    gnLimit?: number;
    gnSort?: string;
    gnOrder?: 'asc' | 'desc';
    gnCustomMapper?: boolean;
    gnFilters?: {
        [key: string]: string
    };
    gnPath?: string;
    gnExtract?: {
        [key: string]: any
    };
}

export interface GetAllResponse<T> {
    totalResults?: number;
    results: T[];
}
