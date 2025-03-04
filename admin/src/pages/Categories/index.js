import classNames from 'classnames/bind';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate, useLocation } from 'react-router-dom'; // Import necessary hooks

import styles from './Categories.module.scss';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Category from '~/components/Category';
import FormCate from './FormCate';
import FormFilter from './FormFilter';

import { getall } from '~/ultils/services/categoriesService';

const cx = classNames.bind(styles);

function Categories() {
    const navigate = useNavigate(); // Initialize navigate hook
    const location = useLocation(); // Initialize useLocation hook to get query params
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [deleted, setDeleted] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [idShow, setIdShow] = useState('');
    const [isCreated, setIsCreated] = useState('');
    const [pageValue, setPageValue] = useState(0);
    const [perPageValue, setPerPageValue] = useState(12);
    const [totalPages, setTotalPages] = useState(1);

    // Get query parameters from URL
    const queryParams = new URLSearchParams(location.search);
    const s = queryParams.get('s');
    const page = parseInt(queryParams.get('page'), 10) || 0;
    const perPage = parseInt(queryParams.get('perPage'), 10) || 12;

    useEffect(() => {
        setPageValue(page);
        setPerPageValue(perPage);
        const fetchData = async () => {
            try {
                const response = await getall(status, name, pageValue, perPage);
                if (response.status === 'fail') {
                    setData([]);
                } else {
                    setData(response.result);
                    setTotalPages(response.totalPage); // Set total pages from API response
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [deleted, isCreated, status, name, pageValue, perPageValue]); // Include all dependencies

    const onEventDeleted = (id) => {
        setDeleted(id);
    };

    const handlePageChange = ({ selected }) => {
        setPageValue(selected);
        // Update the URL with the new page value and other query parameters
        navigate(`?s=${status}&page=${selected}&perPage=${perPageValue}`);
    };

    return (
        <div>
            {showForm || idShow ? (
                <FormCate
                    id={idShow}
                    title="Thêm Danh Mục"
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
            <WhiteBG title="Quản Lý Danh Mục">
                <div className={cx('wrapper')}>
                    <div className={cx('filter')}>
                        <FormFilter
                            Add={() => {
                                setShowForm(true);
                            }}
                            search={(name, s) => {
                                setName(name);
                                setStatus(s);
                            }}
                        />
                    </div>
                    <div className={cx('list')}>
                        {data.map((item) => (
                            <Category
                                key={v4()}
                                onUpdate={() => setIdShow(item.id)}
                                onEventDeleted={onEventDeleted}
                                props={item}
                            />
                        ))}
                    </div>
                    <div>
                        <ReactPaginate
                            previousLabel={'<'}
                            nextLabel={'>'}
                            breakLabel={'...'}
                            forcePage={pageValue} // Ensure the current page is displayed
                            pageCount={totalPages} // Use total pages from the API response
                            onPageChange={handlePageChange} // Update page on user interaction
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

export default Categories;
