import React, { lazy, useEffect, useState } from "react";
import { Button, Card, CardContent } from "@mui/material";
import useRouter from "../../Hooks/useRouter";
import { useApi } from "../../Hooks/useApi";

const FormProduct = lazy(() => import('./FormProduct'))

const EditProduct = () => {
    const router = useRouter()
    const [data, setData] = useState(null)
    const { Fetch } = useApi()

    useEffect(() => {
		!data && Fetch(`/v1/web/product/${router.query.id}`, "GET").then(res => res?.success && setData(res.product))
		// eslint-disable-next-line
	}, [])

    return (
        <>
            <Card className="mb-3">
				<h5>Modifier produit</h5>
                    <Button className="mx-2" onClick={() => router.push('/produit')}>
                        Retour
                    </Button>
				<CardContent className="bg-light">
					<FormProduct edit formData={data} />
				</CardContent>
			</Card>
        </>
    )
}

export default EditProduct