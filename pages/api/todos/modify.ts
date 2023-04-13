import { NextApiResponse, NextApiRequest } from 'next'
import { todoStatusDivider, fetcher } from '../../../src/lib/utils';
import { TodosFromProps } from '../../../src/context/globalContext';

const ENDPOINT = 'todos'

export default async function handler(req: NextApiRequest, res: NextApiResponse<TodosFromProps>) {
    const userName = process.env.USERNAME
    const password = process.env.PASSWORD
    let body = req.body
    let data
    console.log(body)
    try {

        let response = await fetcher({
            endpoint: 'modify', method: "PUT",
            body, credentials: {
                name: userName || '',
                password: password || ''
            },
        })
        data = await response.json()
        if (response.status > 201) {
            res.status(response.status).json(todoStatusDivider(data))

        }
        else {

            res.status(response.status).json(data)
        }
    } catch (error) {

        return { todos: [], completedTodos: [] }
    }


}
