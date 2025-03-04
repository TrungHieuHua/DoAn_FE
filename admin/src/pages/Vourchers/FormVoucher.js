import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Button, Form, Modal, Image, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import styles from './Vourchers.module.scss';
import { create, getbyid, update } from '~/ultils/services/voucherService';
import { getCookie } from '~/ultils/cookie';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function FormVoucher({ onClose, onSuccess, title, id }) {
    const [image, setImage] = useState('');
    const [code, setCode] = useState('');
    const [value, setValue] = useState('');
    const [quantity, setQuantity] = useState('');
    const [maxMoney, setMaxMoney] = useState('');
    const [expiredTime, setExpiredTime] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Cập nhật mô tả dựa trên giá trị và số tiền tối đa
    useEffect(() => {
        if (value && maxMoney) {
            setDescription(
                `Giảm giá ${value}% tối đa ${new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(maxMoney)}`,
            );
        } else {
            setDescription(''); // Nếu chưa nhập đủ, để trống mô tả
        }
    }, [value, maxMoney]);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const response = await getbyid(id);

                if (response.statusCode === 200) {
                    const data = response.data;
                    setCode(data.code);
                    setValue(data.value);
                    setQuantity(data.quantity);
                    setMaxMoney(data.maxMoney);
                    setImage(data.image);
                    const date = new Date(data.expiredTime);
                    const formattedDate = date.toISOString().split('T')[0];
                    setExpiredTime(formattedDate);
                    setDescription(data.description); // Load mô tả nếu có
                } else {
                    // handle error
                }
            }
        };
        fetchData();
    }, [id]);

    function handleCodeChange(event) {
        setCode(event.target.value);
    }

    function handleValueChange(event) {
        setValue(event.target.value);
    }

    function handleQuantityChange(event) {
        setQuantity(event.target.value);
    }

    function handleMaxMoneyChange(event) {
        setMaxMoney(event.target.value);
    }

    function handleExpiredTimeChange(event) {
        setExpiredTime(event.target.value);
    }

    function handleDescriptionChange(value) {
        setDescription(value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (id) {
            const data = {
                id: id,
                code: code,
                value: value,
                quantity: quantity,
                maxMoney: maxMoney,
                expiredTime: expiredTime,
                description: description,
                img: image,
            };
            const updateData = async () => {
                const fetchAPI = await update(data);
                if (fetchAPI.data.statusCode === 204 || fetchAPI.data.statusCode === 201) {
                    toast.success(fetchAPI.data.message);
                }
                if (fetchAPI.data.statusCode === 409) {
                    toast.error('Mã voucher đã tồn tại');
                }
                onSuccess(fetchAPI.data.statusCode);
            };
            updateData();
        } else {
            const data = {
                code: code,
                value: value,
                quantity: quantity,
                maxMoney: maxMoney,
                expiredTime: expiredTime,
                description: description,
                img: image,
            };
            const postData = async () => {
                try {
                    const fetchAPI = await create(data);
                    if (fetchAPI.data.statusCode === 204 || fetchAPI.data.statusCode === 201) {
                        toast.success(fetchAPI.data.message);
                    }
                    if (fetchAPI.data.statusCode === 409) {
                        toast.error('Mã voucher đã tồn tại');
                    }
                    onSuccess(fetchAPI.data.statusCode);
                } catch (e) {
                    console.log(e);
                }
            };
            postData();
        }
        onClose();
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        // Send the file to the API
        fetch('http://localhost:8080/api/v1/uploads', {
            method: 'POST',
            body: formData, // FormData handles the `multipart/form-data` headers automatically
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Failed to upload image');
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.data) {
                    throw new Error('Unexpected response format');
                }
                setImage(data.data); // Assuming `data.data` contains the image URL
            })
            .catch((error) => {
                console.error('Error uploading image:', error.message);
                alert(`Upload failed: ${error.message}`);
            })
            .finally(() => {
                setIsUploading(false);
            });
    }

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="form" onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Mã Voucher</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập mã voucher..."
                            value={code}
                            onChange={handleCodeChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Giá trị (%)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Nhập giá trị..."
                            value={value}
                            onChange={handleValueChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Nhập số lượng..."
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Giảm tối đa</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Nhập số tiền giảm tối đa..."
                            value={maxMoney}
                            onChange={handleMaxMoneyChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Hết hạn</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Nhập thời gian hết hạn..."
                            value={expiredTime}
                            onChange={handleExpiredTimeChange}
                        />
                    </Form.Group>
                    {image && (
                        <div className="mb-3">
                            <Image src={image} alt="Uploaded" thumbnail />
                        </div>
                    )}
                    <Form.Group controlId="image">
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} />
                        {isUploading && (
                            <div className="mt-2">
                                <Spinner animation="border" size="sm" role="status" />
                                <span className="ms-2">Đang tải lên...</span>
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>Mô tả</Form.Label>
                        <ReactQuill value={description} onChange={handleDescriptionChange} placeholder="Nhập mô tả" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
                <Button onClick={handleSubmit} variant="primary" type="submit" disabled={isUploading}>
                    {id ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormVoucher;
