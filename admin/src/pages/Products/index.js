import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import ReactPaginate from 'react-paginate'; // Import ReactPaginate for pagination
import { useNavigate, useLocation } from 'react-router-dom'; // For URL handling

import styles from './Products.module.scss';
import FormProducts from './FormProducts';
import FormCreateProductDetail from './FormCreateProductDetail';
import FormProductDetails from './FormProductDetails';
import { getall } from '~/ultils/services/productService';
import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Product from '~/components/Product';
import FormFilter from './FormFilter';

const cx = classNames.bind(styles);

function Products() {
    const [data, setData] = useState([]);
    const [deleted, setDeleted] = useState('');
    const [created, setCreated] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('product');
    const [idShow, setIdShow] = useState('');
    const [idDetailShow, setIdDetailShow] = useState('');
    const [name, setName] = useState('');
    const [biggerPrice, setBiggerPrice] = useState('');
    const [lowerPrice, setLowerPrice] = useState('');
    const [procedure, setProcedure] = useState('');
    const [category, setCategory] = useState('');
    const [pageValue, setPageValue] = useState(0); // Track the current page
    const [perPageValue, setPerPageValue] = useState(12); // Items per page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages

    const navigate = useNavigate();
    const location = useLocation();

    // Function to get query params from the URL
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 0;
        const perPage = parseInt(params.get('perPage')) || 12;
        return { page, perPage };
    };

    useEffect(() => {
        const { page, perPage } = getQueryParams(); // Get page and perPage from URL
        setPageValue(page);
        setPerPageValue(perPage);
    }, [location.search]); // This effect runs whenever the URL changes

    useEffect(() => {
        const fetchData = async () => {
            const proces = procedure.length > 0 ? [procedure] : [];
            const cates = category.length > 0 ? [category] : [];
            const response = await getall(name, biggerPrice, lowerPrice, proces, cates, pageValue, perPageValue); // Include pagination params
            if (response.statusCode === 200) {
                setData(response.result);
                setTotalPages(response.totalPage); // Set the total pages from the API response
            } else {
                setData([]);
            }
        };
        fetchData();
    }, [deleted, created, name, biggerPrice, lowerPrice, procedure, category, pageValue, perPageValue]);

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
            {(showForm || (idShow && showForm)) && formType === 'product' ? (
                <FormProducts
                    onSuccess={(e) => {
                        if (e === 204 || e === 201 || e === 200) {
                            setCreated(v4());
                        }
                    }}
                    id={idShow}
                    onClose={() => {
                        setShowForm(false);
                        setIdShow('');
                    }}
                    title="Thêm Sản Phẩm"
                />
            ) : null}
            {(showForm || (idShow && showForm) || (idShow && showForm && idDetailShow)) &&
            formType === 'createProductDetail' ? (
                <FormCreateProductDetail
                    onSuccess={() => {
                        setIdDetailShow('');
                        setCreated(v4());
                    }}
                    id={idShow}
                    onClose={() => {
                        setIdDetailShow('');
                        setShowForm(false);
                        setIdShow('');
                    }}
                    idDetail={idDetailShow}
                    title="Thêm Chi Tiết Sản Phẩm"
                />
            ) : null}
            {(showForm || (idShow && showForm)) && formType === 'productDetails' ? (
                <FormProductDetails
                    onSuccess={() => {
                        setCreated(v4());
                    }}
                    id={idShow}
                    onClose={() => {
                        setShowForm(false);
                        setIdShow('');
                    }}
                    onEventDeleted={onEventDeleted}
                    onChangeDetailId={(detailId) => {
                        setFormType('createProductDetail');
                        setIdDetailShow(detailId);
                    }}
                    title="Chi Tiết Sản Phẩm"
                />
            ) : null}
            <WhiteBG title="Quản Lý Sản Phẩm">
                <div className={cx('wrapper')}>
                    <div className={cx('filter')}>
                        <FormFilter
                            Add={() => {
                                setShowForm(true);
                                setFormType('product');
                            }}
                            search={(n, p, c, s, cate) => {
                                setName(n);
                                setBiggerPrice(p);
                                setLowerPrice(c);
                                setProcedure(s);
                                setCategory(cate);
                                setPageValue(0); // Reset to page 0 when filters change
                                navigate(`?page=0&perPage=${perPageValue}`);
                            }}
                        />
                    </div>
                    <div className={cx('list')}>
                        {data.map((props) => {
                            return (
                                <Product
                                    onUpdate={() => {
                                        setShowForm(true);
                                        setIdShow(props.id);
                                        setFormType('product');
                                    }}
                                    onCreateDetail={() => {
                                        setIdDetailShow('');
                                        setShowForm(true);
                                        setIdShow(props.id);
                                        setFormType('createProductDetail');
                                    }}
                                    onShowDetail={() => {
                                        setShowForm(true);
                                        setIdShow(props.id);
                                        setFormType('productDetails');
                                    }}
                                    onEventDeleted={onEventDeleted}
                                    key={v4()}
                                    props={props}
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

export default Products;
