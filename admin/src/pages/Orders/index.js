import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import React from 'react';
import ReactPaginate from 'react-paginate'; // Import ReactPaginate
import { useNavigate, useLocation } from 'react-router-dom'; // Use useNavigate and useLocation

import styles from './Orders.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Table2 from '~/components/Table2';
import Ellipsis from '~/components/Ellipsis';
import { getall } from '~/ultils/services/OrdersService';
import FormFilter from './FormFilter';
import FormOrder from './FormOrder';
import { getDes, orderStatusOptions } from '~/config/orderOption';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function Orders() {
    const [rows, setRows] = useState([]);
    const [idShow, setIdShow] = useState('');
    const [fullName, setFullName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [status, setStatus] = useState('');
    const [reloadComponent, setReloadComponent] = useState('');
    const [pageValue, setPageValue] = useState(0); // Default to page 0
    const [perPageValue, setPerPageValue] = useState(10); // Set default perPage
    const [totalPages, setTotalPages] = useState(1); // Total pages from API
    const navigate = useNavigate(); // Initialize navigate
    const location = useLocation(); // Use location to get URL query params

    const col = [
        { field: 'ID', width: 50 },
        { field: 'Người Nhận', width: 180 },
        { field: 'Điện Thoại', width: 120 },
        { field: 'Ngày đặt', width: 120 },
        { field: 'Tổng Tiền', width: 180 },
        { field: 'Trạng thái', width: 137 },
        { field: 'Action', width: 70 },
    ];

    // Extract query params from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const page = parseInt(queryParams.get('page')) || 0; // Default to 0 if page is not in the URL
        const perPage = parseInt(queryParams.get('perPage')) || perPageValue; // Use perPage from URL or default to perPageValue

        setPageValue(page);
        setPerPageValue(perPage); // Ensure perPage stays in sync with the URL
    }, [location.search]);

    // Fetch data when filters or page change
    useEffect(() => {
        const fetchData = async () => {
            const response = await getall(fullName, fromDate, toDate, status, pageValue, perPageValue); // Add pagination params
            if (response.statusCode === 200) {
                const newData = response.result.map(({ id, fullName, phone, createdAt, totalAmount, status }) => {
                    const menu = [
                        {
                            title: 'Chi tiết',
                            onClick: () => {
                                setIdShow(id);
                            },
                        },
                        {
                            title: 'Xuất hóa đơn',
                            onClick: async () => {
                                try {
                                    // Assuming the URL for downloading the file is correct
                                    const fileUrl = `http://localhost:8080/api/v1/orders/${id}/download`;

                                    // Make an HTTP request to get the file data
                                    const response = await fetch(fileUrl);
                                    if (!response.ok) {
                                        throw new Error(`Failed to fetch file: ${response.statusText}`);
                                    }

                                    // Get the file blob from the response
                                    const fileBlob = await response.blob();

                                    // Create a temporary anchor element to trigger the file download
                                    const link = document.createElement('a');
                                    link.href = URL.createObjectURL(fileBlob); // Create a URL for the blob
                                    link.download = 'Hóa đơn.pdf'; // Set the file name

                                    // Trigger the download by simulating a click event
                                    document.body.appendChild(link); // Ensure the link is added to the DOM
                                    link.click();

                                    // Clean up by removing the link after the download trigger
                                    document.body.removeChild(link);
                                } catch (error) {
                                    console.error('Error downloading the file:', error);
                                }
                            },
                        },
                    ];

                    const formatPrice = new Intl.NumberFormat('vi-VN').format(totalAmount);
                    return {
                        id,
                        fullName,
                        phone,
                        createdAt: new Intl.DateTimeFormat('vi-VN').format(new Date(createdAt)),
                        totalAmount: formatPrice + 'đ',
                        status: getDes(status, orderStatusOptions),
                        action: <Ellipsis type2 menu={menu} />,
                    };
                });
                setRows(newData);
                setTotalPages(response.totalPage); // Assuming the response contains totalPages
            } else {
                setRows([]);
            }
        };

        fetchData();
    }, [fullName, fromDate, toDate, status, reloadComponent, pageValue, perPageValue]);

    // Handle page change
    const handlePageChange = ({ selected }) => {
        setPageValue(selected);
        // Update the URL with new page and perPage values
        navigate(`?page=${selected}&perPage=${perPageValue}`);
    };

    // Handle filter change and reset page to 0
    const handleFilterChange = (fullName, fromDate, toDate, s) => {
        setFullName(fullName);
        setFromDate(fromDate);
        setToDate(toDate);

        setStatus(s);
        setPageValue(0); // Reset page to 0 when filters change
        navigate(`?page=0&perPage=${perPageValue}`); // Update URL to reflect the reset page
    };

    return (
        <div>
            {idShow && (
                <FormOrder
                    id={idShow}
                    onClose={() => {
                        setIdShow('');
                        setReloadComponent(v4());
                    }}
                />
            )}
            <WhiteBG title="Quản Lý Đơn Hàng">
                <div className={cx('wrapper')}>
                    <div className={cx('table')}>
                        <Table2 rows={rows} colum={col} />
                        <div className={cx('paginate')}>
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                forcePage={pageValue} // Ensure the current page is shown
                                pageCount={totalPages} // Total number of pages from the API
                                onPageChange={handlePageChange} // Update page when a new page is selected
                                containerClassName={cx('pagination-container')}
                                pageClassName={cx('pagination-page')}
                                activeClassName={cx('active')}
                                previousClassName={cx('pagination-previous')}
                                nextClassName={cx('pagination-next')}
                            />
                        </div>
                    </div>
                    <div className={cx('filter')}>
                        <FormFilter
                            search={handleFilterChange} // Use handleFilterChange to reset page to 0 on filter change
                        />
                    </div>
                </div>
            </WhiteBG>
        </div>
    );
}

export default Orders;
