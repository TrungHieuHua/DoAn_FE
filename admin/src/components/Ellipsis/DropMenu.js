import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { v4 } from 'uuid';

import styles from './Ellipsis.module.scss';
import MenuItem from './MenuItem';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function DropMenu({ children, menu }) {
    const [menux, setMenux] = useState([]);

    useEffect(() => {
        setMenux(menu);
    }, []);
    return (
        <Tippy
            interactive
            offset={(13, 7)}
            zIndex="9999"
            placement="bottom"
            delay={(0, 200)}
            render={() => {
                return (
                    <div className={cx('menu-box')}>
                        {menux.map((item) => {
                            return <MenuItem key={v4()} menu={item} />;
                        })}
                    </div>
                );
            }}
        >
            {children}
        </Tippy>
    );
}

export default DropMenu;
