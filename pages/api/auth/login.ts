
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '../../../src/lib/utils';
import type { User } from '../../../src/context/globalContext';

type ErrorData = { detail: string }

async function LoginRoute(req: NextApiRequest, res: NextApiResponse) {
    const baseAuthToken = req.headers?.authorization
    if (!baseAuthToken) return new Error("user data is missing")
    let response;
    let data: User | ErrorData;
    try {

        response = await fetcher({
            endpoint: 'api/auth/login', method: "POST",
            credentials: `${baseAuthToken}`
        })

        data = await response.json()
        if (response.ok) {
            console.log(data)

            const user = { isLoggedIn: true, user: (data as User).user }
            req.session.user = { ...user, token: (data as User).token }
            await req.session.save()
            return res.json(user)
        }

        throw new Error((data as ErrorData)?.detail ?? 'login failed')

    } catch (error) {
        res.status(response?.status || 500).json({ message: (error as Error).message })
    }
}

export default withIronSessionApiRoute(LoginRoute, sessionOptions)