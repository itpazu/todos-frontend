
import { NextApiResponse, NextApiRequest } from 'next'
import { fetcher } from '../../../src/lib/utils'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {

        let response = await fetcher({
            endpoint: '/todos/',
            method: "POST",
            body: req.body
        })
        let data = await response.json()
        if (response.status > 201) {

            return res.status(response?.status || 500).json(data)

        }
        res.revalidate('/')
        res.status(200).json({ ...data })
    } catch (error) {
        return res.status(500).json("Server error")
    }






}