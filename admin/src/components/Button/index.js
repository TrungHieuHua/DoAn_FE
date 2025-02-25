import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
    children,
    primary,
    outline,
    circle,
    text,
    rounded,
    className,
    onClick,
    disabled,
    to,
    href,
    ...passProps
}) {
    let Comp = 'button';

    const props = { onClick, ...passProps };
    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'undefined') {
                delete props[key];
            }
        });
    }
    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }
    const classes = cx('wrapper', {
        [className]: className,
        primary,
        outline,
        circle,
        text,
        disabled,
        rounded,
    });
    return (
        <Comp className={classes} {...props}>
            {children}
        </Comp>
    );
}

export default Button;
