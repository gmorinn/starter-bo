import React, { lazy, useEffect, useState } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import useRouter from "../../Hooks/useRouter";
import { useApi } from "../../Hooks/useApi";
import { useParams } from "react-router";

const FormUser = lazy(() => import('./FormUser'))
const ChangeUserPassword = lazy(() => import('./ChangeUserPassword'))

const EditUser = () => {
    const router = useRouter()
	const { id } = useParams()
    const [data, setData] = useState(null)
    const { Fetch } = useApi()

    useEffect(() => {
		!data && Fetch(`/v1/bo/user/${id}`, "GET").then(res => res?.success && setData(res.user))
		return () => setData([])
		// eslint-disable-next-line
	}, [])
	
    return (
        <>
            <Card className="mb-5">
                <Box className="d-flex justify-content-between p-4">
					<h5>Edit User</h5>
					<Button className="mx-2" variant="contained" onClick={() => router.push('/users')}>
						Go back
					</Button>
				</Box>
				<CardContent>
					{data && <FormUser edit formData={data} />}
				</CardContent>
			</Card>
			<Card className="mb-3">
                <Box className="d-flex justify-content-between p-4">
					<h5>Edit Password</h5>
					<Button className="mx-2" variant="contained" onClick={() => router.push('/users')}>
						Go back
					</Button>
				</Box>
				<CardContent>
					{id && <ChangeUserPassword id={id} />}
				</CardContent>
			</Card>
        </>
    )
}

export default EditUser