import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { v4 } from 'uuid';

import styles from './Products.module.scss';

import { getbyid, deletedDetail } from '~/ultils/services/productService';
import Ellipsis from '~/components/Ellipsis';

import { colorPalette } from '~/config/colorPalette';

const cx = classNames.bind(styles);

function FormProductDetails({ onClose, title, onEventDeleted, onSuccess, id, detailId, onChangeDetailId }) {
    const [details, setDetails] = useState([]);
    const [titlex, setTitlex] = useState('');

    function getColorNameFromRGB(rgb) {
        for (const key in colorPalette) {
            if (colorPalette[key].rgb === rgb) {
                return colorPalette[key].name;
            }
        }
        return 'Không xác định'; // Nếu không tìm thấy màu, trả về 'Không xác định'
    }

    useEffect(() => {
        const fetchCate = async () => {
            try {
                const response = await getbyid(id);
                if (response.statusCode === 200) {
                    setDetails(response.data.productDetailResponseList);
                }
            } catch (e) {
                console.log(e);
            }
        };

        if (id) {
            fetchCate();
        }
    }, [id]);

    const handleDelete = async (detailId) => {
        try {
            const response = await deletedDetail(detailId);
            if (response.statusCode === 200) {
                onEventDeleted(detailId); // Thông báo cho parent component về sự kiện xóa
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await getbyid(id);
                    if (response.statusCode === 200) {
                        setTitlex(response.data.name);
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <Modal show={true} onHide={onClose} className="model_pd_detail">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="form">
                    <Form.Group controlId="title">
                        <Form.Label>Tên Sản Phẩm</Form.Label>
                        <Form.Control type="text" disabled value={titlex} />
                    </Form.Group>
                    <br />
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Size</th>
                                <th>Màu</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>Trạng thái</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detail) => (
                                <tr key={v4()}>
                                    <td>{detail.size}</td>
                                    <td>{getColorNameFromRGB(detail.color)}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{detail.price}</td>
                                    <td>{detail.isDeleted ? 'Đã xóa' : 'Đang bán'}</td>
                                    <td>
                                        <Ellipsis
                                            type2
                                            menu={[
                                                {
                                                    title: 'Sửa',
                                                    onClick: () => {
                                                        onChangeDetailId(detail.id);
                                                    },
                                                },
                                                {
                                                    title: 'Xóa',
                                                    onClick: () => handleDelete(detail.id),
                                                },
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FormProductDetails;
