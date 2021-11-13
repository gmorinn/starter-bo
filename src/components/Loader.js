import React from "react";
import { CircularProgress } from '@mui/material';

const Loader = () => {
    return (
            <div className="d-flex justify-content-center align-items-center">
                <CircularProgress />
            </div>
        )
}

export default Loader