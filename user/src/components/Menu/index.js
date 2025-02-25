import Tippy from '@tippyjs/react/headless';
import { v4 } from 'uuid';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function Menu({ children, menu }) {
    let Comp = 'span';

    return (
        <div>
            <Tippy
                delay={(0, 300)}
                interactive={true}
                render={(attrs) => (
                    <div className={cx('box')} tabIndex="-1" {...attrs}>
                        {menu.map((item) => {
                            if (item.to) {
                                Comp = Link;
                            }
                            return (
                                <div onClick={item.onClick} className={cx('item')} key={v4()}>
                                    <Comp to={item.to}>{item.name}</Comp>
                                </div>
                            );
                        })}
                    </div>
                )}
            >
                {children}
            </Tippy>
        </div>
    );
}

export default Menu;
