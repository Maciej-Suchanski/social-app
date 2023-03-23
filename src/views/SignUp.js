import './SignUp.css';
import { useState } from 'react';
import { Navigate } from "react-router-dom";
import axios from 'axios';
import { Link } from "react-router-dom";

const SignUp = (props) => {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [signUpMessage, setSignUpMessage] = useState('')
    const [signUpDone, setSignUpDone] = useState(false)

    const validate = () => {
        let validationErrors = {
            username: false,
            email: false,
            password: false,
            confirmPassword: false
        }

        if (formData.username.trim().length < 4) {
            validationErrors.username = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    username: "username, atleast 4 chars"
                }
            })
        } else if (!/^[^\s]*$/.test(formData.username.trim())) {
            validationErrors.username = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    username: "username, to many spaces"
                }
            })
        } else {
            validationErrors.username = false;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    username: ""
                }
            })
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())) {
            validationErrors.email = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    email: "email, invalid"
                }
            })
        } else {
            validationErrors.email = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    email: ""
                }
            })
        }

        if (formData.password.trim().length < 6) {
            validationErrors.password = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    password: "password, atleast 6 chars"
                }
            })
        } else if (!/^[^\s]*$/.test(formData.password.trim())) {
            validationErrors.password = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    password: "password, to many spaces"
                }
            })
        } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(formData.password.trim())) {
            validationErrors.password = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    password: "password, no special char"
                }
            })
        } else {
            validationErrors.username = false;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    username: ""
                }
            })
        }

        if (formData.password.trim() !== formData.confirmPassword.trim()) {
            validationErrors.confirmPassword = true;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    confirmPassword: "confirmPassword, diffrerent"
                }
            })
        } else {
            validationErrors.confirmPassword = false;
            setErrors((prevErrors) => {
                return {
                    ...prevErrors,
                    confirmPassword: ""
                }
            })
        }

        return (
            !validationErrors.username &&
            !validationErrors.email &&
            !validationErrors.password &&
            !validationErrors.confirmPassword
        )
    }

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;

        setFormData({
            ...formData,
            [name]: target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return
        }

        axios.post("https://akademia108.pl/api/social-app/user/signup", {
            username: formData.username,
            email: formData.email,
            password: formData.password
        })
            .then((res) => {
                console.log(res.data)

                let resData = res.data

                if (resData.signedup) {
                    setSignUpMessage('account created')
                    setSignUpDone(true)
                } else {
                    if (resData.message.username) {
                        setSignUpMessage(resData.message.username[0])
                    } else if (resData.message.email) {
                        setSignUpMessage(resData.message.email[0])
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }


    return (
        <div className="signUp">
            {props.user && <Navigate to="/" />}
            <form onSubmit={handleSubmit}>
                {signUpMessage && <h2> {signUpMessage} </h2>}
                <input type="text" name="username" placeholder="User name" onChange={handleInputChange} />
                {errors.username && <p> {errors.username} </p>}
                <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
                {errors.email && <p> {errors.email} </p>}
                <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
                {errors.password && <p> {errors.password} </p>}
                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleInputChange} />
                {errors.confirmPassword && <p> {errors.confirmPassword} </p>}
                <button className="btn" disabled={signUpDone}>Sign Up</button>

                {signUpDone && <div>
                    <Link to="/login" className='btn'>Go to login</Link>
                    </div>
                } 
            </form>
        </div>
    )
}

export default SignUp;