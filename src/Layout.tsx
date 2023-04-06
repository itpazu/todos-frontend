import React from "react";
import Grid from '@mui/material/Grid';

export default function Layout({ children }: { children?: React.ReactElement }) {


    return (
        <Grid
            container
            spacing={1}
            padding={2}
            columns={{ xs: 12, md: 10 }} justifyContent='center' sx={{
                minHeight: '100vh'
            }}>
            {children}

        </Grid>
    )
}
