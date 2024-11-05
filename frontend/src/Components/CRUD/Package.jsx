import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MUIDataTable from "mui-datatables";
import MetaData from '../Layout/MetaData';

const Packages = () => {
    const [packages, setPackages] = useState([]);
    const [newPackage, setNewPackage] = useState({ 
        name: '', 
        description: '', 
        price: 0, 
        availableDates: [{ startDate: '', endDate: '' }], 
        locations: [], 
        features: [], 
        itinerary: '', 
        status: 'Available', 
        images: [], 
        category: '' 
    });
    const [updateMode, setUpdateMode] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/packages');
                setPackages(res.data.packages);
            } catch (err) {
                toast.error('Error loading packages');
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/categories');
                setCategories(res.data.categories);
            } catch (err) {
                toast.error('Error loading categories');
            }
        };

        fetchPackages();
        fetchCategories();
    }, []);

    const handleNewPackage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newPackage).forEach(key => {
            if (Array.isArray(newPackage[key])) {
                newPackage[key].forEach(item => formData.append(key, item));
            } else {
                formData.append(key, newPackage[key]);
            }
        });

        try {
            const res = await axios.post('http://localhost:5000/api/admin/package/new', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPackages([...packages, res.data.package]);
            toast.success('Package created successfully');
            setNewPackage({ name: '', description: '', price: 0, availableDates: [{ startDate: '', endDate: '' }], locations: [], features: [], itinerary: '', status: 'Available', images: [], category: '' });
            setModalShow(false);
        } catch (err) {
            toast.error('Error creating package');
        }
    };

    const handleUpdatePackage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(selectedPackage).forEach(key => {
            if (Array.isArray(selectedPackage[key])) {
                selectedPackage[key].forEach(item => formData.append(key, item));
            } else {
                formData.append(key, selectedPackage[key]);
            }
        });

        try {
            const res = await axios.put(`http://localhost:5000/api/admin/package/${selectedPackage._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPackages(packages.map(pkg => (pkg._id === res.data.package._id ? res.data.package : pkg)));
            toast.success('Package updated successfully');
            setUpdateMode(false);
            setSelectedPackage({});
            setModalShow(false);
        } catch (err) {
            toast.error('Error updating package');
        }
    };

    const handleEditPackage = (id) => {
        const selectedPkg = packages.find(pkg => pkg._id === id);
        if (selectedPkg) {
            setSelectedPackage(selectedPkg);
            setUpdateMode(true);
            setModalShow(true);
            setNewPackage(selectedPkg); // Set form fields with selected package data
        }
    };

    const columns = [
        { name: "name", label: "Package Name" },
        { 
            name: "images", 
            label: "Images",
            options: {
                customBodyRender: (images) => (
                    images.map((img, index) => (
                        <img key={index} src={img.url} alt="package" style={{ width: '50px', height: '50px', marginRight: '5px' }} />
                    ))
                )
            }
        },
        { name: "status", label: "Status" },
        {
            name: "edit",
            label: "Edit",
            options: {
                customBodyRender: (_, tableMeta) => (
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditPackage(packages[tableMeta.rowIndex]._id)}
                    >
                        Edit
                    </button>
                )
            }
        }
    ];

    const options = {
        filter: false,
        selectableRows: "none",
    };

    return (
        <>
            <MetaData title="Packages" />
            <div className="container mt-5">
                <h1 className="mb-4">Packages</h1>
                <button className="btn btn-primary mb-4" onClick={() => { setUpdateMode(false); setModalShow(true); }}>
                    Add New Package
                </button>
                <MUIDataTable
                    title={"Package List"}
                    data={packages}
                    columns={columns}
                    options={options}
                />

                {/* Modal for Add/Edit Package */}
                {modalShow && (
                    <div className={`modal fade show`} style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{updateMode ? 'Edit Package' : 'Add New Package'}</h5>
                                    <button type="button" className="close" onClick={() => setModalShow(false)} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form onSubmit={updateMode ? handleUpdatePackage : handleNewPackage}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newPackage.name}
                                                onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                                                placeholder="Package Name"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                value={newPackage.description}
                                                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                                                placeholder="Package Description"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newPackage.price}
                                                onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                                                placeholder="Package Price"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                value={newPackage.category}
                                                onChange={(e) => setNewPackage({ ...newPackage, category: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="file"
                                                className="form-control-file"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files);
                                                    setNewPackage({ ...newPackage, images: files });
                                                }}
                                                multiple
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newPackage.itinerary}
                                                onChange={(e) => setNewPackage({ ...newPackage, itinerary: e.target.value })}
                                                placeholder="Itinerary Details"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                value={newPackage.status}
                                                onChange={(e) => setNewPackage({ ...newPackage, status: e.target.value })}
                                                required
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Unavailable">Unavailable</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setModalShow(false)}>Close</button>
                                        <button type="submit" className="btn btn-primary">
                                            {updateMode ? 'Update Package' : 'Add Package'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Packages;
