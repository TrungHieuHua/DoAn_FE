import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Products.module.scss';
import ProductItem from '~/components/ProductItem';
import Button from '~/components/Button';
import { getbyid } from '~/ultils/services/categoriesService';
import { getall } from '~/ultils/services/productService';
import { v4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Products() {
    const [showMore, setShowMore] = useState(false);
    const [products, setProducts] = useState([]);
    const [cate, setCate] = useState({});
    const [limit, setLimit] = useState([0, 0]);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [pageValue, setPageValue] = useState(0);
    const [perPageValue, setPerPageValue] = useState(12);

    const { id } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const s = queryParams.get('s');
    const page = parseInt(queryParams.get('page'), 0) || 0;
    const perPage = parseInt(queryParams.get('perPage'), 12) || 12;

    useEffect(() => {
        setPageValue(page);
        setPerPageValue(perPage);

        const fetchData = async () => {
            const response = await getall('', limit[1] > 0 ? limit[1] : '', limit[0], [id], [], page, perPage);
            if (response.statusCode === 200) {
                setProducts(response.result);
                setTotalPages(response.totalPage);
            } else {
                setProducts([]);
            }
        };

        fetchData();
    }, [id, page, perPage, limit, cate]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getbyid(id);
            console.log(response);
            setCate(response.data);
        };
        fetchData();
    }, [id]);

    function handleClick() {
        setShowMore(!showMore);
    }

    const handlePageChange = ({ selected }) => {
        setPageValue(selected);
        navigate(`?page=${selected}&perPage=${perPageValue}`);
    };

    const contentClasses = cx('content');

    const contentStyles = !showMore ? { maxHeight: '500px' } : {};
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>{cate.name && cate.name}</div>
            <div className={cx('list')}>
                {products.map((item) => {
                    return <ProductItem key={v4()} props={item} />;
                })}
            </div>
            <div className={cx('pagination')}>
                <ReactPaginate
                    previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
                    nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
                    breakLabel={'...'}
                    forcePage={pageValue} // Synchronize current page
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName="pagination-container"
                    pageClassName="pagination-page"
                    activeClassName="active"
                    disabledClassName="pagination-disabled"
                    previousClassName="pagination-previous"
                    nextClassName="pagination-next"
                />
            </div>
            {cate.description && (
                <div className={cx('description')}>
                    <div className={contentClasses} style={contentStyles}>
                        {cate.description}
                    </div>
                    <div className={cx('btn')}>
                        <Button onClick={handleClick} text>
                            {showMore ? 'Thu gọn' : 'Xem thêm'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
