import { NextApiResponse, NextApiRequest } from 'next'
import { fetcher } from '../../../src/lib/utils';
import { FetchError, ErrorData } from '../../../src/lib/fetchError';
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/lib/session'


async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.session?.user?.token ?? ''
    let body = req.body
    try {

        const response = await fetcher({
            endpoint: 'modify', method: "PUT",
            body, credentials: `Bearer ${token}`,
        })
        const data = await response.json()
        if (response.ok) {
            return res.json(data)

        }
        throw new FetchError<ErrorData>({
            message: response.statusText,
            data: data as ErrorData,
            response
        })
    } catch (error) {
        res.status((error instanceof FetchError) ? error.response?.status : 500).json({
            message: (error as Error | FetchError<ErrorData>).message ?? "server faild",
            ...(error instanceof FetchError) && error.data,
        })
    }


}
export default withIronSessionApiRoute(handler, sessionOptions)