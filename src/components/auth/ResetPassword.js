import React from "react";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import FormResetPassword from "./FormResetPassword";

const ResetPassword = () => {
    return (
        <Grid container className="text-center justify-content-center">
          <Grid item sm={10} md={8} lg={6} sx={{ width: '100%' }}>
              <Box>
                  <h3 className="mb-3">Reset your password</h3>
                  <h5 className="mb-3">Step 2/2</h5>
                  <FormResetPassword />
              </Box>
          </Grid>
      </Grid>
    )
}

export default ResetPassword