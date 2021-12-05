import React from 'react';
import { Grid, Box } from '@mui/material';
import FormLogin from './FormLogin';
import { useHistory } from 'react-router';

const Login = () => {
  const history = useHistory()

  return (
    <>
      <Grid container className="text-center justify-content-center">
          <Grid item sm={10} md={8} lg={6} sx={{ width: '100%' }}>
              <Box>
                  <h3 className="mb-3">Connexion</h3>
              </Box>
          </Grid>
      </Grid>
      <FormLogin />
      <span onClick={() => history.push('/check-email')} className="d-flex justify-content-center text-primary" style={{cursor: 'pointer'}}>Forgot password?</span>
    </>
    )
}

export default Login;