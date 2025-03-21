import classNames from 'classnames/bind';
import React from 'react';

import styles from './Product.module.scss';
import Ellipsis from '~/components/Ellipsis';
import { deleted,updateIsDelete,getbyid  } from '~/ultils/services/productService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Product({ props, onEventDeleted, onUpdate, onCreateDetail, onShowDetail }) {
    const formatPrice = new Intl.NumberFormat('vi-VN').format(props.priceRange);

    const handleDelete = async () => {
        try {
            const response = await deleted(props.id);
            if (response.statusCode === 204) {
                toast.success(response.message);
                if (onEventDeleted) {
                    onEventDeleted(props.id);
                }
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi xóa sản phẩm');
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra khi xóa sản phẩm');
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await updateIsDelete(props);
            if (response.statusCode === 201) {
                toast.success(response.message);
                if (onEventDeleted) {
                    onEventDeleted(props.id);
                }
            } else {
                toast.error(response.message || 'Có lỗi xảy ra khi khôi phục sản phẩm');
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra khi khôi phục sản phẩm');
        }
    };

    const handleDeleteConfirmation = () => {
        if (!props.isDeleted) {
            if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
                handleDelete();
            }
        } else {
            if (window.confirm('Bạn có chắc chắn muốn khôi phục sản phẩm này không?')) {
                handleUpdate();
            }
        }
    };

    const menu = [
        {
            title: 'Thêm chi tiết',
            onClick: onCreateDetail,
        },
        {
            title: 'Xem chi tiết',
            onClick: onShowDetail,
        },
        {
            title: 'Sửa',
            onClick: onUpdate,
        },
        {
            title: props.isDeleted ? 'Khôi phục' : 'Xóa',
            onClick: handleDeleteConfirmation,
        },
    ];

    return (
        <div className={cx('wrapper')} title={props.name}>
            <Ellipsis menu={menu} />
            <div className={cx('img')}>
                <img src={props.img} alt={props.name} />
            </div>
            <div className={cx('info')}>
                <p>{props.name}</p>
                <p>Giá: {formatPrice}đ</p>
                <div className={cx('info-more')}>
                    <div className={cx('left-info')}>
                        <p className={cx('color-list')}>
                            <span>Màu sắc:</span>
                            {props.productDetailResponseList.map((value) => (
                                <span className={cx('color')} style={{ background: `${value.color}` }}></span>
                            ))}
                        </p>
                    </div>
                    <div className={cx('right-info')}>
                        {props.isDeleted ? (
                            <p style={{ color: 'red' }}>Đã xóa</p>
                        ) : (
                            <p style={{ color: 'green' }}>Đang bán</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;
