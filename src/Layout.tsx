import React from "react";
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";

export default function Layout({ children }: { children?: React.ReactElement }) {


    return (
        <Grid
            container
            spacing={1}
            padding={2}
            columns={{ xs: 12, md: 10 }}
            sx={theme => ({ minHeight: '100vh', backgroundColor: theme.palette.primary.main })}

        >
            <Grid item container xs={12} justifyContent={'center'} sx={{ minHeight: '10vh' }}>
                <Typography sx={{ fontfamily: 'Caveat' }}
                    variant='h3'> Todo app </Typography>
            </Grid>
            {children}

        </Grid>
    )
}
