export interface ResponseEnvelope<T> {
    data: T
    code: number
    status: string
    path: string
    message: string
    page_size: number
    request_id: string
    timestamp: number
    timestampISO8601: string
}