import React, { lazy } from "react";
import { Button, Card, CardContent } from "@mui/material";
import useRouter from "../../Hooks/useRouter";

const FormUser = lazy(() => import('./FormUser'))

const AddUser = () => {
    const router = useRouter()

    return (
        <>
            <Card className="mb-3">
				<h5>Nouvelle Utilisateur</h5>
					<Button className="mx-2" onClick={() => router.push('/users')}>
						Retour
					</Button>
				<CardContent className="bg-light">
					<FormUser add />
				</CardContent>
			</Card>
        </>
    )
}

export default AddUser