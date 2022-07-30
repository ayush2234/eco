export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: string;
    tags?: string[];
}

export interface UserPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface UserTag {
    id?: string;
    title?: string;
}
