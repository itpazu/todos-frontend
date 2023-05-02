import React from "react";
import Router, { useRouter } from 'next/router'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import TryIcon from '@mui/icons-material/Try';
import LogoutIcon from '@mui/icons-material/Logout';
import useUser from '../../src/components/hooks/useUser';
import useTodos from '../components/hooks/useTodos';
import axios from "axios";

const PlayGroundToolTip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({

    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.whiteTone,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[2],
        border: `2px solid ${theme.palette.common.focusColor}`,
        fontSize: 20,
    },
}));
export default function Layout({ children }: { children?: React.ReactElement }) {
    const { user, mutateUser } = useUser()
    const { mutate: mutateTodos } = useTodos()

    const router = useRouter()
    const redirect = (endpoint: string) => {
        Router.push(endpoint)
    }

    const logOut = () => {
        mutateUser(async () => await axios.get('/api/auth/logout'))
        mutateTodos()
    }
    console.log(tooltipClasses.tooltip)
    const renderButtonPerPath = () => {
        switch (router.pathname) {
            case "/":
                return (
                    <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{ width: '100%' }}>

                        <Button
                            onClick={() => redirect('/login')}
                            sx={{ backgroundColor: theme => theme.palette.common.focusColor }}
                            variant="contained"
                            endIcon={<LoginOutlinedIcon />}
                        >
                            login
                        </Button>
                        <Button
                            onClick={() => redirect('/signup')}
                            sx={{ backgroundColor: theme => theme.palette.common.focusColor }}
                            variant="contained"
                            endIcon={<AppRegistrationIcon />}
                        >
                            signUp
                        </Button>
                    </Stack>

                )
            case "/login":
                return (
                    <Stack spacing={2} direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                        <PlayGroundToolTip
                            title="play around, without saving your todos"
                        >

                            <Button
                                onClick={() => redirect('/')}
                                sx={{
                                    color: theme => theme.palette.common.focusColor,

                                    "&:hover": {
                                        backgroundColor: theme => theme.palette.common.whiteTone
                                    }

                                }}
                                variant="text"
                                endIcon={<TryIcon />}
                            >
                                playground
                            </Button>
                        </PlayGroundToolTip>
                        <Button
                            onClick={() => redirect('/signup')}
                            sx={{ backgroundColor: theme => theme.palette.common.focusColor }}
                            variant="contained"
                            endIcon={<AppRegistrationIcon />}
                        >
                            signUp
                        </Button>
                    </Stack>
                )
            case "/signup":
                return (
                    <Stack spacing={2} direction="row" justifyContent="space-between" sx={{ width: '100%' }}>

                        <PlayGroundToolTip
                            title="play around, without saving your todos"
                        >

                            <Button
                                onClick={() => redirect('/')}
                                sx={{
                                    color: theme => theme.palette.common.focusColor,

                                    "&:hover": {
                                        backgroundColor: theme => theme.palette.common.whiteTone
                                    }

                                }}
                                variant="text"
                                endIcon={<TryIcon />}
                            >
                                playground
                            </Button>
                        </PlayGroundToolTip>

                        <Button
                            onClick={() => redirect('/login')}
                            sx={{ backgroundColor: theme => theme.palette.common.focusColor }}
                            variant="contained"
                            endIcon={<LoginOutlinedIcon />}
                        >
                            login
                        </Button>
                    </Stack>

                )
            default:
                return (<Button
                    onClick={logOut}
                    sx={{ backgroundColor: theme => theme.palette.common.focusColor }}
                    variant="contained"
                    endIcon={<LogoutIcon />}
                >
                    logout
                </Button>)



        }
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
                    {renderButtonPerPath()}
                </Grid>
                <Grid item container xs={12} justifyContent={'center'} >

                    <Typography variant='h3'> Upp-To-Do </Typography>
                </Grid>
                <Grid item container xs={12} justifyContent={'center'} >
                    <Typography
                        variant='body1'> You've got to do what you've got to do. </Typography>
                </Grid>
            </Grid>
            {children}

        </Grid>
    )
}
