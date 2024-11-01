import React, { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import MetaData from '../Layout/MetaData';
import Loader from '../Layout/Loader'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {authenticate, getUser} from '../../utils/helpers'



const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    
    let location = useLocation()
    const navigate = useNavigate()
   
    console.log(location)
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''
    // const notify = (error) => toast.error(error, {
    //     position: toast.POSITION.BOTTOM_RIGHT
    // });

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.post(`http://localhost:5000/api/auth/login`, { email, password }, config)
            console.log(data)
            authenticate(data, () => navigate("/"))
            
        } catch (error) {
            toast.error("invalid user or password", {
                position: 'bottom-right'
            })
        }
    }
    const submitHandler = (e) => {
        e.preventDefault();
        login(email, password)
    }
    useEffect(() => {
        if (getUser() && redirect === 'shipping' ) {
             navigate(`/${redirect}`)
        }
    }, [])

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={'Login'} />

                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mb-3">Login</h1>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password_field">Password</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>
                                <button id="login_button" type="submit" className="btn btn-block py-3">
                                    LOGIN
                                </button>
                                <p>Don't have an account?<Link to="/register" className="float-right mb-4">Register</Link></p>
                            </form>
                        </div>
                    </div>

                </>
            )}
        </>
    )
}

export default Login