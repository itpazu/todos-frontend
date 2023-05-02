
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '../../../src/lib/utils';
import { FetchError, SignUpError } from '../../../src/lib/fetchError';
import { sessionOptions } from 'src/lib/session';


type NewUser = {
    user: {
        id: number
        username: string
        email: string
    }
    token: string
}
async function Signup(req: NextApiRequest, res: NextApiResponse) {
    try {

        const response = await fetcher({
            endpoint: 'api/auth/register', method: "POST",
            body: req.body,
        })

        let data: NewUser | SignUpError = await response.json()
        if (response.ok) {
            const user = {
                user: {
                    username: (data as NewUser).user.username
                },
                isLoggedIn: true,
                token: (data as NewUser).token
            }
            req.session.user = user
            await req.session.save()
            return res.json(user)
        }
        res.status(response?.status)
        throw new FetchError<SignUpError>({
            message: response.statusText,
            data: data as SignUpError,
            response
        })

    } catch (error) {
        res.status(500)
            .json({
                message: error instanceof FetchError ? error.message : "server failure",
                ...(error instanceof FetchError) && error.data
            })
    }
}

export default withIronSessionApiRoute(Signup, sessionOptions)