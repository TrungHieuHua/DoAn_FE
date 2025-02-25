import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './DefaultLayout.module.scss';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Slider from '../components/Slider';
import { getall } from '~/ultils/services/eventsService';

const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('slider')}></div>

            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
