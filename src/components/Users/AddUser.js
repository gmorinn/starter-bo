import React, { lazy } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import useRouter from "../../Hooks/useRouter";

const FormUser = lazy(() => import('./FormUser'))

const AddUser = () => {
    const router = useRouter()

    return (
		<Card className="">
			<Box className="d-flex justify-content-between p-3">
				<h5>New User</h5>
				<Button className="mx-2" variant="contained" onClick={() => router.push('/users')}>
					Go back
				</Button>
			</Box>
			<CardContent>
				<FormUser add />
			</CardContent>
		</Card>
    )
}

export default AddUser