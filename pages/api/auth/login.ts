
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '../../../src/lib/utils';
import type { User } from '../../../src/context/globalContext';
import { FetchError, ErrorData } from '../../../src/lib/fetchError';


async function LoginRoute(req: NextApiRequest, res: NextApiResponse) {
    const baseAuthToken = req.headers?.authorization

    try {
        if (!baseAuthToken) {
            res.status(400)
            throw new Error("user data is missing")
        }

        let response = await fetcher({
            endpoint: 'api/auth/login', method: "POST",
            credentials: `${baseAuthToken}`
        })

        let data: User | ErrorData = await response.json()
        if (response.ok) {
            const user = { isLoggedIn: true, user: (data as User).user }
            req.session.user = { ...user, token: (data as User).token }
            await req.session.save()
            return res.json(user)
        }
        res.status(response?.status)
        throw new FetchError<ErrorData>({
            message: response.statusText,
            data: data as ErrorData,
            response
        })

    } catch (error) {
        res.status(500)
            .json({
                message: error instanceof FetchError ? error.message : "server faild",
                ...(error instanceof FetchError) && error.data
            })
    }
}

export default withIronSessionApiRoute(LoginRoute, sessionOptions)