import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/MetaData';
import 'bootstrap/dist/css/bootstrap.min.css';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [updateMode, setUpdateMode] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/reviews');
                setReviews(res.data.reviews);
                setLoading(false);
            } catch (err) {
                setError('Error loading reviews');
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    useEffect(() => {
        if (id) {
            fetchReviewDetails(id);
        }
    }, [id]);

    const fetchReviewDetails = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/review/${id}`);
            setReview(res.data.review);
            setUpdateMode(true);
            setViewMode(false);
            setModalShow(true);
        } catch (err) {
            setError('Review not found');
        }
    };

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('comments', review.comments);
        review.images.forEach((image) => {
            formData.append('images', image);
        });
        try {
            const res = await axios.put(`http://localhost:5000/api/review/${review._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setReviews(reviews.map(r => (r._id === res.data.review._id ? res.data.review : r)));
            toast.success('Review updated successfully');
            setUpdateMode(false);
            setReview({});
            setModalShow(false);
        } catch (err) {
            setError('Error updating review');
        }
    };

    const handleDeleteReview = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/review/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
            toast.success('Review deleted successfully');
        } catch (err) {
            setError('Error deleting review');
        }
    };

    const handleViewReview = (rev) => {
        setReview(rev);
        setUpdateMode(false);
        setViewMode(true);
        setModalShow(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <MetaData title="Reviews" />
            <div className="container mt-5">
                <h1 className="mb-4">Reviews</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">User ID</th>
                            <th scope="col">Comments</th>
                            <th scope="col">Image</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(rev => (
                            <tr key={rev._id}>
                                <td>{rev.userID}</td>
                                <td>{rev.comments}</td>
                                <td>
                                    {rev.images[0] && (
                                        <img src={rev.images[0].url} alt="Review" style={{ width: '100px', height: '100px' }} />
                                    )}
                                </td>
                                <td>
                                    <button className="btn btn-info mr-2" onClick={() => handleViewReview(rev)}>View</button>
                                    <button className="btn btn-warning mr-2" onClick={() => fetchReviewDetails(rev._id)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteReview(rev._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for View/Edit Review */}
                <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden={!modalShow}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modalLabel">{viewMode ? 'View Review' : 'Edit Review'}</h5>
                                <button type="button" className="close" onClick={() => setModalShow(false)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleUpdateReview}>
                                <div className="modal-body">
                                    {viewMode ? (
                                        <>
                                            <div className="form-group">
                                                <label>Comments</label>
                                                <textarea
                                                    className="form-control"
                                                    value={review.comments}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Image</label>
                                                {review.images[0] && (
                                                    <img src={review.images[0].url} alt="Review" style={{ width: '100px', height: '100px' }} />
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="form-group">
                                                <textarea
                                                    className="form-control"
                                                    value={review.comments}
                                                    onChange={(e) => setReview({ ...review, comments: e.target.value })}
                                                    placeholder="Edit comments"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="file"
                                                    className="form-control-file"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files);
                                                        setReview({ ...review, images: files });
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
                                        <button type="submit" className="btn btn-primary">Update Review</button>
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

export default Reviews;
