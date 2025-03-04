import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Article.module.scss';
import Ellipsis from '~/components/Ellipsis';
import { deleted } from '~/ultils/services/articlesService';

const cx = classNames.bind(styles);

function Article({ props, onEventDeleted, onUpdate }) {
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
        <div className={cx('wrapper')}>
            <Ellipsis menu={menu} />
            <div className={cx('img')}>
                <img src={props.avatar} alt={props.name} />
            </div>
            <div className={cx('info')}>
                <p>{props.name}</p>
                {props.status === '1' ? (
                    <p>
                        Trạng thái: <span style={{ color: 'green' }}>Đăng tải</span>
                    </p>
                ) : (
                    <p>
                        Trạng thái: <span style={{ color: 'red' }}>Ẩn</span>
                    </p>
                )}

                <p>{props.created_at}</p>
            </div>
        </div>
    );
}

export default Article;
