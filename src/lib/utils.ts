import { Todo } from '../context/globalContext'

const SERVER_URL_PRODUCTION = process.env.NEXT_PUBLIC_SERVER_URL
// const SERVER_URL_PRODUCTION = 'http://localhost:8000/'

type BasicHeadersArgs = { username: string, password: string }

export const createBasicAuthHeaders = ({ username, password }: BasicHeadersArgs) => {
    let headers = new Headers()
    headers.set('Authorization', 'Basic ' + Buffer.from(username + ':' + password).toString('base64'))
    headers.set('Content-Type', 'application/json')
    return headers
}
const createTokenHeader = (token: string) => {
    // console.log('token', token)
    let headers = new Headers()
    headers.set('Authorization', token)
    headers.set('Content-Type', 'application/json')
    return headers
}


type FetcherArgs = {
    endpoint: string
    method?: string
    body?: {}
    host?: string
    credentials?: BasicHeadersArgs | string
}
export const fetcher = ({
    endpoint,
    body,
    host = SERVER_URL_PRODUCTION,
    credentials,
    method = "GET" }: FetcherArgs) => {
    let headers;
    if (credentials) {

        headers = typeof credentials === 'object' ? createBasicAuthHeaders(credentials) : createTokenHeader(credentials)
    } else {
        headers = { 'Content-Type': 'application/json' }
    }
    return fetch(`${host}` + `${endpoint}`, {
        method,
        headers,
        body: JSON.stringify(body)
    }
    )


}

const filterFunc = (todoArr: Todo[], criteria: boolean) => todoArr.filter(({ completed }) => completed === criteria)

// const sortFunc = ({ order = 0 }, { order: orderB = 0 }) => order - orderB

export const todoStatusDivider = (todos: Todo[]) => {
    let pending = filterFunc(todos, false)
    let completed = filterFunc(todos, true)
    const res = {
        completedTodos: completed.length > 0 ? completed : [],
        todos: pending.length > 0 ? pending : []
    }
    return res
}

export const formatDate = (date: string): string => {
    return new Date(date)
        .toLocaleDateString('en-us', {
            year: "numeric",
            month: "short",
            day: "numeric"
        })

}

export const validate = (type: string, input: string) => {
    switch (type) {
        case "email":
            return input.length === 0 || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input)
        case "name":
            return /^[a-z|A-Z|\s]*$/.test(input)
        case "title":
            return input.length === 0 || (input.length > 1 && /^[a-z|A-Z|1-9\s]*$/.test(input))
        case "description":
            return input.length === 0 || (input.length > 5 && /^[a-z|A-Z|1-9\.\,\?\!@\s]*$/.test(input))
        case "initialDescription":
            return !!input && input.length > 5 && /^[a-z|A-Z|1-9\.\,\?\!@\s]*$/.test(input)
        default:
            return true

    }
}

export const HELPER_TEXT: { [key: string]: string } = {
    title: 'at least 2 character long, must contain character/numbers',
    description: 'please insert a description of at least 10 letters long',
    userName: "invalid user name. must contain only letters",
    email: "please provide a valid email address"

}

