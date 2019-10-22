export class GeneseConfig {
    api: string;
    extract?: string;
    pagination?: {
        limit: string,
        page: string
    } = {
        page: 'gnPage',
        limit: 'gnLimit'
    };
}
