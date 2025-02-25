import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Button, Form, Image, Modal, Spinner } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { v4 } from 'uuid';
import styles from './Products.module.scss';
import { getbyid, createdetail, updatedetail, getdetailbyid } from '~/ultils/services/productService';
import { toast } from 'react-toastify';

import { colorPalette } from '~/config/colorPalette';

const cx = classNames.bind(styles);

function FormCreateProductDetail({ onClose, title, onSuccess, id, idDetail = '' }) {
    const [titlex, setTitlex] = useState('');
    const [image, setImage] = useState('');
    const [color, setColor] = useState('#ffffff'); // Set default to white
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await getbyid(id);
                    if (response.statusCode === 200) {
                        setTitlex(response.data.name);
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            fetchData();
        }

        if (idDetail) {
            const fetchData = async () => {
                try {
                    const response = await getdetailbyid(idDetail);
                    if (response.statusCode === 200) {
                        setColor(response.data.color); // Set color from response
                        setSize(response.data.size);
                        setQuantity(response.data.quantity);
                        setPrice(response.data.price);
                        setImage(response.data.img);
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            fetchData();
        }
    }, [id, idDetail]);

    function handleColorChange(colorValue) {
        setColor(colorValue);
    }

    function handleSizeChange(event) {
        setSize(event.target.value);
    }

    function handleQuantityChange(event) {
        setQuantity(event.target.value);
    }

    function handlePriceChange(event) {
        setPrice(event.target.value);
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

    function handleSubmit(event) {
        event.preventDefault();
        if (!color || !size || !quantity || !price) {
            alert('Vui lòng nhập đủ thông tin màu sắc, size, số lượng, giá bán');
            return;
        }

        const data = {
            id: idDetail,
            productId: id,
            size: size,
            color: color,
            price: price,
            quantity: quantity,
            image: image,
        };

        const fetchAPI = async () => {
            try {
                if (id && !idDetail) {
                    // Create product detail
                    const response = await createdetail(data);
                    if (response.data.statusCode === 201) {
                        toast.success(response.data.message);
                    }
                    onSuccess(response.data.statusCode);
                }

                if (id && idDetail) {
                    // Update product detail
                    const response = await updatedetail(data);
                    if (response.statusCode === 204) {
                        toast.success(response.message);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchAPI();

        onClose();
    }

    const shoeSizes = [
        { size: 36, description: 'Small size, suitable for kids or women with small feet' },
        { size: 37, description: 'Small size' },
        { size: 38, description: 'Small to medium size' },
        { size: 39, description: 'Medium size, most common size for women' },
        { size: 40, description: 'Medium size, common size for women' },
        { size: 41, description: 'Medium size, common size for men' },
        { size: 42, description: 'Large size, suitable for men with average feet' },
        { size: 43, description: 'Large size, suitable for men with large feet' },
        { size: 44, description: 'Large size, often for men' },
        { size: 45, description: 'Very large size, suitable for men with very large feet' },
    ];

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} className="form">
                    <Form.Group controlId="title">
                        <Form.Label>Tên Sản Phẩm</Form.Label>
                        <p>{titlex}</p>
                    </Form.Group>
                    <Form.Group controlId="category">
                        <Form.Label>Màu sắc</Form.Label>
                        <div
                            className="color-palette"
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '0px' }}
                        >
                            {Object.keys(colorPalette).map((key) => (
                                <div
                                    title={colorPalette[key].name}
                                    key={key}
                                    className="color-box"
                                    style={{
                                        backgroundColor: colorPalette[key].rgb,
                                        width: '40px',
                                        height: '40px',
                                        margin: '5px',
                                        cursor: 'pointer',
                                        border: `2px solid ${
                                            color === colorPalette[key].rgb ? '#000' : 'rgba(0, 0, 0, 0.2)'
                                        }`,
                                        borderRadius: '5000px',
                                        boxShadow:
                                            color === colorPalette[key].rgb ? '0 0 5px rgba(0, 0, 0, 0.9)' : 'none',
                                    }}
                                    onClick={() => handleColorChange(colorPalette[key].rgb)}
                                ></div>
                            ))}
                        </div>
                    </Form.Group>
                    <Form.Group controlId="procedure">
                        <Form.Label>Size</Form.Label>
                        <Form.Control as="select" value={size} onChange={handleSizeChange}>
                            <option value="">Chọn Size</option>
                            {shoeSizes.map((sizeOption) => (
                                <option key={v4()} value={sizeOption.size}>
                                    {sizeOption.size}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="quantity">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control type="number" value={quantity} onChange={handleQuantityChange} />
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control type="number" value={price} onChange={handlePriceChange} />
                    </Form.Group>
                    {image && (
                        <div className="mb-3">
                            <br />
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isUploading}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormCreateProductDetail;
