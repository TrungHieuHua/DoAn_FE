import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './Cards.module.scss';
import Card from './Card';
import { faMoneyBill, faTruck, faUser } from '@fortawesome/free-solid-svg-icons';

import { count as countUser } from '~/ultils/services/userService';
import { count as countOrder } from '~/ultils/services/OrdersService';

const cx = classNames.bind(styles);

function Cards() {
    const [countUsers, setCountUsers] = useState({
        today_count: 0,
        yesterday_count: 0,
    });
    const [countOrders, setCountOrders] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await countUser();
            setCountUsers(response.data);
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const response = await countOrder();
            setCountOrders(response.data);
        };
        fetchData();
    }, []);

    const data = [
        {
            title: 'Users',
            color: {
                backgroundColor: 'linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)',
                boxShadow: '0px 10px 20px 0px #e0c6f5',
            },
            barValue:
                parseInt(countUsers.yesterday_count) === 0 && parseInt(countUsers.today_count) === 0
                    ? '0'
                    : (countUsers.today_count / countUsers.yesterday_count) * 100,
            value: new Intl.NumberFormat('vi-VN').format(countUsers.today_count),
            Icon: faUser,
        },
        {
            title: 'Sales',
            color: {
                backgroundColor: 'linear-gradient(180deg, #ff919d 0%, #fc929d 100%)',
                boxShadow: '0px 10px 20px 0px #fdc0d7',
            },
            barValue:
                (parseInt(countOrders.today_total_amount) === 0 && parseInt(countOrders.yesterday_total_amount)) === 0
                    ? '0'
                    : (
                          (parseInt(countOrders.today_total_amount) / parseInt(countOrders.yesterday_total_amount)) *
                          100
                      ).toFixed(2),
            value: new Intl.NumberFormat('vi-VN').format(countOrders.today_total_amount) + 'đ',
            Icon: faMoneyBill,
        },
        {
            title: 'Order',
            color: {
                backgroundColor: 'linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)',
                boxShadow: '0px 10px 20px 0px #f9d59b',
            },
            barValue:
                (parseInt(countOrders.today_order_count) === 0 && parseInt(countOrders.yesterday_order_count)) === 0
                    ? '0'
                    : (
                          (parseInt(countOrders.today_order_count) / parseInt(countOrders.yesterday_order_count)) *
                          100
                      ).toFixed(2),
            value: new Intl.NumberFormat('vi-VN').format(countOrders.today_order_count),
            Icon: faTruck,
        },
    ];

    return (
        <div className={cx('wrapper')}>
            {data.map((card, id) => {
                return (
                    <div key={id} className={cx('parent')}>
                        <Card
                            title={card.title}
                            color={card.color}
                            barValue={card.barValue}
                            value={card.value}
                            img={card.Icon}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default Cards;
