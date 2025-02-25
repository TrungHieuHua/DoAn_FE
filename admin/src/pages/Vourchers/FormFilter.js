import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
function FormFilter({ Add, search }) {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleFromDateChange = (event) => {
        setFromDate(event.target.value);
    };
    const handleToDateChange = (event) => {
        setToDate(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const dateFrom = new Date(fromDate);
        const dateTo = new Date(toDate);
        const isoStringFrom = dateFrom.toISOString();
        const isoStringTo = dateTo.toISOString();
        search(isoStringFrom, isoStringTo);
    };

    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group controlId="name">
                        <Form.Label>Từ ngày</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Enter name"
                            value={fromDate}
                            onChange={handleFromDateChange}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="name">
                        <Form.Label>Đến ngày</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Enter name"
                            value={toDate}
                            onChange={handleToDateChange}
                        />
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
                        Thêm Vourcher
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default FormFilter;
