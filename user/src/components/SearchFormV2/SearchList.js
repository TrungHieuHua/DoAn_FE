import Tippy from '@tippyjs/react/headless';
import { v4 } from 'uuid';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './SearchForm.module.scss';

const cx = classNames.bind(styles);

function SearchList({ children }) {
    let Comp = 'span';

    return <div>{children}</div>;
}

export default SearchList;
