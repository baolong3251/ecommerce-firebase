import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./style_SignIn.scss"
import { Link, useHistory } from "react-router-dom"
import { emailSigninStart, googleSignInStart} from '../../redux/User/user.action'

import AuthWrapper from '../AuthWrapper';
import FormInput from '../forms/FormInput';
import Button from './../forms/Button'

const mapState = ({ user }) => ({
    currentUser : user.currentUser,
    userErr: user.userErr
})

const SignIn = props => {
    const history = useHistory();
    const { currentUser, userErr } = useSelector(mapState);
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (currentUser) {
            resetForm();
            history.push("/");
        }
    }, [currentUser]);

    useEffect(() => {
        if (Array.isArray(userErr) && userErr.length>0){
            setErrors(userErr);
        }
    }, [userErr])

    const resetForm = () => {
        setEmail('')
        setPassword('')
        setErrors([])
    }

    const handleSubmit = e => {
        e.preventDefault();
        // if (email === '' || password === ''){
        //     alert('Plz fill all the field')
        //     return
        // }
        dispatch(emailSigninStart({ email, password }))

    }

    const handleGooleSignIn = () => {
        dispatch(googleSignInStart())
    }

    const configAuthWrapper = {
        headline: 'LogIn'
    }

    return (
        <AuthWrapper {...configAuthWrapper}>
            <div className="formWrap">

                {errors.length > 0 && (
                    <ul>
                        {errors.map((err, index) => {
                            return (
                                <li key={index}>
                                    {err}
                                </li>
                            )
                        })}
                    </ul>
                )}

                <form onSubmit={handleSubmit}>

                    <FormInput
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        handleChange={e => setEmail(e.target.value)}
                    />

                    <FormInput
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        handleChange={e => setPassword(e.target.value)}
                    />

                    <Button type="submit">
                        LogIn
                    </Button>

                    <div className="socialSignin">
                        <div className="row">
                            <Button onClick={handleGooleSignIn}>
                                Sign in with google
                            </Button>
                        </div>
                    </div>

                    <div className="links">
                        <Link to="/recovery">
                            Reset Password
                        </Link>
                    </div>

                </form>
            </div>
        </AuthWrapper>
    )
}


export default SignIn
