import { NextApiResponse, NextApiRequest } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/lib/session'
import { fetcher } from '../../../src/lib/utils';
import { User } from '../../../src/context/globalContext'
import { FetchError, ErrorData } from '../../../src/lib/fetchError';


async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.session?.user?.token ?? ''
    try {
        if (!token) {
            throw new Error('credentials are missing')
        }

        let response = await fetcher({
            endpoint: 'api/auth/user',
            credentials: `Bearer ${token}`,
        })
        const data: User | ErrorData = await response.json()
        if (response.ok) {
            return res.json({
                ...data,
                isLoggedIn: true,
            })
        }

        throw new FetchError({
            message: response.statusText,
            data: data as ErrorData,
            response
        })

    } catch (error) {
        res.json({
            message: (error as Error | FetchError).message ?? "server faild",
            ...(error instanceof FetchError) && error.data,
            isLoggedIn: false,
        })
    }


}
export default withIronSessionApiRoute(handler, sessionOptions)