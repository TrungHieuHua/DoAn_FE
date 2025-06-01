import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './RecommendedProducts.module.scss';
import ProductItem from '~/components/ProductItem';
import { getProductCluster } from '~/ultils/services/kmeansService';
import { isLogin } from '~/ultils/cookie/checkLogin';
import { v4 } from 'uuid';

const cx = classNames.bind(styles);

function RecommendedProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageValue, setPageValue] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 12;

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page'), 0) || 0;

    useEffect(() => {
        setPageValue(page);

        const fetchProducts = async () => {
            try {
                if (isLogin()) {
                    const response = await getProductCluster();
                    if (response.statusCode === 200) {
                        const allProducts = response.data || [];
                        setProducts(allProducts);
                        setTotalPages(Math.ceil(allProducts.length / productsPerPage));
                    }
                }
            } catch (err) {
                setError('Không thể tải sản phẩm đề xuất');
                console.error('Error fetching recommended products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    if (!isLogin()) {
        return null;
    }

    if (loading) {
        return <div className={cx('loading')}>Đang tải sản phẩm đề xuất...</div>;
    }

    if (error) {
        return <div className={cx('error')}>{error}</div>;
    }

    if (!products || products.length === 0) {
        return <div className={cx('empty')}>Không có sản phẩm đề xuất nào</div>;
    }

    // Calculate current page products
    const offset = page * productsPerPage;
    const currentProducts = products.slice(offset, offset + productsPerPage);

    const handlePageChange = ({ selected }) => {
        setPageValue(selected);
        navigate(`?page=${selected}`);
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Sản phẩm đề xuất cho bạn</h2>
            <div className={cx('list')}>
                {currentProducts.map((product) => (
                    <ProductItem key={v4()} props={product} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className={cx('pagination')}>
                    <ReactPaginate
                        previousLabel={<FontAwesomeIcon icon={faArrowLeft} />}
                        nextLabel={<FontAwesomeIcon icon={faArrowRight} />}
                        breakLabel={'...'}
                        forcePage={pageValue}
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
            )}
        </div>
    );
}

export default RecommendedProductsPage;
