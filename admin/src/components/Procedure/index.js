import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Procedure.module.scss';
import images from '~/assets/images';
import Ellipsis from '~/components/Ellipsis';
import { deleted } from '~/ultils/services/proceduresService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Procedure({ props, onEventDeleted, onUpdate }) {
    const bg = props.type === '0' ? images.bgProduct : images.bgArticles;
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await deleted(props.id);
            if (response.statusCode === 204) {
                toast.success(response.message);
            }
            onEventDeleted(props.id); // Notify parent component of deleted event
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteConfirmation = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này không?')) {
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

    return (
        <div className={cx('wrapper')}>
            <Ellipsis menu={menu} />
            {props.avatar ? (
                <div className={cx('img')}>
                    <img src={props.avatar} alt={props.name} />
                </div>
            ) : (
                <div className={cx('img')}>
                    <img src={props.img} alt={props.name} />
                </div>
            )}
            <div className={cx('info')}>
                <p>{props.name}</p>
                <p>Tạo bởi: {props.createdBy}</p>
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

export default Procedure;
