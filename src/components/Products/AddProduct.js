import React, { lazy } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import useRouter from "../../Hooks/useRouter";

const FormProduct = lazy(() => import('./FormProduct'))

const AddProduct = () => {
    const router = useRouter()

    return (
        <>
            <Card className="mb-3">
				<Box className="d-flex justify-content-between p-4">
					<h5>New Product</h5>
					<Button className="mx-2 bg-dark" variant="contained" onClick={() => router.push('/products')}>
						Go back
					</Button>
				</Box>
				<CardContent>
					<FormProduct add />
				</CardContent>
			</Card>
        </>
    )
}

export default AddProduct