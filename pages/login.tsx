import React, { useState } from 'react'
import Link from 'next/link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Layout from '../src/layouts/Layout';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert'
import { validate, HELPER_TEXT, fetcher } from '../src/lib/utils';
import useUser from '../src/components/hooks/useUser';
import Loader from '../src/components/Loader'

export default function Login() {

    const [input, setInput] = useState({ username: '', password: '' })
    const [loginError, setLoginError] = useState(null)
    const [showPassword, setShowPassword] = useState(false);
    const [inProcess, setInProcess] = useState(false)
    const { mutateUser } = useUser(
        {
            redirectIfFound: true,
            redirectTo: 'users/',
        })

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const onInput: React.ChangeEventHandler<HTMLInputElement> =
        ({ currentTarget: { name, value } }) => {
            setLoginError(null)
            setInput(prev => ({
                ...prev,
                [name]: value
            }))
        }

    const onSubmit = () => {
        setInProcess(true)
        fetcher({
            endpoint: 'api/auth/login',
            host: '',
            method: 'POST',
            credentials: input

        })
            .then(res => {
                if (res.ok) {
                    mutateUser()
                    return null
                }
                else {
                    return res.json()
                }

            })
            .then(data => {
                if (!data) {
                    setInProcess(false)
                    return
                }
                throw new Error(data?.detail || data.message)

            })
            .catch(err => {
                setInProcess(false)
                setLoginError(err.message)
            })
    }
    return (
        <Box
            component="form"
            sx={{
                padding: 2,
                width: "60vw",
                '& .MuiTextField-root': { width: '100%' },
            }}
            autoComplete="off"
        >
            <Loader open={inProcess} />
            <Stack spacing={2} alignItems="center">
                <Typography variant='h3'> Login </Typography>
                <Stack alignItems={'center'}
                >

                    <Typography variant='h6' sx={{ textAlign: 'center' }} >
                        if you are not a registered user,
                    </Typography>
                    <Typography variant="h6">

                        <Link href="/signup">
                            sign-up here
                        </Link> {' '}
                    </Typography>
                    <Typography variant="subtitle1">
                        ...or <em>don't</em> do.
                    </Typography>
                </Stack>


                <TextField
                    onChange={onInput}
                    name="username"
                    value={input.username}
                    error={!validate("name", input.username)}
                    label="User Name"
                    helperText={validate("name", input.username) ? "" : HELPER_TEXT["userName"]}
                />
                <TextField
                    onChange={onInput}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={input.password}
                    label="Password"
                    autoComplete='off'
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                    }}

                />
                {loginError &&
                    <Alert severity="error">
                        <Typography variant='h5'>

                            {loginError}
                        </Typography>
                    </Alert>}
                <Button
                    size="large"
                    variant="contained"
                    color='secondary'
                    disabled={!validate("name", input.username) ||
                        input.username.length === 0 ||
                        input.password.length === 0}
                    onClick={onSubmit}
                >
                    Sign-In
                </Button>

            </Stack>
        </Box>
    )
}

Login.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}
