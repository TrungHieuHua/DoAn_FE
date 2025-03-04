import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import WhiteBG from '~/Layouts/DefaultLayout/WhiteBG';
import Event from '~/components/Event';
import styles from './Event.module.scss';
import Button from '~/components/Button';
import FormEvent from './FormEvent';
import { getall } from '~/ultils/services/eventsService';
import FormFilter from './FormFilter';

const cx = classNames.bind(styles);

function Events() {
    const [data, setData] = useState([]);
    const [category, setCategory] = useState('');
    const [deleteData, setDeleteData] = useState('');
    const [formPost, setFormPost] = useState(false);
    const [idShow, setIdShow] = useState('');
    const [created, setCreated] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getall(category);
                if (response.status === 'fail') {
                    setData([]);
                } else {
                    setData(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [deleteData, created, category]);

    const onEventDeleted = (id) => {
        setDeleteData(id);
    };

    return (
        <div>
            {formPost || idShow ? (
                <FormEvent
                    id={idShow}
                    onSuccess={(e) => {
                        if (e === 'success') {
                            setCreated(v4());
                        }
                    }}
                    title="Thêm Sự Kiện"
                    onClose={() => {
                        setFormPost(false);
                        setIdShow('');
                    }}
                />
            ) : null}
            <WhiteBG title="Quản Lý Sự Kiện">
                <div className={cx('wrapper')}>
                    <div className={cx('filter')}>
                        <FormFilter
                            Add={() => {
                                setFormPost(true);
                            }}
                            search={(c) => {
                                setCategory(c);
                            }}
                        />
                    </div>
                    <div className={cx('list')}>
                        {data.map((props) => {
                            return (
                                <Event
                                    onUpdate={() => {
                                        setIdShow(props.id);
                                    }}
                                    onEventDeleted={onEventDeleted}
                                    key={v4()}
                                    props={props}
                                />
                            );
                        })}
                    </div>
                </div>
            </WhiteBG>
        </div>
    );
}

export default Events;
