import { NextApiResponse, NextApiRequest } from 'next'
import { fetcher } from '../../../src/lib/utils';
import { User } from '../../../src/context/globalContext'
import { FetchError } from '../../../src/lib/fetchError';

type ErrorData = { detail: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.session?.user?.token ?? ''
    if (!token) {
        return res.status(401).end()
    }
    try {

        let response = await fetcher({
            endpoint: 'api/auth/user',
            credentials: token as string,
        })
        const data: User | ErrorData = await response.json()
        if (response.ok) {
            res.json({
                ...data,
                isLoggedIn: true,
            })
        }
        else {
            throw new FetchError({
                message: response.statusText,
                data: data as ErrorData,
                response
            })
        }
    } catch (error) {
        res.status((error instanceof FetchError) ? error.response?.status : 500).json({
            message: (error as Error | FetchError).message ?? "server faild",
            ...(error instanceof FetchError) && error.data,
            isLoggedIn: false,
        })
    }


}
