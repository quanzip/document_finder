export enum RESPONSE_STATUS {
    error = 'error', failure = 'failure', success = 'success'
}

export interface Response<T> {
    data: T
    error: number
    status: RESPONSE_STATUS
    path: string
    message: string
    page_size: number
    request_id: string
    timestamp: number
}

export interface CbResponse<T> {
    data: T;
    auth_token: string;
    status: string;
    message: string;
    error: string;
    request_id: any;
    start_key: string;
    next_start_key: string;
}
