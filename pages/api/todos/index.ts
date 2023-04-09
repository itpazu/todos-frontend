import { NextApiResponse, NextApiRequest } from 'next'
import { todoStatusDivider, fetcher } from '../../../src/lib/utils';
import { TodosFromProps } from '../../../src/context/globalContext';

const ENDPOINT = 'todos/'

export default async function handler(_: NextApiRequest, res: NextApiResponse<TodosFromProps>) {

    const response = await fetcher({ endpoint: ENDPOINT })
    let data = await response.json()
    if (response.status > 201) {
        res.status(response.status).json(data)
    }
    res.status(200).json(todoStatusDivider(data))



}
