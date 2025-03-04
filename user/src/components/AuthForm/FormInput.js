import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './AuthForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function FormInput({ label, type, note, onChange, value }) {
    const [typ, setTyp] = useState(type);
    const [icon, setIcon] = useState(faEye);
    const handelType = () => {
        if (typ !== type) {
            setTyp(type);
            setIcon(faEye);
        } else {
            setTyp('text');
            setIcon(faEyeSlash);
        }
    };
    return (
        <div>
            {note ? <div className={cx('note')}>{note}</div> : null}
            <div classame={cx('label')}>{label}</div>
            <div className={cx('input')}>
                <input value={value} onChange={onChange} type={typ} />
                {type === 'password' && (
                    <div onClick={handelType} className={cx('lock')}>
                        <FontAwesomeIcon icon={icon} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default FormInput;
