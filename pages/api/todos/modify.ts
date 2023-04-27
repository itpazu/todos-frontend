import { NextApiResponse, NextApiRequest } from 'next'
import { fetcher } from '../../../src/lib/utils';
import { TodosFromProps } from '../../../src/context/globalContext';


export default async function handler(req: NextApiRequest, res: NextApiResponse<TodosFromProps>) {
    const userName = process.env.USERNAME
    const password = process.env.PASSWORD
    let body = req.body
    let data
    try {

        let response = await fetcher({
            endpoint: 'modify', method: "PUT",
            body, credentials: {
                username: userName || '',
                password: password || ''
            },
        })
        data = await response.json()
        if (response.status === 200) {
            res.status(response.status).json(data)

        }
        else {
            res.status(response.status).json(data)
        }
    } catch (error) {

        return { todos: [], completedTodos: [] }
    }


}
