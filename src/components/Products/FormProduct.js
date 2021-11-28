import React, { useEffect } from "react";
import { toast } from 'react-toastify';
import { useMutation } from "react-query";
import { Button, FormControl, Grid, Input, MenuItem, Select } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput";
import Loader from '../Loader'
import { useApi } from "../../Hooks/useApi";
import Err from '../../utils/humanResp'
import useRouter from "../../Hooks/useRouter";

const defaultForm = {
    name: "",
    category: "men"
}


const FormProduct = ({ add, edit, formData }) => {
    const { Fetch } = useApi()

    const router = useRouter()

    const addProduct = async (data) => {
        if (add && !edit) {
            await Fetch('/v1/bo/product/add', "POST", data, true)
            .then(res => {
                if (res?.success) console.log("succeed!")
                else { throw Err(res) }
            })
        } else {
            await Fetch(`/v1/bo/product/${router.query.id}`, "PUT", { product: data }, true)
                .then(res => {
                    if (res?.success) console.log("succeed!")
                    else { throw Err(res) }
                })
        }
    }

    const { isLoading, mutate, isError, error } = useMutation(addProduct, {
        onSuccess: () => {
            toast.success("Add!", {
                position: "top-left",
                autoClose: 3000,
                theme: "dark",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            router.push('/products')
        }
    })

    const schema = yup.object({
        name: yup.string().min(3).required(),
        category: yup.string().oneOf(["men", "women", "jacket", "hat", "sneaker"]).required(),
      });

    const { handleSubmit, control, reset, formState: { errors, isSubmitSuccessful } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: formData || defaultForm
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
          reset(defaultForm);
        }
      }, [isSubmitSuccessful, reset]);

    const name = useInput(formData ? formData.name : "", "name", "text", "Name...", "w-100")
    const category = useInput(formData ? formData.name : "men", "category", "text", "Category...", "w-100")

    const onSubmit = data => mutate(data);

    return (
        <>
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
                    <Grid item md={6}>
                        <FormControl className="mb-5 mt-5 w-75">
                            <Controller
                                {...name.bindHookForm}
                                control={control}
                                render={({ field }) => <Input {...field} {...name.bindInput} />}
                            />
                            {errors.name?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.name?.type === 'min' && <span className="text-danger">3 minimum</span>}
                        </FormControl>
                    </Grid>

                    <Grid item md={6}>
                        <FormControl className="mb-5 mt-5 w-75">
                            <Controller
                                id="demo-simple-select-standard"
                                {...category.bindHookForm}
                                control={control}
                                render={({ field }) => 
                                    <Select {...field} {...category.bindInput}>
                                        <MenuItem value="men">Men</MenuItem>
                                        <MenuItem value="women">Women</MenuItem>
                                        <MenuItem value="sneaker">Sneaker</MenuItem>
                                        <MenuItem value="jacket">Jacket</MenuItem>
                                        <MenuItem value="hat">Hat</MenuItem>
                                    </Select>
                                }
                            />
                            {errors.category?.type === 'required' && <span className="text-danger">Required</span>}
                        </FormControl>
                    </Grid>
                </Grid>
                <Button size="small" className="w-50 mx-auto px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={isLoading}>
                    {isLoading ? <Loader /> : <>{add ? "Add Product" : "Edit Product"}</>}
                </Button>
                {isError && <span className="text-danger text-center">{error}</span>}
            </form>
        </div>
        </>
    )
}

export default FormProduct