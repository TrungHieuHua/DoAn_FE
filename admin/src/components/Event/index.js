import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from './Event.module.scss';
import Ellipsis from '~/components/Ellipsis';
import { deleted } from '~/ultils/services/eventsService';

const cx = classNames.bind(styles);

function Event({ props, onEventDeleted, onUpdate }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await deleted(props.id);
            onEventDeleted(props.id); // Notify parent component of deleted event
        } catch (error) {
            console.log(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteConfirmation = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) {
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
        <div className={cx('wrapper')} style={{ background: `url(${props.image_event})`, backgroundSize: 'cover' }}>
            <Ellipsis menu={menu} />
            <div className={cx('info')}>
                <p>{props.description}</p>
                <p>Created by admin_id: {props.admin_id}</p>
                <p>Category_id: {props.category_id}</p>
            </div>
        </div>
    );
}

export default Event;
