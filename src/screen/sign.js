import React, { lazy } from "react";
import { Grid } from '@mui/material';
const SignIn = lazy(() => import("../components/sign/SignIn"))
const SignUp = lazy(() => import( "../components/sign/SignUp"))


const Sign = () => {
    return (
        <>
            <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
                <Grid item md={6} sx={{ width: '75%' }}>
                    <SignIn />
                </Grid>
                <Grid item md={6} sx={{ width: '75%' }}>
                    <SignUp />
                </Grid>
            </Grid>
        </>
    )
}

export default Sign