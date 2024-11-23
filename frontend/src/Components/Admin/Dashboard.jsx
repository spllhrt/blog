import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import { getToken } from '../../utils/helpers';
import axios from 'axios'

import 'react-toastify/dist/ReactToastify.css';
// import UserSalesChart from './UserSalesChart';
// import MonthlySalesChart from './MonthlySalesChart';
// import PackageSalesChart from './PackageSalesChart';

const Dashboard = () => {

    const [packages, setPackages] = useState([])
    const [error, setError] = useState('')
    const [users, setUsers] = useState([])
    // const [booking, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    // const [totalAmount, setTotalAmount] = useState([])
    // const [allOrders, setAllOrders] = useState([])
    const [allUsers, setAllUsers] = useState([])
    let outOfStock = 0;
    packages.forEach((pkg) => {
        if (pkg.stock === 0) {
            outOfStock += 1;
        }
    });
    
    const getAdminPackages = async () => {
        try {

            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/packages`, config)
            console.log(data)
            setPackages(data.packages)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const adminOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/orders`, config)
            setAllOrders(data.orders)
            
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const adminUsers = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/users`, config)
            setAllUsers(data.users)
            
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        getAdminPackages()
        adminOrders()
        adminUsers()
    }, [])
    console.log(allOrders.length, allUsers.length)
    return (
        <>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Dashboard</h1>

                    {loading ? <Loader /> : (
                        <>
                            <MetaData title={'Admin Dashboard'} />

                            <div className="row pr-4">
                                <div className="col-xl-12 col-sm-12 mb-3">
                                    <div className="card text-white bg-primary o-hidden h-100">
                                        <div className="card-body">
                                            {/* <div className="text-center card-font-size">Total Amount<br /> <b>${totalAmount && totalAmount.toFixed(2)}</b>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row pr-4">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-success o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Packages<br /> <b>{packages && packages.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/packages">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-danger o-hidden h-100">

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Orders<br /> <b>{allOrders && allOrders.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-info o-hidden h-100">

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Users<br /> <b>{allUsers && allUsers.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-warning o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Out of Stock<br /> <b>{outOfStock}</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {/* <UserSalesChart />
                    <MonthlySalesChart />
                    <PackageSalesChart /> */}
                </div>
            </div>
        </>
    )
}

export default Dashboard
