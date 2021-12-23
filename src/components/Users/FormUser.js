import React, { useEffect } from "react";
import { toast } from 'react-toastify';
import { useMutation } from "react-query";
import { Button, Grid } from '@mui/material';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../Hooks/useInput";
import UseFormGroup from "../../Hooks/useForm";
import Loader from '../Loader'
import { useApi } from "../../Hooks/useApi";
import useRouter from "../../Hooks/useRouter";
import Err from '../../utils/humanResp'
import moment from "moment";

const defaultForm = {
    firstname: "",
    lastname: "",
    email: "",
    birthday: null,
    phone: null,
    role: "user",
    password:"",
    confirm_password:""
}

const FormUser = ({ add, edit, formData }) => {
    const { Fetch } = useApi()
    const router = useRouter()

    // FETCH TO CHANGE ITEM
    const setUser = async (data) => {
        if (add && !edit) {
            await Fetch('/v1/bo/user/add', "POST", data, true)
                .then(res => {
                    if (res?.success) console.log("succeed!")
                    else { throw Err(res) }
                })
        } else {
            await Fetch(`/v1/bo/user/${router.query.id}`, "PUT", { User: data }, true)
                .then(res => {
                    if (res?.success) console.log("succeed!")
                    else { throw Err(res) }
                })
        }
    }

    // START REACT QUERY
    const { isLoading, mutate, isError, error } = useMutation(setUser, {
        onSuccess: () => {
            toast.success("Success !", {
                position: "top-left",
                autoClose: 3000,
                theme: "dark",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            router.push('/users')
        }
    })

    // ADD VALIDATION
    const AddSchema = yup.object({
        firstname: yup.string().min(3).required(),
        lastname: yup.string().min(3).required(),
        email: yup.string().email().required(),
        birthday: yup.string(),
        password: yup.string().required().min(7),
        role: yup.string().oneOf(["user", "pro", "admin"]).required(),
        confirm_password: yup.string().required().min(7)
            .oneOf([yup.ref('password'), null], 'Password is different.'),
      });

    // EDIT VALIDATION
    const EditSchema = yup.object({
        firstname: yup.string().min(3).required(),
        lastname: yup.string().min(3).required(),
        birthday: yup.string(),
        email: yup.string().email().required(),
        role: yup.string().oneOf(["user", "pro", "admin"]).required(),
    });

    // START HOOK FORM
    const { handleSubmit, control, reset, formState: { errors, isSubmitSuccessful } } = useForm({
        resolver: yupResolver(add ? AddSchema : EditSchema),
        defaultValues: formData || defaultForm
    });

    //RESET FORM
    useEffect(() => {
        if (isSubmitSuccessful) {
          reset(defaultForm);
        }
      }, [isSubmitSuccessful, reset]);

    // ALL INPUT USED
    const firstname = useInput(formData ? formData.firstname : "", "firstname", "text", "Firstname...", "w-100")
    const lastname = useInput(formData ? formData.lastname : "", "lastname", "text", "Lastname...", "w-100")
    const email = useInput(formData ? formData.email : "", "email", "email", "Email...", "w-100")
    const password = useInput("", "password", "password", "Password...", "w-100")
    const confirm_password = useInput("", "confirm_password", "password", "Confirm password...", "w-100")
    const phone = useInput(formData ? formData.phone : null, "phone", "phone", "Phone number...", "w-100")
    const role = useInput(formData ? formData.role : "user", "role", "text", "Role...", "w-100")
    const birthday = useInput(formData ? moment(new Date(formData.birthday)) : null, "birthday", "date", "Birthday...", "w-100")

    // JSON SEND TO THE API
    const onSubmit = data => mutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
            <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup bind={firstname} control={control} />
                    {errors.firstname?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.firstname?.type === 'min' && <span className="text-danger">3 minimum</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup bind={lastname} control={control} />
                    {errors.lastname?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.lastname?.type === 'min' && <span className="text-danger">3 minimum</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup bind={email} control={control} />
                    {errors.email?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.email?.type === 'email' && <span className="text-danger">Wrong format</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup 
                        date
                        bind={birthday}
                        format="MM/dd/yyyy"
                        label="Birthday"
                    />
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup bind={phone} phone control={control}/>
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup 
                        select
                        bind={role}
                        control={control}
                        enums={[
                            {value: "user", display: "User"},
                            {value: "pro", display: "Pro"},
                            {value: "admin", display: "Admin"},
                        ]}
                    />
                    {errors.role?.type === 'required' && <span className="text-danger">Required</span>}
                </Grid>
                { add &&
                    <>
                        <Grid item md={6} className="mb-3 w-100">
                            <UseFormGroup bind={password} control={control} />
                            {errors.password?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.password?.type === 'min' && <span className="text-danger">Too small</span>}
                        </Grid>
                        <Grid item md={6} className="mb-3 w-100">
                            <UseFormGroup bind={confirm_password} control={control} />
                            {errors.confirm_password?.type === 'required' && <span className="text-danger">Required</span>}
                            {errors.confirm_password?.type === 'min' && <span className="text-danger">Too small</span>}
                            {errors.confirm_password?.type === 'oneOf' && <span className="text-danger">Wrong password</span>}
                        </Grid>
                    </>
                }
            </Grid>



            <Button size="small" className="w-50 mx-auto px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={isLoading}>
                {isLoading ? <Loader /> : <>{add ? "Add User" : "Edit User"}</>}
            </Button>
            {isError && <span className="text-danger text-center">{error}</span>}
        </form>
    )
}

export default FormUser