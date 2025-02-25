import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
function FormFilter({ Add, search }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        search(name, status);
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
                        {/* <Form.Label>Status</Form.Label>
                        <Form.Control as="select" value={status} onChange={handleStatusChange}>
                            <option value="">All</option>
                            <option value="1">Enable</option>
                            <option value="0">Disable</option>
                        </Form.Control> */}
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
                        Thêm Danh Mục
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default FormFilter;
