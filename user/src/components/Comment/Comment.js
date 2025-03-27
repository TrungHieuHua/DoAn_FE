import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Button from '~/components/Button';
import { createFeedback, getFeedbacksByProductId } from '~/ultils/services/feedbackService';
import { isLogin, getUserId } from '~/ultils/cookie/checkLogin';
import styles from './Comment.module.scss';

const cx = classNames.bind(styles);

function Comment({ productId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        fetchComments();
    }, [productId]);

    const fetchComments = async () => {
        try {
            const response = await getFeedbacksByProductId(productId);
            if (response.statusCode === 200) {
                setComments(response.data.content || []);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Không thể tải bình luận');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isLogin()) {
            toast.error('Vui lòng đăng nhập để bình luận');
            return;
        }

        if (!newComment.trim()) {
            toast.error('Vui lòng nhập nội dung bình luận');
            return;
        }

        if (rating === 0) {
            toast.error('Vui lòng chọn đánh giá sao');
            return;
        }

        try {
            const data = {
                description: newComment,
                rating: rating,
                productId: Number(productId)
            };

            const response = await createFeedback(data);
            if (response.statusCode === 200) {
                toast.success('Bình luận thành công!');
                setNewComment('');
                setRating(0);
                fetchComments();
            } else {
                toast.error('Không thể đăng bình luận');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
            toast.error('Đã xảy ra lỗi khi đăng bình luận');
        }
    };

    const getRatingText = (rating) => {
        switch (rating) {
            case 1:
                return 'Rất tệ';
            case 2:
                return 'Tệ';
            case 3:
                return 'Bình thường';
            case 4:
                return 'Tốt';
            case 5:
                return 'Rất tốt';
            default:
                return 'Chọn đánh giá của bạn';
        }
    };

    return (
        <div className={cx('comment-section')}>
            <h2>Bình Luận</h2>
            <form onSubmit={handleSubmit} className={cx('comment-form')}>
                <div className={cx('rating-container')}>
                    <div className={cx('rating')}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className={cx('star-container')}>
                                <FontAwesomeIcon
                                    icon={faStar}
                                    className={cx('star', {
                                        active: star <= (hoveredRating || rating),
                                        hover: star <= hoveredRating,
                                    })}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                />
                            </div>
                        ))}
                    </div>
                    <span className={cx('rating-text')}>{getRatingText(hoveredRating || rating)}</span>
                </div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    required
                />
                <Button type="submit" primary>
                    Gửi Bình Luận
                </Button>
            </form>

            <div className={cx('comments-list')}>
                {comments.map((comment) => (
                    <div key={comment.id} className={cx('comment-item')}>
                        <div className={cx('comment-header')}>
                            <div className={cx('user-info')}>
                                <span className={cx('username')}>{comment.user?.username || 'Người dùng ẩn danh'}</span>
                                <div className={cx('rating')}>
                                    {[...Array(5)].map((_, index) => (
                                        <FontAwesomeIcon
                                            key={index}
                                            icon={faStar}
                                            className={cx('star', {
                                                active: index < (comment.rate || 0),
                                            })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <span className={cx('date')}>
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('vi-VN') : 'Không có ngày'}
                            </span>
                        </div>
                        <p className={cx('comment-content')}>{comment.description || 'Không có nội dung'}</p>
                    </div>
                ))}
                {comments.length === 0 && (
                    <div className={cx('no-comments')}>
                        <p>Chưa có bình luận nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment; 