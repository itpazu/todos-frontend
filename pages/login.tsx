import React, { useState } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Layout from '../src/layouts/Layout';
import Button from '@mui/material/Button';
import { validate, HELPER_TEXT, fetcher } from '../src/lib/utils';

export default function Login() {

    const [input, setInput] = useState({ username: '', password: '' })

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
            .then(res => res.json())
            .then(data => console.log(data))
    }
    // console.log(input.username.length > 1 && /^[a-z|A-Z|1-9\s]*$/.test(input.username))
    console.log(!validate("name", input.username) || input.username.length === 0 || input.password.length === 0)
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
                    type="password"
                    value={input.password}
                    label="Password"
                    autoComplete='off'
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
