import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 } from 'uuid';

import { getCookie } from '~/ultils/cookie';
import { create, update, getbyid } from '~/ultils/services/eventsService';
import { getall } from '~/ultils/services/categoriesService';

function FormEvent({ onClose, onSuccess, title, id }) {
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchCate = async () => {
            try {
                const response = await getall('', '');
                if (response.status === 'success') {
                    setCategories(response.data);
                } else {
                    setCategories([]);
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchCate();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const response = await getbyid(id);
                const oldData = response.data[0];
                setImage(oldData.image_event);
                setCategory(oldData.category_id);
                setDescription(oldData.description);
            };
            fetchData();
        }
    }, []);

    function handleImageChange(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImage(reader.result);
        };
    }

    function handleDescriptionChange(value) {
        setDescription(value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!category || !image) {
            alert('Vui nhập đủ thông tin danh mục và hình ảnh');
            return;
        }
        if (id) {
            const data = {
                id: id,
                category_id: category,
                image_event: image,
                description: description ? description : '',
            };
            const updateData = async () => {
                try {
                    const fetchAPI = await update(data);
                    onSuccess(fetchAPI.data.status);
                } catch (e) {
                    console.log(e);
                }
            };
            updateData();
        } else {
            const data = {
                admin_id: getCookie('login').id,
                category_id: category,
                image_event: image,
                description: description,
            };
            const postData = async () => {
                try {
                    const fetchAPI = await create(data);
                    onSuccess(fetchAPI.data.status);
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
                <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        as="select"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                        }}
                    >
                        <option value="">Chọn Danh Mục</option>
                        {categories.map((cate) =>
                            cate.type === '0' ? (
                                <option key={v4()} value={cate.id}>
                                    {cate.name}
                                </option>
                            ) : null,
                        )}
                    </Form.Control>
                </Form.Group>
                <Form onSubmit={handleSubmit} className="form">
                    <Form.Group controlId="formImage">
                        <Form.Label>Hình ảnh</Form.Label>
                        {id && <img src={image} alt={description} className="img-form" />}
                        <Form.Control type="file" onChange={handleImageChange} />
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
                <Button variant="primary" onClick={handleSubmit}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormEvent;
