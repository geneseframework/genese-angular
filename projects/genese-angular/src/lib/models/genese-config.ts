export class GeneseConfig {
    api: string;
    extract?: 'gnExtract';
    pagination?: {
        limit: string,
        page: string
    } = {
        page: 'gnPage',
        limit: 'gnLimit'
    };
}
