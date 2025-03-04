import classNames from 'classnames/bind';

import Table from '~/components/Table';
import TopProducts from '~/components/Table/TopProducts';
import Cards from '~/components/Cards';
import Ranking from '~/components/Ranking';
import CustomerReview from '~/components/CustomerReview';
import styles from './Home.module.scss';
import * as XLSX from 'xlsx';
import { getCookie } from '~/ultils/cookie';

import { Form, Row, Col, Button } from 'react-bootstrap';

import {
    getrecents,
    statistic,
    productSales,
    exportProductSales,
    exportStatistic,
} from '~/ultils/services/OrdersService';

import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

const tableTitle = (
    <div
        className={cx('order')}
        style={{
            display: 'flex',
            justifyContent: 'space-between',
        }}
    >
        <p
            style={{
                width: '100px',
            }}
        >
            STT
        </p>
        <p
            style={{
                flex: 1,
            }}
        >
            Tên Sản phẩm
        </p>
        <p
            style={{
                width: '140px',
            }}
        >
            Số lượng bán
        </p>
    </div>
);

function Home() {
    getCookie('login');

    // Lấy ngày hiện tại
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Tháng tính từ 0
    const currentYear = currentDate.getFullYear();

    const [orders, setOrder] = useState([]);
    const [productSt, setProductSt] = useState([]);
    const [stData, setStData] = useState([]);
    const [month, setMonth] = useState(currentMonth.toString()); // Tháng mặc định là tháng hiện tại
    const [year, setYear] = useState(currentYear.toString()); // Năm mặc định là năm hiện tại
    const [year2, setYear2] = useState(currentYear.toString()); // Năm mặc định là năm hiện tại

    useEffect(() => {
        const fetchData = async () => {
            const response = await productSales({
                month: month || 12,
                year: year2 || 2024,
            });
            if (response.statusCode === 200) {
                setProductSt(response.data);
            } else {
                setProductSt([]);
            }
        };
        fetchData();
    }, [month, year2]);

    const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i); // Năm từ (năm hiện tại - 5) đến (năm hiện tại + 4)

    const handleExportExcel = async () => {
        try {
            // Gọi API exportProductSales để lấy file Excel
            // const response = await exportProductSales({
            //     month: month || 12,
            //     year: year2 || 2024,
            // });

            // Tải file xuống
            const link = document.createElement('a');
            link.href = `http://localhost:8080/api/v1/exports/product-sales?month=${month}&year=${year}`;
            link.download = 'exported_file.xlsx'; // Tên file tải về
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>Dashboard</h1>
            <div className={cx('content')}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '3fr 1fr',
                        marginRight: '15px',
                        gridGap: '20px',
                    }}
                    className={cx('main')}
                >
                    <div>
                        <CustomerReview data={stData} year={year} />
                    </div>
                    <div className={cx('filter')}>
                        <Form.Group controlId="year">
                            <Form.Label>Năm</Form.Label>
                            <Form.Control as="select" value={year} onChange={(e) => setYear(e.target.value)}>
                                {years.map((y) => (
                                    <option key={v4()} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <br></br>
                        <Button
                            variant="primary"
                            onClick={async () => {
                                try {
                                    const link = document.createElement('a');
                                    link.href = `http://localhost:8080/api/v1/exports/statistics?month=${month}&year=${year}`;
                                    link.download = 'exported_file.xlsx'; // Tên file tải về
                                    link.click();
                                    URL.revokeObjectURL(link.href);
                                } catch (error) {
                                    console.error('Error downloading the file:', error);
                                }
                            }}
                        >
                            Export Excel
                        </Button>
                    </div>
                </div>
                <div
                    className={cx('review')}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '3fr 1fr',
                        gridGap: '20px',
                    }}
                >
                    <div>
                        <Table title="Top sản phẩm bán chạy" tableTitle={tableTitle}>
                            {productSt.map((st, index) => {
                                return (
                                    <TopProducts
                                        key={v4()}
                                        index={index + 1}
                                        productId={st.productId}
                                        productName={st.productName}
                                        totalQuantitySold={st.totalQuantitySold}
                                    />
                                );
                            })}
                        </Table>
                    </div>
                    <div className={cx('filter')}>
                        <Form.Group controlId="year2">
                            <Form.Label>Năm</Form.Label>
                            <Form.Control as="select" value={year2} onChange={(e) => setYear2(e.target.value)}>
                                {years.map((y) => (
                                    <option key={v4()} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="month">
                            <Form.Label>Tháng</Form.Label>
                            <Form.Control as="select" value={month} onChange={(e) => setMonth(e.target.value)}>
                                {months.map((m) => (
                                    <option key={v4()} value={m}>
                                        Tháng {m}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <br></br>
                        <Button variant="primary" onClick={handleExportExcel}>
                            Export Excel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
