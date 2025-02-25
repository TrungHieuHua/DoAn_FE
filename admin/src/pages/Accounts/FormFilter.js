import { useState } from 'react';
import { Form, Row, Button, Col } from 'react-bootstrap';

function FormFilter({ search }) {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');

    const [role, setRole] = useState('');

    const handelNameChange = (e) => {
        setName(e.target.value);
    };
    const handelStatusChange = (e) => {
        setStatus(e.target.value);
    };
    const handelRoleChange = (e) => {
        setRole(e.target.value);
    };
    const handelSubmit = (event) => {
        event.preventDefault();
        search(name, role);
    };
    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group controlId="id">
                        <Form.Label>Tìm kiếm</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập username hoặc email..."
                            value={name}
                            onChange={handelNameChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            {/* <br />
            <Row>
                <Form.Group controlId="status">
                    <Form.Label>Role</Form.Label>
                    <Form.Control as="select" value={role} onChange={handelRoleChange}>
                        <option value="">All</option>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </Form.Control>
                </Form.Group>
            </Row> */}
            <Row>
                <Col>
                    <Button variant="primary" onClick={handelSubmit}>
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default FormFilter;
