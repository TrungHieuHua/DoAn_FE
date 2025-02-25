import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import FormInput from '~/components/AuthForm/FormInput';
import { getProfile, update } from '~/ultils/services/userService';
import { getCookie } from '~/ultils/cookie';
import Button from '~/components/Button';

import styles from './Profile.module.scss';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Profile() {
    const [user, setUser] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        birthDay: '1970-01-01',
        address: '',
        avatar: '',
        password: '',
    });
    const [error, setError] = useState(null);

    const handleDeleteImg = () => {
        setUser((prevUser) => ({ ...prevUser, avatar: images.noImage }));
    };

    const handleUpdateAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        // Send the file to the API
        fetch('http://localhost:8080/api/v1/uploads', {
            method: 'POST',
            body: formData, // FormData handles the `multipart/form-data` headers automatically
        })
            .then((response) => {
                if (!response.ok) {
                    // Extract error message from response if possible
                    return response.json().then((errorData) => {
                        toast.error(errorData.message || 'Failed to upload image');
                        throw new Error(errorData.message || 'Failed to upload image');
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.data) {
                    toast.error('Unexpected response format');
                    throw new Error('Unexpected response format');
                }

                setUser((prevUser) => ({ ...prevUser, avatar: data.data }));
            })
            .catch((error) => {
                console.error('Error uploading image:', error.message);
                toast.error(`Upload failed: ${error.message}`);
            });
    };

    const handleUpdateUser = async () => {
        try {
            setError(null);
            const data = {
                id: user.id,
                username: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                birthday: user.birthDay,
                email: user.email,
                address: user.address,
                avatar: user.avatar,
                role: user.role,
            };
            const response = await update(data);
            if (response.statusCode === 204) {
                toast.success('Sửa thông tin thành công!');
                setError(null);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const response = await getProfile(1);
                if (response.statusCode === 200) {
                    const data = response.data;
                    setUser({
                        id: data.id,
                        userName: data.username,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        birthDay: data.birthday,
                        email: data.email,
                        address: data.address,
                        avatar: data.avatar,
                        // password: data.password,
                    });
                    setError(null);
                }
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left')}>
                <div className={cx('avatar')}>
                    <img src={user.avatar} alt="avatar" />
                    <div className={cx('img-action')}>
                        <div onClick={handleDeleteImg}>Xóa</div>
                        <div>
                            <label htmlFor="avatar-input">Thay đổi</label>
                            <input type="file" id="avatar-input" onChange={handleUpdateAvatar} />
                        </div>
                    </div>
                </div>
                <div>Username: {user.userName}</div>
            </div>

            <div className={cx('right')}>
                <h3>Thông tin cá nhân</h3>
                <div className={cx('form')}>
                    <FormInput
                        type="text"
                        label="Họ"
                        value={user.lastName || ''}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, lastName: e.target.value }));
                        }}
                    />
                    <FormInput
                        type="text"
                        label="Tên"
                        value={user.firstName || ''}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, firstName: e.target.value }));
                        }}
                    />
                    <FormInput
                        type="text"
                        label="Email"
                        value={user.email || ''}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, email: e.target.value }));
                        }}
                    />
                    <FormInput
                        type="text"
                        label="Địa chỉ"
                        value={user.address || ''}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, address: e.target.value }));
                        }}
                    />

                    <FormInput
                        type="date"
                        label="Ngày sinh"
                        value={user.birthDay}
                        onChange={(e) => {
                            setUser((prevUser) => ({ ...prevUser, birthDay: e.target.value }));
                        }}
                    />
                </div>
                <Button primary onClick={handleUpdateUser}>
                    Sửa thông tin
                </Button>
            </div>
        </div>
    );
}

export default Profile;
