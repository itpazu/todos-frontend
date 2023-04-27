import type { IronSessionOptions } from 'iron-session'
import type { User } from '../context/globalContext'

export const sessionOptions: IronSessionOptions = {
    password: process.env.COOKIE_PASSWORD as string,
    cookieName: 'todo-db-next-app',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

declare module 'iron-session' {
    interface IronSessionData {
        user?: User
    }
}
