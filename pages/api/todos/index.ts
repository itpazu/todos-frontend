import { NextApiResponse, NextApiRequest } from 'next'
import { todoStatusDivider, fetcher } from '../../../src/lib/utils';
import { TodosFromProps } from '../../../src/context/globalContext';

const ENDPOINT = 'todos'

export default async function handler(_: NextApiRequest, res: NextApiResponse<TodosFromProps>) {
    const userName = process.env.USERNAME
    const password = process.env.PASSWORD
    let data;
    try {

        const response = await fetcher({
            endpoint: ENDPOINT, credentials: {
                name: userName || '',
                password: password || ''
            },
        })
        data = await response.json()
        if (response.status === 200) {
            res.status(response.status).json(todoStatusDivider(data))

        }
        else {

            res.status(response.status).json(data)
        }
    } catch (error) {

        return { todos: [], completedTodos: [] }
    }


}
