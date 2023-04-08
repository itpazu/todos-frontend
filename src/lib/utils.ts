import { Todo } from '../context/globalContext'

const SERVER_URL = 'https://drag-n-drop-sandy.vercel.app/'

type BasicHeadersArgs = { name: string, password: string }
export const createBasicHeaders = ({ name, password }: BasicHeadersArgs) => {

    let headers = new Headers
    headers.set('Authorization', 'Basic ' + Buffer.from(name + ':' + password).toString('base64'))
    headers.set('Content-Type', 'application/json')
    return headers
}

type FetcherArgs = {
    endpoint: string,
    method?: string
    body?: {}
    credentials?: { name: string, password: string }
}
export const fetcher = ({
    endpoint,
    body,
    credentials = {
        name: "itpazu",
        password: "morenito" //change that!
    },
    method = "GET" }: FetcherArgs) => {
    const headers = createBasicHeaders(credentials)
    return fetch(`${SERVER_URL}${endpoint}`, {
        method,
        headers,
        body: JSON.stringify(body)
    }
    )


}

const filterFunc = (todoArr: Todo[], criteria: boolean) => todoArr.filter(({ completed }) => completed === criteria)

const sortFunc = ({ order = 0 }, { order: orderB = 0 }) => order - orderB

export const todoStatusDivider = (todos: Todo[]) => {
    let pending = filterFunc(todos, false)
    let completed = filterFunc(todos, true)
    const res = {
        completedTodos: completed.length > 0 ? completed.sort(sortFunc) : [],
        todos: pending.length > 0 ? pending.sort(sortFunc) : []
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
            return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input)
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
    description: 'please insert a description of at least 10 letters long'

}

