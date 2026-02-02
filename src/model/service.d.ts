export type BaseResponse<T = unknown> = {
    data: T,
    message: string,
}

export type ErrorResponse = {
    message: string,
    errors: Record<string, string[]>,
}



