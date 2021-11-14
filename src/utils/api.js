export const SigninWithMailAndPassword = async ({email, password, login}) => {
    await login(email, password)
        .then(res => {
            if (res?.success) {
                console.log(res)
            } else {
                throw new Error(res)
            }
        })
        .catch(err => {throw new Error(err)})
}