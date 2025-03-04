import classNames from 'classnames/bind';
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { v4 } from 'uuid';
import styles from './Products.module.scss';
// import { getall } from '~/ultils/services/categoriesService';
import { getall } from '~/ultils/services/proceduresService';
import { getall as allCates } from '~/ultils/services/categoriesService';
const cx = classNames.bind(styles);
function FormFilter({ Add, search }) {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [procedures, setProcedures] = useState([]);
    const [procedure, setProcedure] = useState('');

    const [fromPrice, setFromPrice] = useState('');
    const [toPrice, setToPrice] = useState('');

    useEffect(() => {
        const fetchAPI = async () => {
            const response = await getall();
            setProcedures(response.result);
        };
        fetchAPI();
    }, []);

    useEffect(() => {
        const fetchAPI = async () => {
            const response = await allCates();
            setCategories(response.result);
        };
        fetchAPI();
    }, []);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };
    const handleProcedureChange = (event) => {
        setProcedure(event.target.value);
    };
    const handleFromPriceChange = (event) => {
        setFromPrice(event.target.value);
    };

    const handleToPriceChange = (event) => {
        setToPrice(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        search(name, toPrice, fromPrice, procedure, category);
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
                    <Row>
                        <div className={cx('searchSelect')}>
                            <Form.Group controlId="status">
                                <Form.Label>Nhà cung cấp</Form.Label>
                                <Form.Control as="select" value={procedure} onChange={handleProcedureChange}>
                                    <option value="">All</option>
                                    {procedures.map((item) => {
                                        return (
                                            <option key={v4()} value={item.id}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="status">
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                                    <option value="">All</option>
                                    {categories.map((item) => {
                                        return (
                                            <option key={v4()} value={item.id}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group controlId="status">
                        <Form.Label>Giá Từ</Form.Label>
                        <Form.Control type="number" value={fromPrice} onChange={handleFromPriceChange}></Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="status">
                        <Form.Label>Đến</Form.Label>
                        <Form.Control type="number" value={toPrice} onChange={handleToPriceChange}></Form.Control>
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
                        Thêm Sản Phẩm
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default FormFilter;
