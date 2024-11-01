import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import axios from 'axios';

const Register = () => {
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const { email, password } = user;

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        if (error) {
            console.log(error);
            setError('');
        }
    }, [error, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        const userData = { email, password };
        register(userData);
    };
    
    const register = async (userData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
    
            setLoading(true);
            const { data } = await axios.post('http://localhost:5000/api/auth/register', userData, config);
            console.log(data.user);
    
            setLoading(false);
            setUser(data.user);
            navigate('/');
        } catch (error) {
            setLoading(false);
            setUser({ email: '', password: '' });
            setError(error.response?.data?.error || 'An error occurred'); 
            console.log(error.response?.data?.error || error);
        }
    };
    

    return (
        <>
            <MetaData title={'Register'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })} // Update state correctly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })} // Update state correctly
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='password'
                                value={password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })} // Update state correctly
                            />
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'REGISTERING...' : 'REGISTER'} {/* Change button text while loading */}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
