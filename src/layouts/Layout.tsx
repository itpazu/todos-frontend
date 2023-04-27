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
            sx={theme => ({ minHeight: { xs: '95vh', sm: '100vh' }, backgroundColor: theme.palette.primary.main })}
            justifyContent={'center'}

        >
            <Grid item container minHeight='10vh' >

                <Grid item container xs={12} justifyContent={'center'} >

                    <Typography variant='h3'> U-ppTo-Do </Typography>
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
