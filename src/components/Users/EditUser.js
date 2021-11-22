import React, { lazy, useEffect, useState } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import useRouter from "../../Hooks/useRouter";
import { useApi } from "../../Hooks/useApi";

const FormUser = lazy(() => import('./FormUser'))

const EditUser = () => {
    const router = useRouter()
    const [data, setData] = useState(null)
    const { Fetch } = useApi()

    useEffect(() => {
		!data && Fetch(`/v1/bo/user/${router.query.id}`, "GET").then(res => res?.success && setData(res.user))
		return () => setData([])
		// eslint-disable-next-line
	}, [])
	
    return (
        <>
            <Card className="mb-3">
                <Box className="d-flex justify-content-between p-4">
					<h5>Edit User</h5>
					<Button className="mx-2 bg-dark" variant="contained" onClick={() => router.push('/users')}>
						Retour
					</Button>
				</Box>
				<CardContent>
					<FormUser edit formData={data} />
				</CardContent>
			</Card>
        </>
    )
}

export default EditUser