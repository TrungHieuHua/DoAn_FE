import { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead } from '../../ultils/services/NotificationService';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import classNames from 'classnames/bind';
import styles from './Notification.module.scss';

const cx = classNames.bind(styles);
const SOCKET_URL = 'http://localhost:8080/ws';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    // Khởi tạo WebSocket connection
    useEffect(() => {
        let isSubscribed = true;
        
        const connectWebSocket = () => {
            const socket = new SockJS(SOCKET_URL);
            const stomp = Stomp.over(socket);

            stomp.connect({}, () => {
                if (!isSubscribed) return;
                
                console.log('WebSocket Connected');
                setStompClient(stomp);

                // Subscribe để nhận thông báo chung
                stomp.subscribe('/topic/admin/notification', (message) => {
                    if (!isSubscribed) return;
                    
                    try {
                        const newNotification = JSON.parse(message.body);
                        console.log('New notification received:', newNotification);
                        
                        // Thêm thông báo mới vào state
                        setNotifications(prev => [newNotification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                        
                        // Phát âm thanh thông báo
                        playNotificationSound();
                    } catch (error) {
                        console.error('Error processing notification:', error);
                    }
                });

                // Subscribe để nhận thông báo cá nhân (nếu cần)
                const userId = localStorage.getItem('userId'); // Hoặc lấy từ context/redux
                if (userId) {
                    stomp.subscribe(`/user/${userId}/queue/notifications`, (message) => {
                        if (!isSubscribed) return;
                        
                        try {
                            const newNotification = JSON.parse(message.body);
                            console.log('New personal notification received:', newNotification);
                            
                            setNotifications(prev => [newNotification, ...prev]);
                            setUnreadCount(prev => prev + 1);
                            playNotificationSound();
                        } catch (error) {
                            console.error('Error processing personal notification:', error);
                        }
                    });
                }
            }, (error) => {
                console.error('WebSocket connection error:', error);
                // Thử kết nối lại sau 5 giây nếu mất kết nối
                if (isSubscribed) {
                    setTimeout(connectWebSocket, 5000);
                }
            });

            return stomp;
        };

        const stomp = connectWebSocket();

        // Cleanup khi component unmount
        return () => {
            isSubscribed = false;
            if (stomp) {
                stomp.disconnect();
            }
        };
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await getNotifications();
            console.log('API Response:', response);
            
            if (response?.statusCode === 200 && Array.isArray(response?.data)) {
                setNotifications(response.data);
                setUnreadCount(response.data.filter(n => !n.read).length);
            } else {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDropdownToggle = (isOpen) => {
        setShow(isOpen);
        if (isOpen) {
            fetchNotifications();
        }
    };

    const handleNotificationClick = async (notificationId) => {
        try {
            const response = await markNotificationAsRead(notificationId);
            if (response?.statusCode === 200) {
                setNotifications(prevNotifications => 
                    prevNotifications.map(notification => 
                        notification.id === notificationId 
                            ? { ...notification, read: true }
                            : notification
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
                setShow(false);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    const playNotificationSound = () => {
        try {
            const audio = new Audio('/notification-sound.mp3');
            audio.play();
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }
    };

    const renderNotificationItems = () => {
        if (!Array.isArray(notifications)) {
            console.error('Notifications is not an array:', notifications);
            return <div className={cx('notification-item')}>Có lỗi xảy ra</div>;
        }

        return notifications.map((notification) => (
            <div
                key={notification.id}
                className={cx('notification-item', { 'unread': !notification.read })}
                onClick={() => handleNotificationClick(notification.id)}
            >
                <div className={cx('notification-content')}>
                    <div className={cx('notification-header')}>
                        <h6 className={cx('title')}>{notification.title}</h6>
                        {!notification.read && (
                            <span className={cx('unread-dot')}></span>
                        )}
                    </div>
                    <p className={cx('message')}>{notification.message}</p>
                    <div className={cx('notification-footer')}>
                        <small className={cx('time')}>
                            {formatDate(notification.createdAt)}
                        </small>
                        <small className={cx('type')}>
                            {notification.type === 'ORDER' ? 'Đơn hàng' : notification.type}
                        </small>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <Dropdown show={show} onToggle={handleDropdownToggle}>
            <Dropdown.Toggle 
                variant="link" 
                id="notification-dropdown" 
                className={cx('notification-toggle')}
            >
                <FaBell size={28} />
                {unreadCount > 0 && (
                    <span className={cx('badge')}>{unreadCount}</span>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu 
                className={cx('notification-menu')}
                align="end"
            >
                <div className={cx('notification-list')}>
                    {isLoading ? (
                        <div className={cx('notification-item')}>Đang tải thông báo...</div>
                    ) : notifications.length === 0 ? (
                        <div className={cx('notification-item')}>Không có thông báo mới</div>
                    ) : (
                        renderNotificationItems()
                    )}
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default Notification; 