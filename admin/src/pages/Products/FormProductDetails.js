import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { v4 } from 'uuid';

import styles from './Products.module.scss';

import { getbyid, deletedDetail, updateDetailsIsDelete, getdetailbyid } from '~/ultils/services/productService';
import Ellipsis from '~/components/Ellipsis';

import { colorPalette } from '~/config/colorPalette';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function FormProductDetails({ onClose, title, onEventDeleted, onSuccess, id, detailId, onChangeDetailId, }) {
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

    const  handleDelete = async (detailId) => {
        try {
            const response = await deletedDetail(detailId);
            console.log(response.statusCode);
            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message);
                // Refresh the details list
                const updatedResponse = await getbyid(id);
                if (updatedResponse.statusCode === 200) {
                    setDetails(updatedResponse.data.productDetailResponseList);
                } else {
                    toast.error('Không thể tải lại danh sách sản phẩm');
                }
            } else {
                toast.error(response.message || 'Có lỗi ');
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra khi xóa sản phẩm');
        }
    };

    const  handleUpdate = async (detailId) => {
        try {
            const data = await getdetailbyid(detailId);
            if (data.statusCode === 200) {
                const updateData = {
                    ...data.data,
                    isDeleted: false
                };
                const response = await updateDetailsIsDelete(updateData);
                if (response.statusCode === 201) {
                    toast.success('Khôi phục sản phẩm thành công');
                    // Refresh the details list
                    const updatedResponse = await getbyid(id);
                    if (updatedResponse.statusCode === 200) {
                        setDetails(updatedResponse.data.productDetailResponseList);
                    }
                } else {
                    toast.error(response.message || 'Có lỗi xảy ra');
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra khi khôi phục sản phẩm');
        }
    };

    const handleDeleteConfirmation = (detail) => {
        if (detail.isDeleted) {
            if (window.confirm('Bạn có chắc chắn muốn khôi phục sản phẩm này không?')) {
                handleUpdate(detail.id);
            }
        } else {
            if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
                handleDelete(detail.id);
            }
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
                                                    title: detail.isDeleted ? 'Khôi phục' : 'Xóa',
                                                    onClick: () => handleDeleteConfirmation(detail),
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
