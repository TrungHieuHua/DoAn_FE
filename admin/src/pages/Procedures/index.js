import classNames from 'classnames/bind';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate'; // Import ReactPaginate for pagination
import { useNavigate, useLocation } from 'react-router-dom'; // For URL handling

import styles from './Procedures.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Procedure from '~/components/Procedure';
import FormProceDure from './FormProceDure';
import FormFilter from './FormFilter';

import { getall } from '~/ultils/services/proceduresService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Procedures() {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [deleted, setDeleted] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [idShow, setIdShow] = useState('');
    const [isCreated, setIsCreated] = useState('');
    const [pageValue, setPageValue] = useState(0); // Track the current page
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
                const response = await getall(status, name, pageValue, perPageValue); // Include pagination params
                if (response.statusCode === 200) {
                    setData(response.result);
                    setTotalPages(response.totalPage); // Set the total pages from the API response
                } else {
                    setData([]);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        };

        fetchData();
    }, [deleted, isCreated, status, name, pageValue, perPageValue]);

    const onEventDeleted = (id) => {
        setDeleted(id);
    };

    const handlePageChange = ({ selected }) => {
        const newPageValue = selected;
        setPageValue(newPageValue);
        // Update the URL with the new page and perPage values
        navigate(`?page=${newPageValue}&perPage=${perPageValue}`);
    };

    return (
        <div>
            {showForm || idShow ? (
                <FormProceDure
                    id={idShow}
                    title="Thêm Nhà Cung Cấp"
                    onSuccess={(e) => {
                        if (e === 204 || e === 201) {
                            setIdShow('');
                            setIsCreated(v4());
                        }
                    }}
                    onClose={() => {
                        setIdShow('');
                        setShowForm(false);
                    }}
                />
            ) : null}
            <WhiteBG title="Quản Lý Nhà Cung Cấp">
                <div className={cx('wrapper')}>
                    <div className={cx('filter')}>
                        <FormFilter
                            Add={() => {
                                setShowForm(true);
                            }}
                            search={(name, s) => {
                                setName(name);
                                setStatus(s);
                                setPageValue(0); // Reset to page 0 when filters change
                                navigate(`?page=0&perPage=${perPageValue}&name=${name}&status=${s}`);
                            }}
                        />
                    </div>
                    <div className={cx('list')}>
                        {data.map((item) => {
                            return (
                                <Procedure
                                    onUpdate={() => {
                                        setIdShow(item.id);
                                    }}
                                    onEventDeleted={onEventDeleted}
                                    key={v4()}
                                    props={item}
                                />
                            );
                        })}
                    </div>
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
            </WhiteBG>
        </div>
    );
}

export default Procedures;
