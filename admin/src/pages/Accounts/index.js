import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { v4 } from 'uuid';
import ReactPaginate from 'react-paginate'; // Import ReactPaginate for pagination
import { useNavigate, useLocation } from 'react-router-dom'; // For handling URL navigation and params

import styles from './Accounts.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Table2 from '~/components/Table2';
import Ellipsis from '~/components/Ellipsis';
import FormFilter from './FormFilter';
import { getall, block } from '~/ultils/services/userService';
import FormAccount from './FormAccount';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Accounts() {
    const [rows, setRows] = useState([]);
    const [updating, setUpdating] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [idShow, setIdShow] = useState('');
    const [pageValue, setPageValue] = useState(0); // Track current page
    const [perPageValue, setPerPageValue] = useState(10); // Items per page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages

    const navigate = useNavigate();
    const location = useLocation();

    // Function to get query params from the URL
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 0;
        const perPage = parseInt(params.get('perPage')) || 10;
        return { page, perPage };
    };

    useEffect(() => {
        const { page, perPage } = getQueryParams(); // Get page and perPage from URL
        setPageValue(page);
        setPerPageValue(perPage);
    }, [location.search]); // This effect runs whenever the URL changes

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getall(name, role, pageValue, perPageValue); // Include pagination params
                if (response.statusCode !== 200) {
                    setRows([]);
                } else {
                    const newData = response.result.map(({ id, username, firstName, lastName, email, isDeleted }) => {
                        const menu = [
                            {
                                title: 'Chi tiết',
                                onClick: () => {
                                    setIdShow(id);
                                },
                            },
                            {
                                title: !isDeleted ? 'Block' : 'Unblock',
                                onClick: async () => {
                                    const response = await block({
                                        id: id,
                                    });
                                    if (response.statusCode === 201) {
                                        toast.success(response.message);
                                        setUpdating(v4());
                                    }
                                },
                            },
                        ];
                        return {
                            id,
                            username,
                            firstName,
                            lastName,
                            email,
                            status: !isDeleted ? (
                                <span className="success">Hoạt động</span>
                            ) : (
                                <span className="error">Đã xóa</span>
                            ),
                            action: <Ellipsis type2 menu={menu} />,
                        };
                    });
                    setRows(newData);
                    setTotalPages(response.totalPage); // Update totalPages from API response
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [updating, name, role, pageValue, perPageValue]);

    const col = [
        { field: 'ID', width: 50 },
        { field: 'User Name', width: 140 },
        { field: 'Họ', width: 135 },
        { field: 'Tên', width: 135 },
        { field: 'Email', width: 200 },
        { field: 'Trạng thái', width: 100 },
        { field: 'Action', width: 70 },
    ];

    const handlePageChange = ({ selected }) => {
        const newPageValue = selected;
        setPageValue(newPageValue);
        // Update the URL with the new page and perPage values
        navigate(`?page=${newPageValue}&perPage=${perPageValue}`);
    };

    return (
        <div>
            {idShow && (
                <FormAccount
                    id={idShow}
                    onClose={() => {
                        setIdShow('');
                    }}
                />
            )}
            <WhiteBG title="Quản Lý Tài Khoản">
                <div className={cx('wrapper')}>
                    <div className={cx('listUser')}>
                        <div className={cx('table')}>
                            <Table2 rows={rows} colum={col} />
                            <div className={cx('pagination')}>
                                <ReactPaginate
                                    previousLabel={'<'}
                                    nextLabel={'>'}
                                    breakLabel={'...'}
                                    forcePage={pageValue} // Force page to reflect the current state
                                    pageCount={totalPages} // Total pages from API response
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
                                search={(n, s) => {
                                    setName(n);
                                    setRole(s);
                                    setPageValue(0); // Reset to page 0 when filters change
                                    // Update the URL with filters and page 0
                                    navigate(`?page=0&perPage=${perPageValue}`);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </WhiteBG>
        </div>
    );
}

export default Accounts;
