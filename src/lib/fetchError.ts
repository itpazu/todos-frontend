export class FetchError extends Error {
    response: Response
    static state: string = "custom"
    data: {
        detail: string
    }
    constructor({
        message,
        response,
        data,
    }: {
        message: string
        response: Response
        data: {
            detail: string
        }
    }) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError)
        }

        this.name = 'customError'
        this.response = response
        this.data = data ?? { detail: message }
    }
}
export type ErrorData = { detail: string }
