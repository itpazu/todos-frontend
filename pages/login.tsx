import React, { useState } from 'react'
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
import { validate, HELPER_TEXT, fetcher } from '../src/lib/utils';
import useUser from '../src/components/hooks/useUser';

export default function Login() {

    const [input, setInput] = useState({ username: '', password: '' })
    const [showPassword, setShowPassword] = useState(false);
    const { mutateUser } = useUser(
        {
            redirectIfFound: true,
            redirectTo: 'users/',
        })

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // console.log(error)
    const onInput: React.ChangeEventHandler<HTMLInputElement> =
        ({ currentTarget: { name, value } }) => {
            setInput(prev => ({
                ...prev,
                [name]: value
            }))
        }

    const onSubmit = () => {
        fetcher({
            endpoint: 'api/auth/login',
            host: '',
            method: 'POST',
            credentials: input

        })
            .then(res => {
                if (res.ok) return mutateUser()
                return res.json()

            })
            .then(data => {
                console.log(data)
                // mutateUser()

            })
            .catch(err => console.log(err))
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
            <Stack spacing={2} alignItems="center">
                <Typography variant='h3'> Login </Typography>
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
                                    // onMouseUp={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                    }}

                />
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
