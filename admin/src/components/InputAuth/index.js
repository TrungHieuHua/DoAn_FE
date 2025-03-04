import classNames from 'classnames/bind';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';

import styles from './InputAuth.module.scss';

const cx = classNames.bind(styles);

function InputAuth({ value, label, onChange, type }) {
    const [showIcon, setShowIcon] = useState(faLock);
    const [typeInput, setTypeInput] = useState(type);

    return (
        <div className={cx('wrapper')}>
            <input type={typeInput} value={value} onChange={onChange} required />
            <label className={cx('label')}>{label}</label>
            {type === 'password' && (
                <div
                    className={cx('icon')}
                    onClick={() => {
                        if (typeInput === 'text') {
                            setTypeInput('password');
                            setShowIcon(faLock);
                        } else {
                            setTypeInput('text');
                            setShowIcon(faUnlock);
                        }
                    }}
                >
                    <FontAwesomeIcon icon={showIcon} />
                </div>
            )}
        </div>
    );
}

export default InputAuth;
