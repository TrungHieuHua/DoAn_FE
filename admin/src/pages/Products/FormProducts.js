import { useState, useEffect } from 'react';
import { Button, Form, Image, Modal, Spinner } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill'; // Import ReactQuill
import { v4 } from 'uuid';

import { getall } from '~/ultils/services/categoriesService';
import { getall as getallProce } from '~/ultils/services/proceduresService';
import { create, getbyid, update } from '~/ultils/services/productService';
import { getCookie } from '~/ultils/cookie';
import { toast } from 'react-toastify';

function FormProducts({ onClose, title, onSuccess, id }) {
    const [categories, setCategories] = useState([]);
    const [procedures, setProceDures] = useState([]);
    const [category, setCategory] = useState('');
    const [procedure, setProceDure] = useState('');
    const [titlex, setTitlex] = useState('');
    const [price, setPrice] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [image, setImage] = useState('');
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchCate = async () => {
            try {
                const response = await getall('', '');
                setCategories(response.result);
            } catch (e) {
                console.log(e);
            }
        };
        const fetchProce = async () => {
            try {
                const response = await getallProce('', '');
                setProceDures(response.result);
            } catch (e) {
                console.log(e);
            }
        };
        fetchCate();
        fetchProce();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await getbyid(id);

                    if (response.statusCode === 200) {
                        setCategory(response.data.category.id);
                        setProceDure(response.data.procedure.id);
                        setTitlex(response.data.name);
                        setStatus(response.data.isDeleted);
                        setPrice(response.data.priceRange);
                        setShortDescription(response.data.description);
                        setImage(response.data.img);
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            fetchData();
        }
    }, [id]);

    function handleCategoryChange(event) {
        setCategory(event.target.value);
    }

    function handleProcedureChange(event) {
        setProceDure(event.target.value);
    }

    function handleTitleChange(event) {
        setTitlex(event.target.value);
    }

    function handlePriceChange(event) {
        setPrice(event.target.value);
    }

    function handleShortDescriptionChange(value) {
        setShortDescription(value); // ReactQuill value change handler
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:8080/api/v1/uploads', {
            method: 'POST',
            body: formData,
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
                setImage(data.data);
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
        if (!category || !titlex || !price || !procedure) {
            alert('Vui lòng nhập đủ thông tin sản phẩm, tên sản phẩm, hình ảnh, giá bán');
            return;
        }
        const data = {
            id: id,
            category_id: category,
            procedure_id: procedure,
            title: titlex,
            avatar: image,
            price: price,
            description: shortDescription,
            status: status,
        };
        const fetchAPI = async () => {
            try {
                const response = id ? await update(data) : await create(data);
                console.log(response);
                if (response.statusCode === 201 || response.statusCode === 204 || response.statusCode === 200) {
                    toast.success(response.message);
                }
                onSuccess(response.statusCode);
            } catch (e) {
                console.log(e);
            }
        };
        fetchAPI();

        onClose();
    }

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} className="form">
                    <Form.Group controlId="title">
                        <Form.Label>Tên Sản Phẩm</Form.Label>
                        <Form.Control type="text" value={titlex} onChange={handleTitleChange} />
                    </Form.Group>
                    <Form.Group controlId="category">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                            <option value="">Chọn Danh Mục</option>
                            {categories.map((cate) => (
                                <option key={v4()} value={cate.id}>
                                    {cate.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="procedure">
                        <Form.Label>Nhà cung cấp</Form.Label>
                        <Form.Control as="select" value={procedure} onChange={handleProcedureChange}>
                            <option value="">Chọn Nhà Cung Cấp</option>
                            {procedures.map((proce) => (
                                <option key={v4()} value={proce.id}>
                                    {proce.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="price">
                        <Form.Label>Mức giá</Form.Label>
                        <Form.Control type="number" value={price} onChange={handlePriceChange} />
                    </Form.Group>

                    <Form.Group controlId="shortDescription">
                        <Form.Label>Mô tả</Form.Label>
                        <ReactQuill value={shortDescription} onChange={handleShortDescriptionChange} theme="snow" />
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
                    {id ? 'Cập nhật' : 'Lưu'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormProducts;
