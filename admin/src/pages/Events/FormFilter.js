import { useEffect, useState } from 'react';
import { Form, Row, Button, Col, FormLabel } from 'react-bootstrap';
import { v4 } from 'uuid';

import { getall } from '~/ultils/services/categoriesService';

function FormFilter({ Add, search }) {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchAPI = async () => {
            const response = await getall('', '');
            setCategories(response.data);
        };
        fetchAPI();
    }, []);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };
    const handelSubmit = (event) => {
        event.preventDefault();
        search(category);
    };
    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group controlId="status">
                        <Form.Label>Danh Mục</Form.Label>
                        <Form.Control as="select" value={category} onChange={handleCategoryChange}>
                            <option value="">All</option>
                            {categories.map((item) => {
                                return item.type === '0' ? (
                                    <option key={v4()} value={item.id}>
                                        {item.name}
                                    </option>
                                ) : null;
                            })}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" onClick={handelSubmit}>
                        Tìm kiếm
                    </Button>
                </Col>
                <Col>
                    <Button variant="success" onClick={Add} className="mt-3">
                        Thêm Sự kiện
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default FormFilter;
