import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import DropMenu from './DropMenu';

import styles from './Ellipsis.module.scss';

const cx = classNames.bind(styles);

function Ellipsis({ menu, type2 }) {
    const classes = cx('wrapper', {
        type2: type2,
    });

    return (
        <div className={classes}>
            <DropMenu menu={menu}>
                <span>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </span>
            </DropMenu>
        </div>
    );
}

export default Ellipsis;
