import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { v4 } from 'uuid';

import { getall } from '~/ultils/services/categoriesService';

function FormFilter({ Add, search }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchAPI = async () => {
            const response = await getall('', '');
            setCategories(response.data);
        };
        fetchAPI();
    }, []);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        search(name, category, status);
    };

    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" value={name} onChange={handleNameChange} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="status">
                        <Form.Label>Danh Mục</Form.Label>
                        <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                            <option value="">All</option>
                            {categories.map((item) => {
                                return item.type === '1' ? (
                                    <option key={v4()} value={item.id}>
                                        {item.name}
                                    </option>
                                ) : null;
                            })}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control as="select" value={status} onChange={handleStatusChange}>
                            <option value="">All</option>
                            <option value="1">Enable</option>
                            <option value="0">Disable</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" onClick={handleSubmit}>
                        Tìm kiếm
                    </Button>
                </Col>
                <Col>
                    <Button variant="success" onClick={Add}>
                        Thêm Bài Viết
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default FormFilter;
