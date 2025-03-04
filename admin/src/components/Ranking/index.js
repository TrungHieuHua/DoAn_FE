import classNames from 'classnames/bind';

import RankingItem from './RankingItem';
import styles from './Ranking.module.scss';

import { topprice } from '~/ultils/services/userService';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Ranking() {
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState('');
    useEffect(() => {
        setTitle(`Top mua hàng tháng ${new Date().getMonth() + 1}`);
        const fetchData = async () => {
            const response = await topprice();
            if (response.status === 'success') {
                setUsers(response.data);
            } else {
                setUsers([]);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>{title}</div>
            <div className={cx('children')}>
                <div>
                    <p>#</p>
                    <p>User Name</p>
                    <p>Tổng Tiền</p>
                </div>
                <div>
                    {users.map((data, index) => {
                        return (
                            <RankingItem
                                key={index}
                                top={index + 1}
                                user={data.username}
                                price={new Intl.NumberFormat('vi-VN').format(data.total_amount) + 'đ'}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Ranking;
