export interface IPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface ITag {
    id?: string;
    title?: string;
}
