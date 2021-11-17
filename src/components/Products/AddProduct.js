import React, { lazy } from "react";
import { Button, Card, CardContent } from "@mui/material";
import useRouter from "../../Hooks/useRouter";

const FormProduct = lazy(() => import('./FormProduct'))

const AddProduct = () => {
    const router = useRouter()

    return (
        <>
            <Card className="mb-3">
				<h5>Nouveau produit</h5>
					<Button className="mx-2" onClick={() => router.push('/products')}>
						Retour
					</Button>
				<CardContent className="bg-light">
					<FormProduct add />
				</CardContent>
			</Card>
        </>
    )
}

export default AddProduct