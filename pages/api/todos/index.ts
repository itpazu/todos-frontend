import { NextApiResponse, NextApiRequest } from 'next'
import { todoStatusDivider, fetcher } from '../../../src/lib/utils';
import { TodosFromProps } from '../../../src/context/globalContext';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../src/lib/session';
import { FetchError } from '../../../src/lib/fetchError';

const ENDPOINT = 'todos'
type ErrorData = { detail: string }

async function handler(req: NextApiRequest, res:
    NextApiResponse) {

    const token = req.session.user?.token ?? ''
    try {

        const response = await fetcher({
            endpoint: ENDPOINT, credentials: `Bearer ${token}`,
        })
        const data = await response.json()
        if (response.ok) {
            return res.status(response.status).json(todoStatusDivider(data))

        }
        throw new FetchError<ErrorData>({
            message: response.statusText,
            data: data as ErrorData,
            response
        })

    } catch (error) {

        res.status((error instanceof FetchError) ? error.response?.status : 500).json({
            message: (error as Error | FetchError<ErrorData>).message ?? "server faild",
            ...{ completedTodos: [], todos: [] },
        })
    }


}
export default withIronSessionApiRoute(handler, sessionOptions)