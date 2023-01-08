/* 响应体 */
export interface IResponse {
    code: number;
    msg: string;
    data: object | null;
}

// /api/notebook/lsNotebooks

export interface Notebook {
    id: string;
    name: string;
    icon: string;
    sort: number;
    closed: boolean;
}

export interface Data_lsNotebooks {
    notebooks: Notebook[];
}

export interface IResponse_lsNotebooks {
    code: number;
    msg: string;
    data: Data;
}