import { NextApiResponse, NextApiRequest } from 'next'
import { fetcher } from '../../../src/lib/utils';
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/lib/session'


async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.session?.user?.token ?? ''
    let response;
    try {

        response = await fetcher({
            endpoint: 'api/auth/logout', method: "POST",
            credentials: `Bearer ${token}`,
        })

        if (response.ok) {
            return res.status(200).json({ isLoggedIn: false })

        }

    } catch (error) {
        res.status(response?.status || 500).json({
            message: (error as Error).message ?? "server faild",
        })
    }


}
export default withIronSessionApiRoute(handler, sessionOptions)