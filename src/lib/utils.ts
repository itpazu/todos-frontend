import axios from 'axios'
import { Todo } from '../context/globalContext'

export const createBasicHeaders = (name: string, password: string) => {

    let headers = new Headers
    headers.set('Authorization', 'Basic ' + Buffer.from(name + ':' + password).toString('base64'))
    headers.set('Content-Type', 'application/json')
    return headers
}

export const fetcher = async (url: string, method: string, headers: {
    [index: string]: string
}) => {

    let response = await axios(url, { method, headers })
    return response.data
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
