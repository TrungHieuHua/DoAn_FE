import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Vourcher.module.scss';
import images from '~/assets/images';
import Ellipsis from '~/components/Ellipsis';
import { deleted } from '~/ultils/services/voucherService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Vourcher({ props, onEventDeleted, onUpdate }) {
    const bg = props.type === '0' ? images.bgProduct : images.bgArticles;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await deleted(props.id);
            if (response.statusCode === 204) {
                toast.success(response.message);
            }
            onEventDeleted(props.id);
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteConfirmation = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa voucher này không?')) {
            handleDelete();
        }
    };

    const menu = [
        {
            title: 'Chi tiết/ Sửa',
            onClick: onUpdate,
        },
        {
            title: 'Xóa',
            onClick: handleDeleteConfirmation,
        },
    ];

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className={cx('wrapper')}>
            <Ellipsis menu={menu} />
            {props.img ? (
                <div className={cx('img')}>
                    <img src={props.img} alt={props.name} />
                </div>
            ) : (
                <div className={cx('img')}>
                    <img src={props.img} alt={props.name} />
                </div>
            )}
            <div className={cx('info')}>
                <p>{props.code}</p>
                <p>Số lượng: {props.quantity}</p>
                <p>Hạn: {formatDate(props.expiredTime)}</p>
                <p>
                    Trạng Thái:
                    {props.isDeleted ? (
                        <span className="error"> Đã xóa</span>
                    ) : (
                        <span className="success"> Hoạt động</span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default Vourcher;
