import classNames from 'classnames/bind';

import styles from './SearchForm.module.scss';

const cx = classNames.bind(styles);

function Search({ value, onChange, onKeyDown }) {
    return (
        <div className={cx('wrapper')}>
            <input placeholder="Tìm kiếm..." type="text" onChange={onChange} onKeyDown={onKeyDown} value={value} />
        </div>
    );
}

export default Search;
