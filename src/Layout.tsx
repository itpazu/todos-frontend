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
            justifyContent={'center'}

        >
            <Grid item container xs={12} justifyContent={'center'} sx={{ minHeight: '5vh' }}>

                <Typography sx={{ fontfamily: 'Caveat' }} variant='h3'> U-ppTo-Do </Typography>
            </Grid>
            <Grid item container xs={12} justifyContent={'center'} sx={{ minHeight: '5vh' }}>
                <Typography sx={{ fontfamily: 'Caveat', justifySelf: 'left' }}
                    variant='body1'> Youve got to do what youve got to do. </Typography>
            </Grid>
            {children}

        </Grid>
    )
}
