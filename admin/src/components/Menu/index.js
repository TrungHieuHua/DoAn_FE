import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';
import { faClipboardList, faGear, faHandHoldingHand, faHome, faTicket, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faNewspaper, faClipboard, faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { NavLink } from 'react-router-dom';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

const listMenu = [
    {
        title: 'Dashboard',
        icon: faHome,
        route: routes.home,
    },
    {
        title: 'Tài khoản',
        icon: faUsers,
        route: routes.accounts,
    },

    {
        title: 'Danh mục',
        icon: faRectangleList,
        route: routes.categories,
    },
    {
        title: 'Nhà cung cấp',
        icon: faHandHoldingHand,
        route: routes.procedures,
    },
    {
        title: 'Voucher',
        icon: faTicket,
        route: routes.vourchers,
    },

    {
        title: 'Sản phẩm',
        icon: faClipboard,
        route: routes.products,
    },
    {
        title: 'Đơn hàng',
        icon: faClipboardList,
        route: routes.orders,
    },
];

function Menu({ className }) {
    return (
        <div className={cx('wrapper', className)}>
            {listMenu.map((menu, index) => {
                return (
                    <NavLink key={index} to={menu.route}>
                        <MenuItem icon={menu.icon} name={menu.title} />
                    </NavLink>
                );
            })}
        </div>
    );
}

export default Menu;
