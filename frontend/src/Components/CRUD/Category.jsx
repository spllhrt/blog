import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/MetaData';
import 'bootstrap/dist/css/bootstrap.min.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: '', images: [] });
    const [updateMode, setUpdateMode] = useState(false);
    const [viewMode, setViewMode] = useState(false); // New state for view mode
    const navigate = useNavigate();
    const { id } = useParams();
    const [modalShow, setModalShow] = useState(false); // State for controlling modal visibility

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories'); // Update to match the correct route
                setCategories(res.data.categories);
                setLoading(false);
            } catch (err) {
                setError('Error loading categories');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (id) {
            fetchCategoryDetails(id);
        }
    }, [id]);

    const fetchCategoryDetails = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/category/${id}`); // Update to match the correct route
            setCategory(res.data.category);
            setUpdateMode(true);
            setViewMode(false); // Reset view mode
            setModalShow(true); // Show modal when editing or viewing a category
        } catch (err) {
            setError('Category not found');
        }
    };

    const handleNewCategory = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newCategory.name);
        newCategory.images.forEach((image) => {
            formData.append('images', image);
        });
        try {
            const res = await axios.post('http://localhost:5000/api/admin/category/new', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }); // Update to match the correct route
            setCategories([...categories, res.data.category]);
            toast.success('Category created successfully');
            setNewCategory({ name: '', images: [] });
            setModalShow(false); // Hide modal after successful addition
        } catch (err) {
            setError('Error creating category');
        }
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', category.name);
        category.images.forEach((image) => {
            formData.append('images', image);
        });
        try {
            const res = await axios.put(`http://localhost:5000/api/admin/category/${category._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }); // Update to match the correct route
            setCategories(categories.map(cat => (cat._id === res.data.category._id ? res.data.category : cat)));
            toast.success('Category updated successfully');
            setUpdateMode(false);
            setCategory({});
            setModalShow(false); // Hide modal after successful update
        } catch (err) {
            setError('Error updating category');
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/category/${id}`); // Update to match the correct route
            setCategories(categories.filter(cat => cat._id !== id));
            toast.success('Category deleted successfully');
        } catch (err) {
            setError('Error deleting category');
        }
    };

    const handleViewCategory = (cat) => {
        setCategory(cat);
        setUpdateMode(false);
        setViewMode(true);
        setModalShow(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <MetaData title="Categories" />
            <div className="container mt-5">
                <h1 className="mb-4">Categories</h1>
                <button className="btn btn-primary mb-4" onClick={() => { setNewCategory({ name: '', images: [] }); setUpdateMode(false); setViewMode(false); setModalShow(true); }}>
                    Add New Category
                </button>
                {error && <div className="alert alert-danger">{error}</div>}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Category Name</th>
                            <th scope="col">Image</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id}>
                                <td>{cat.name}</td>
                                <td>
                                    {cat.images[0] && (
                                        <img src={cat.images[0]?.url} alt={cat.name} style={{ width: '100px', height: '100px' }} />
                                    )}
                                </td>
                                <td>
                                    <button className="btn btn-info mr-2" onClick={() => handleViewCategory(cat)}>View</button>
                                    <button className="btn btn-warning mr-2" onClick={() => { fetchCategoryDetails(cat._id); }}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteCategory(cat._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Add/Edit/View Category */}
                <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden={!modalShow}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{viewMode ? 'View Category' : (updateMode ? 'Edit Category' : 'Add New Category')}</h5>
                                <button type="button" className="close" onClick={() => setModalShow(false)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={updateMode ? handleUpdateCategory : handleNewCategory}>
                                <div className="modal-body">
                                    {viewMode ? (
                                        <>
                                            <div className="form-group">
                                                <label>Category Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={category.name}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Image</label>
                                                {category.images[0] && (
                                                    <img src={category.images[0]?.url} alt={category.name} style={{ width: '100px', height: '100px' }} />
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={updateMode ? category.name : newCategory.name}
                                                    onChange={(e) => updateMode ? setCategory({ ...category, name: e.target.value }) : setNewCategory({ ...newCategory, name: e.target.value })}
                                                    placeholder="Category Name"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="file"
                                                    className="form-control-file"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files);
                                                        if (updateMode) {
                                                            setCategory({ ...category, images: files });
                                                        } else {
                                                            setNewCategory({ ...newCategory, images: files });
                                                        }
                                                    }}
                                                    multiple
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalShow(false)}>Close</button>
                                    {!viewMode && (
                                        <button type="submit" className="btn btn-primary">
                                            {updateMode ? 'Update Category' : 'Add Category'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Categories;
