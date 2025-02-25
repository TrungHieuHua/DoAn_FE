import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 } from 'uuid';

import { getCookie } from '~/ultils/cookie';
import { getall } from '~/ultils/services/categoriesService';
import { create, update, getbyid } from '~/ultils/services/articlesService';

function FormArticles({ onClose, title, onSuccess, id }) {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [titlex, setTitlex] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');

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
            const fetchAPI = async () => {
                const response = await getbyid(id);
                const old_Data = response.data[0];
                setCategory(old_Data.category_id);
                setTitlex(old_Data.name);
                setDescription(old_Data.summary);
                setContent(old_Data.content);
                setStatus(old_Data.status);
                setImage(old_Data.avatar);
            };
            fetchAPI();
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

    function handleSubmit(event) {
        event.preventDefault();
        if (id) {
            const data = {
                id: id,
                category_id: category,
                name: titlex,
                summary: description,
                avatar: image,
                content: content,
                status: status,
            };
            if (!category || !titlex || !image) {
                alert('Vui lòng điền đủ thông tin danh mục, tên bài viết, hình ảnh');
                return;
            }
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
                name: titlex,
                summary: description,
                avatar: image,
                content: content,
                status: 1,
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
                <Form onSubmit={handleSubmit} className="form">
                    <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Chọn Danh Mục</option>
                            {categories.map((cate) =>
                                cate.type === '1' ? (
                                    <option key={v4()} value={cate.id}>
                                        {cate.name}
                                    </option>
                                ) : null,
                            )}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={titlex} onChange={(e) => setTitlex(e.target.value)} />
                    </Form.Group>
                    {id && (
                        <Form.Group controlId="status">
                            <Form.Label>Trạng Thái</Form.Label>
                            <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="0">Disable</option>
                                <option value="1">Enable</option>
                            </Form.Control>
                        </Form.Group>
                    )}
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formImage">
                        <Form.Label>Hình ảnh</Form.Label>
                        {id && <img src={image} alt={titlex} className="img-form" />}
                        <Form.Control type="file" onChange={handleImageChange} />
                    </Form.Group>
                    <Form.Group controlId="content">
                        <Form.Label>Content</Form.Label>
                        <ReactQuill
                            value={content}
                            onChange={(value) => {
                                console.log(typeof value);
                                setContent(value);
                            }}
                        />
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

export default FormArticles;
