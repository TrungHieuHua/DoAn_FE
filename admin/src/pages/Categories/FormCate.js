import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Button, Form, Modal, Image, Spinner } from 'react-bootstrap';
import styles from './Categories.module.scss';
import { create, getbyid, update } from '~/ultils/services/categoriesService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function FormCate({ onClose, onSuccess, title, id }) {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const response = await getbyid(id);

                if (response.statusCode === 200) {
                    const data = response.data;
                    setName(data.name);
                    setImage(data.img);
                } else {
                    // handle error
                }
            }
        };
        fetchData();
    }, [id]);

    function handleNameChange(event) {
        setName(event.target.value);
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
        if (isUploading) return; // Prevent submission while uploading

        if (id) {
            const data = {
                id: id,
                name: name,
                image: image,
            };
            const updateData = async () => {
                const fetchAPI = await update(data);
                if (fetchAPI.data.statusCode === 204 || fetchAPI.data.statusCode === 201) {
                    toast.success(fetchAPI.data.message);
                }
                if (fetchAPI.data.statusCode === 409) {
                    toast.error('Tên danh mục đã tồn tại');
                }
                onSuccess(fetchAPI.data.statusCode);
            };
            updateData();
        } else {
            const data = {
                name: name,
                image: image,
            };
            const postData = async () => {
                try {
                    const fetchAPI = await create(data);
                    if (fetchAPI.data.statusCode === 204 || fetchAPI.data.statusCode === 201) {
                        toast.success(fetchAPI.data.message);
                    }
                    if (fetchAPI.data.statusCode === 409) {
                        toast.error('Tên danh mục đã tồn tại');
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

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="form" onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Tên danh mục</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên danh mục"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Form.Group>

                    {image && (
                        <div className="mb-3">
                            <br />
                            <Image src={image} alt="Uploaded" thumbnail />
                        </div>
                    )}

                    <Form.Group controlId="image">
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control type="file" onChange={handleImageChange} disabled={isUploading} />
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
                <Button variant="secondary" onClick={onClose} disabled={isUploading}>
                    Đóng
                </Button>
                <Button onClick={handleSubmit} variant="primary" type="submit" disabled={isUploading}>
                    {id ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormCate;
