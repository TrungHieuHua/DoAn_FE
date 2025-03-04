import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Modal.module.scss';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Modal({ show, onClose, onSubmit }) {
    const [reason, setReason] = useState('');

    // Do not render the modal if `show` is false
    if (!show) return null;

    // Handle click events on the overlay to close the modal
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains(cx('modal-overlay'))) {
            onClose();
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(reason);
            setReason(''); // Clear the reason after submission
        } else {
            toast.warn('Vui lòng nhập lý do hủy đơn hàng!');
        }
    };

    return (
        <div className={cx('modal-overlay')} onClick={handleOverlayClick}>
            <div className={cx('modal')}>
                <h3>Lý do hủy đơn hàng</h3>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do hủy đơn hàng..."
                ></textarea>
                <div className={cx('actions')}>
                    <button onClick={onClose}>Hủy</button>
                    <button onClick={handleSubmit}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
