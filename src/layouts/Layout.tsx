import React from "react";
import Router, { useRouter } from 'next/router'
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import useUser from '../../src/components/hooks/useUser';
import useTodos from '../components/hooks/useTodos';
import axios from "axios";

export default function Layout({ children }: { children?: React.ReactElement }) {
    const { user, mutateUser } = useUser()
    const { mutate: mutateTodos } = useTodos()

    const router = useRouter()
    const goToLogin = () => {
        Router.push('/login')
    }

    const logOut = () => {
        mutateUser(async () => await axios.get('/api/auth/logout'))
        mutateTodos()
    }

    return (
        <Grid
            container
            spacing={1}
            padding={2}
            columns={{ xs: 12, md: 10 }}
            sx={theme => ({ minHeight: { xs: '95vh', sm: '100vh' }, backgroundColor: theme.palette.primary.main })}
            justifyContent={'center'}

        >
            <Grid item container minHeight='10vh' xs={12} alignItems={'center'} >

                <Grid item container xs={12} justifyContent={'flex-end'} >
                    {router.pathname !== "/login" && (user?.isLoggedIn ?
                        <Button
                            onClick={logOut}
                            sx={{ backgroundColor: theme => theme.palette.common.focusColor }}
                            variant="contained"
                            endIcon={<LogoutIcon />}
                        >
                            logout
                        </Button> :
                        <Button
                            onClick={goToLogin}
                            sx={{ backgroundColor: theme => theme.palette.common.focusColor }}
                            variant="contained"
                            endIcon={<LoginOutlinedIcon />}
                        >
                            login
                        </Button>)}

                </Grid>
                <Grid item container xs={12} justifyContent={'center'} >

                    <Typography variant='h3'> Upp-To-Do </Typography>
                </Grid>
                <Grid item container xs={12} justifyContent={'center'} >
                    <Typography
                        variant='body1'> Youve got to do what youve got to do. </Typography>
                </Grid>
            </Grid>
            {children}

        </Grid>
    )
}
