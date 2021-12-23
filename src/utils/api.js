import Err from './humanResp'

export const SigninWithMailAndPassword = async ({email, password, loginBo}) => {
    await loginBo(email, password)
        .then(res => {
            if (res?.success) console.log("succeed!")
            else { throw Err(res) }
        })
}