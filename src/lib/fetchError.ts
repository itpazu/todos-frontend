export type ErrorData = { detail: string }
type keys = "username" | "password" | "email"
export type SignUpError = { [k in keys]?: Array<string> }

export class FetchError<Data extends ErrorData | SignUpError> extends Error {
    response: Response
    static state: string = "custom"
    data: Data
    constructor({
        message,
        response,
        data,
    }: {
        message: string
        response: Response
        data: Data
    }) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError)
        }

        this.name = 'customError'
        this.response = response
        this.data = data
    }
}

