import { useState, useEffect } from 'react';
import axios from 'axios';
import './StarRating.css';

function StarRating({ bookId, onRatingSubmit }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [userRating, setUserRating] = useState(null);
    const [bookRatings, setBookRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    // Load book ratings and user's rating
    useEffect(() => {
        loadRatings();
        if (token) {
            loadUserRating();
        }
    }, [bookId, token]);

    const loadRatings = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/books/${bookId}/ratings`);
            setBookRatings(response.data.ratings || []);
            
            // Calculate average
            const ratings = response.data.ratings || [];
            if (ratings.length > 0) {
                const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
                setAverageRating((sum / ratings.length).toFixed(1));
                setTotalRatings(ratings.length);
            }
        } catch (error) {
            console.error('Error loading ratings:', error);
        }
    };

    const loadUserRating = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/books/${bookId}/user-rating`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (response.data.rating) {
                setUserRating(response.data.rating);
                setRating(response.data.rating.rating);
                setReview(response.data.rating.review || '');
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error loading user rating:', error);
            }
        }
    };

    const handleSubmitRating = async () => {
        if (!token) {
            alert('Silakan login terlebih dahulu untuk memberi rating');
            return;
        }

        if (rating === 0) {
            alert('Silakan pilih rating bintang terlebih dahulu');
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `http://localhost:8000/api/books/${bookId}/rating`,
                { rating, review },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert('Rating berhasil diberikan!');
            setShowReviewForm(false);
            loadRatings();
            loadUserRating();
            
            if (onRatingSubmit) {
                onRatingSubmit(rating);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            if (error.response?.status === 401) {
                alert('Sesi Anda telah berakhir. Silakan login kembali.');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                alert('Gagal memberikan rating');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (isInteractive = false) => {
        const stars = [];
        const displayRating = isInteractive ? (hoverRating || rating) : averageRating;

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`star ${isInteractive ? 'interactive' : ''} ${i <= displayRating ? 'filled' : ''}`}
                    viewBox="0 0 24 24"
                    fill={i <= displayRating ? '#f39c12' : 'none'}
                    stroke="#f39c12"
                    strokeWidth="2"
                    onMouseEnter={isInteractive ? () => setHoverRating(i) : undefined}
                    onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
                    onClick={isInteractive ? () => {
                        setRating(i);
                        setShowReviewForm(true);
                    } : undefined}
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className="star-rating-container">
            <div className="rating-summary">
                <div className="average-rating">
                    <span className="rating-number">{averageRating}</span>
                    <div className="stars-display">
                        {renderStars(false)}
                    </div>
                    <span className="total-ratings">({totalRatings} rating)</span>
                </div>
            </div>

            {token && (
                <div className="user-rating-section">
                    {userRating ? (
                        <div className="user-existing-rating">
                            <h4>Rating Anda:</h4>
                            <div className="stars-display">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <svg
                                        key={i}
                                        className="star"
                                        viewBox="0 0 24 24"
                                        fill={i <= userRating.rating ? '#f39c12' : 'none'}
                                        stroke="#f39c12"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                ))}
                            </div>
                            {userRating.review && (
                                <p className="user-review">"{userRating.review}"</p>
                            )}
                            <button
                                className="btn-secondary"
                                onClick={() => setShowReviewForm(true)}
                            >
                                Ubah Rating
                            </button>
                        </div>
                    ) : (
                        <div className="user-new-rating">
                            <h4>Beri Rating:</h4>
                            <div className="stars-interactive">
                                {renderStars(true)}
                            </div>
                        </div>
                    )}

                    {showReviewForm && (
                        <div className="review-form">
                            <h4>Rating Anda: {rating} bintang</h4>
                            <textarea
                                placeholder="Tulis ulasan Anda (opsional)..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows="4"
                            />
                            <div className="form-actions">
                                <button
                                    className="btn-primary"
                                    onClick={handleSubmitRating}
                                    disabled={loading}
                                >
                                    {loading ? 'Menyimpan...' : 'Kirim Rating'}
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={() => setShowReviewForm(false)}
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!token && (
                <p className="login-prompt">
                    <a href="/login">Login</a> untuk memberi rating
                </p>
            )}

            {bookRatings.length > 0 && (
                <div className="reviews-section">
                    <h3>Ulasan ({bookRatings.length})</h3>
                    {bookRatings.map((r, index) => (
                        <div key={index} className="review-item">
                            <div className="review-header">
                                <strong>{r.user.name}</strong>
                                <div className="stars-display small">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg
                                            key={i}
                                            className="star"
                                            viewBox="0 0 24 24"
                                            fill={i <= r.rating ? '#f39c12' : 'none'}
                                            stroke="#f39c12"
                                            strokeWidth="2"
                                        >
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            {r.review && <p className="review-text">{r.review}</p>}
                            <span className="review-date">
                                {new Date(r.created_at).toLocaleDateString('id-ID')}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StarRating;
