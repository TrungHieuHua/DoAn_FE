import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import SearchForm from '~/components/SearchForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { getall } from '~/ultils/services/productService';
import { getall as getAllCate } from '~/ultils/services/categoriesService';
import { getall as getAllProcedure } from '~/ultils/services/proceduresService';
import Button from '~/components/Button';
import ProductItem from '~/components/ProductItem';
import ReactPaginate from 'react-paginate';
import { v4 } from 'uuid';
import useDebounce from '~/hooks/useDebounce';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [pageValue, setPageValue] = useState(0);
    const [perPageValue, setPerPageValue] = useState(9);
    const [data, setData] = useState([]);
    const [sort, setSort] = useState(1);
    const [cates, setCates] = useState([]);
    const [cateIdCheckedList, setCateIdCheckedList] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [procedureIdCheckedList, setProcedureIdCheckedList] = useState([]);
    const [limit, setLimit] = useState([0, 0]);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const s = queryParams.get('s');
    const page = parseInt(queryParams.get('page'), 0) || 0;
    const perPage = parseInt(queryParams.get('perPage'), 9) || 9;

    const debouncedSearchValue = useDebounce(searchValue, 500);

    useEffect(() => {
        setSearchValue(s || '');
        setPageValue(page);
        setPerPageValue(perPage);

        const fetchData = async () => {
            const response = await getall(
                debouncedSearchValue,
                limit[1] > 0 ? limit[1] : '',
                limit[0],
                cateIdCheckedList,
                procedureIdCheckedList,
                page,
                perPage,
            );
            if (response.statusCode === 200) {
                setData(response.result);
                setTotalPages(response.totalPage);
            } else {
                setData([]);
            }
        };

        fetchData();
    }, [debouncedSearchValue, limit, cateIdCheckedList, procedureIdCheckedList, page, perPage]);

    useEffect(() => {
        const fetchDataCate = async () => {
            const response = await getAllCate();
            if (response.statusCode === 200) {
                setCates(response.result);
            } else {
                setCates([]);
            }
        };

        const fetchDataProcedure = async () => {
            const response = await getAllProcedure();
            if (response.statusCode === 200) {
                setProcedures(response.result);
            } else {
                setProcedures([]);
            }
        };

        fetchDataCate();
        fetchDataProcedure();
    }, []);

    const handleSearchChange = (e) => {
        const newSearchValue = e.target.value;
        setSearchValue(newSearchValue);
        setPageValue(0);
        navigate(`?s=${newSearchValue}&page=0&perPage=${perPageValue}`);
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setCateIdCheckedList((prevList) =>
            e.target.checked ? [...prevList, categoryId] : prevList.filter((id) => id !== categoryId),
        );
        setPageValue(0);
        navigate(`?s=${searchValue}&page=0&perPage=${perPageValue}`);
    };

    const handlePageChange = ({ selected }) => {
        setPageValue(selected);
        navigate(`?s=${searchValue}&page=${selected}&perPage=${perPageValue}`);
    };

    const handleProcedureChange = (e) => {
        const procedureId = e.target.value;
        setProcedureIdCheckedList((prevList) =>
            e.target.checked ? [...prevList, procedureId] : prevList.filter((id) => id !== procedureId),
        );
        setPageValue(0);
        navigate(`?s=${searchValue}&page=0&perPage=${perPageValue}`);
    };

    const handleClearFilters = () => {
        setSort(1);
        setLimit([0, 0]);
        setCateIdCheckedList([]);
        setProcedureIdCheckedList([]);
        setSearchValue('');
        navigate('?');
    };

    const handleShowMoreCategories = () => {
        setShowAllCategories(!showAllCategories);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <div className={cx('search-box')}>
                    <SearchForm className={cx('input')} value={searchValue} onChange={handleSearchChange} />
                </div>
                <div className={cx('filter')}>
                    <div className={cx('filter_price')}>
                        <div className={cx('filter_item')}>
                            <p>Giá từ:</p>
                            <input
                                type="number"
                                min="0"
                                step="100000"
                                value={limit[0]}
                                onChange={(e) => setLimit([e.target.value, limit[1]])}
                            />
                        </div>
                        <div className={cx('filter_item')}>
                            <p>đến:</p>
                            <input
                                type="number"
                                min="0"
                                step="100000"
                                value={limit[1]}
                                onChange={(e) => setLimit([limit[0], e.target.value])}
                            />
                        </div>
                        <div className={cx('filter_checkbox')}>
                            <p>Danh mục</p>
                            {cates.slice(0, showAllCategories ? cates.length : 3).map((cate) => (
                                <div key={cate.id} className={cx('checkbox-item')}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={cate.id}
                                            checked={cateIdCheckedList.includes(cate.id + '')}
                                            onChange={handleCategoryChange}
                                        />
                                        <span>{cate.name}</span>
                                    </label>
                                </div>
                            ))}
                            {cates.length > 3 && (
                                <Button onClick={handleShowMoreCategories} className={cx('showBtn')}>
                                    {showAllCategories ? 'Thu gọn' : 'Xem thêm'}
                                </Button>
                            )}
                        </div>
                        <div className={cx('filter_checkbox')}>
                            <p>Nhà cung cấp</p>
                            {procedures.slice(0, showAllCategories ? procedures.length : 3).map((procedure) => (
                                <div key={procedure.id} className={cx('checkbox-item')}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={procedure.id}
                                            checked={procedureIdCheckedList.includes(procedure.id + '')}
                                            onChange={handleProcedureChange}
                                        />
                                        <span>{procedure.name}</span>
                                    </label>
                                </div>
                            ))}
                            {procedures.length > 3 && (
                                <Button onClick={handleShowMoreCategories} className={cx('showBtn')}>
                                    {showAllCategories ? 'Thu gọn' : 'Xem thêm'}
                                </Button>
                            )}
                        </div>
                    </div>
                    <Button onClick={handleClearFilters}>Xóa Filter</Button>
                </div>
            </div>
            <div className={cx('result-content')}>
                {data.length > 0 ? (
                    <>
                        <div className={cx('result')}>
                            {data.map((item) => (
                                <ProductItem key={v4()} props={item} />
                            ))}
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
                    </>
                ) : (
                    <div className={cx('showEmpty')}>Không có sản phẩm nào phù hợp</div>
                )}
            </div>
        </div>
    );
}

export default Search;
