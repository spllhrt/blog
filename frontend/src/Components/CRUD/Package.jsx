import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/MetaData';
import 'bootstrap/dist/css/bootstrap.min.css';

const Packages = () => {
    const [packages, setPackages] = useState([]);
    const [packageDetails, setPackageDetails] = useState({});
    const [newPackage, setNewPackage] = useState({
        name: '',
        description: '',
        price: '',
        stocks: '',
        availableDates: [{ startDate: '', endDate: '' }],
        locations: [''],
        features: [''],
        itinerary: '',
        status: 'Available',
        images: [],
        category: '',
    });
    const [updateMode, setUpdateMode] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/packages'); // Adjust the endpoint as needed
                setPackages(res.data.packages);
                setLoading(false);
            } catch (err) {
                setError('Error loading packages');
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handleNewPackage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(newPackage).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => formData.append(key, item));
            } else {
                formData.append(key, value);
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
            resetForm();
        } catch (err) {
            setError('Error creating package');
        }
    };

    const handleUpdatePackage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(packageDetails).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => formData.append(key, item));
            } else {
                formData.append(key, value);
            }
        });

        try {
            const res = await axios.put(`http://localhost:5000/api/admin/package/${packageDetails._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPackages(packages.map(pkg => (pkg._id === res.data.package._id ? res.data.package : pkg)));
            toast.success('Package updated successfully');
            resetForm();
        } catch (err) {
            setError('Error updating package');
        }
    };

    const handleDeletePackage = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/package/${id}`); // Adjust the endpoint as needed
            setPackages(packages.filter(pkg => pkg._id !== id));
            toast.success('Package deleted successfully');
        } catch (err) {
            setError('Error deleting package');
        }
    };

    const handleViewPackage = (pkg) => {
        setPackageDetails(pkg);
        setUpdateMode(false);
        setViewMode(true);
        setModalShow(true);
    };

    const resetForm = () => {
        setNewPackage({
            name: '',
            description: '',
            price: '',
            stocks: '',
            availableDates: [{ startDate: '', endDate: '' }],
            locations: [''],
            features: [''],
            itinerary: '',
            status: 'Available',
            images: [],
            category: '',
        });
        setModalShow(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <MetaData title="Packages" />
            <div className="container mt-5">
                <h1 className="mb-4">Packages</h1>
                <button className="btn btn-primary mb-4" onClick={() => { resetForm(); setUpdateMode(false); setViewMode(false); setModalShow(true); }}>
                    Add New Package
                </button>
                {error && <div className="alert alert-danger">{error}</div>}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Package Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(pkg => (
                            <tr key={pkg._id}>
                                <td>{pkg.name}</td>
                                <td>{pkg.price}</td>
                                <td>{pkg.status}</td>
                                <td>
                                    <button className="btn btn-info mr-2" onClick={() => handleViewPackage(pkg)}>View</button>
                                    <button className="btn btn-warning mr-2" onClick={() => { setPackageDetails(pkg); setUpdateMode(true); setViewMode(false); setModalShow(true); }}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDeletePackage(pkg._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Add/Edit/View Package */}
                <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden={!modalShow}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{viewMode ? 'View Package' : (updateMode ? 'Edit Package' : 'Add New Package')}</h5>
                                <button type="button" className="close" onClick={() => setModalShow(false)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={updateMode ? handleUpdatePackage : handleNewPackage}>
                                <div className="modal-body">
                                    {viewMode ? (
                                        <>
                                            <div className="form-group">
                                                <label>Package Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={packageDetails.name}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Package Description</label>
                                                <textarea
                                                    className="form-control"
                                                    value={packageDetails.description}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Price</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={packageDetails.price}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Status</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={packageDetails.status}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Itinerary</label>
                                                <textarea
                                                    className="form-control"
                                                    value={packageDetails.itinerary}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Images</label>
                                                {packageDetails.images.map(image => (
                                                    <img key={image.public_id} src={image.url} alt={packageDetails.name} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="form-group">
                                                <label>Package Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={updateMode ? packageDetails.name : newPackage.name}
                                                    onChange={(e) => updateMode ? setPackageDetails({ ...packageDetails, name: e.target.value }) : setNewPackage({ ...newPackage, name: e.target.value })}
                                                    placeholder="Package Name"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Package Description</label>
                                                <textarea
                                                    className="form-control"
                                                    value={updateMode ? packageDetails.description : newPackage.description}
                                                    onChange={(e) => updateMode ? setPackageDetails({ ...packageDetails, description: e.target.value }) : setNewPackage({ ...newPackage, description: e.target.value })}
                                                    placeholder="Package Description"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Price</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={updateMode ? packageDetails.price : newPackage.price}
                                                    onChange={(e) => updateMode ? setPackageDetails({ ...packageDetails, price: e.target.value }) : setNewPackage({ ...newPackage, price: e.target.value })}
                                                    placeholder="Price"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Stocks</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={updateMode ? packageDetails.stocks : newPackage.stocks}
                                                    onChange={(e) => updateMode ? setPackageDetails({ ...packageDetails, stocks: e.target.value }) : setNewPackage({ ...newPackage, stocks: e.target.value })}
                                                    placeholder="Stocks"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Available Dates</label>
                                                {newPackage.availableDates.map((date, index) => (
                                                    <div key={index} className="d-flex">
                                                        <input
                                                            type="date"
                                                            className="form-control mr-2"
                                                            value={date.startDate}
                                                            onChange={(e) => {
                                                                const newDates = [...newPackage.availableDates];
                                                                newDates[index].startDate = e.target.value;
                                                                setNewPackage({ ...newPackage, availableDates: newDates });
                                                            }}
                                                            required
                                                        />
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={date.endDate}
                                                            onChange={(e) => {
                                                                const newDates = [...newPackage.availableDates];
                                                                newDates[index].endDate = e.target.value;
                                                                setNewPackage({ ...newPackage, availableDates: newDates });
                                                            }}
                                                            required
                                                        />
                                                        <button type="button" className="btn btn-danger ml-2" onClick={() => {
                                                            const newDates = newPackage.availableDates.filter((_, i) => i !== index);
                                                            setNewPackage({ ...newPackage, availableDates: newDates });
                                                        }}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                <button type="button" className="btn btn-secondary mt-2" onClick={() => {
                                                    setNewPackage({ ...newPackage, availableDates: [...newPackage.availableDates, { startDate: '', endDate: '' }] });
                                                }}>
                                                    Add Date
                                                </button>
                                            </div>
                                            <div className="form-group">
                                                <label>Locations</label>
                                                {newPackage.locations.map((location, index) => (
                                                    <div key={index} className="d-flex">
                                                        <input
                                                            type="text"
                                                            className="form-control mr-2"
                                                            value={location}
                                                            onChange={(e) => {
                                                                const newLocations = [...newPackage.locations];
                                                                newLocations[index] = e.target.value;
                                                                setNewPackage({ ...newPackage, locations: newLocations });
                                                            }}
                                                            placeholder="Location"
                                                            required
                                                        />
                                                        <button type="button" className="btn btn-danger ml-2" onClick={() => {
                                                            const newLocations = newPackage.locations.filter((_, i) => i !== index);
                                                            setNewPackage({ ...newPackage, locations: newLocations });
                                                        }}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                <button type="button" className="btn btn-secondary mt-2" onClick={() => {
                                                    setNewPackage({ ...newPackage, locations: [...newPackage.locations, ''] });
                                                }}>
                                                    Add Location
                                                </button>
                                            </div>
                                            <div className="form-group">
                                                <label>Features</label>
                                                {newPackage.features.map((feature, index) => (
                                                    <div key={index} className="d-flex">
                                                        <input
                                                            type="text"
                                                            className="form-control mr-2"
                                                            value={feature}
                                                            onChange={(e) => {
                                                                const newFeatures = [...newPackage.features];
                                                                newFeatures[index] = e.target.value;
                                                                setNewPackage({ ...newPackage, features: newFeatures });
                                                            }}
                                                            placeholder="Feature"
                                                            required
                                                        />
                                                        <button type="button" className="btn btn-danger ml-2" onClick={() => {
                                                            const newFeatures = newPackage.features.filter((_, i) => i !== index);
                                                            setNewPackage({ ...newPackage, features: newFeatures });
                                                        }}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                <button type="button" className="btn btn-secondary mt-2" onClick={() => {
                                                    setNewPackage({ ...newPackage, features: [...newPackage.features, ''] });
                                                }}>
                                                    Add Feature
                                                </button>
                                            </div>
                                            <div className="form-group">
                                                <label>Itinerary</label>
                                                <textarea
                                                    className="form-control"
                                                    value={updateMode ? packageDetails.itinerary : newPackage.itinerary}
                                                    onChange={(e) => updateMode ? setPackageDetails({ ...packageDetails, itinerary: e.target.value }) : setNewPackage({ ...newPackage, itinerary: e.target.value })}
                                                    placeholder="Itinerary Details"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Status</label>
                                                <select
                                                    className="form-control"
                                                    value={updateMode ? packageDetails.status : newPackage.status}
                                                    onChange={(e) => updateMode ? setPackageDetails({ ...packageDetails, status: e.target.value }) : setNewPackage({ ...newPackage, status: e.target.value })}>
                                                    <option value="Available">Available</option>
                                                    <option value="Unavailable">Unavailable</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Images</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files);
                                                        setNewPackage({ ...newPackage, images: files });
                                                    }}
                                                    multiple
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Category</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={updateMode ? packageDetails.category : newPackage.category}
                                                    onChange={(e) => updateMode ? setPackageDetails({ ...packageDetails, category: e.target.value }) : setNewPackage({ ...newPackage, category: e.target.value })}
                                                    placeholder="Category ID"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalShow(false)}>Close</button>
                                    <button type="submit" className="btn btn-primary">{updateMode ? 'Update Package' : 'Create Package'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Packages;
