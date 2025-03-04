import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { statistic } from '~/ultils/services/OrdersService';

const CustomerReview = ({ year }) => {
    const [options, setOptions] = useState({
        chart: {
            id: 'line-chart',
        },
        xaxis: {
            categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
        },
        title: {
            text: 'Doanh thu theo tháng',
            align: 'left',
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val.toLocaleString('vi-VN') + 'đ';
                },
            },
        },
    });

    const [series, setSeries] = useState([
        {
            name: 'Doanh thu',
            data: [30000, 40000, 35000, 50000, 49000, 60000],
        },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await statistic({
                    month: 12,
                    year: year ?? 2024,
                });
                if (response.statusCode === 200) {
                    let seriesRs = [];
                    let CateRs = [];
                    response.data.forEach((e) => {
                        seriesRs.push(e.totalRevenue);
                        CateRs.push('Tháng ' + e.month);
                    });

                    setSeries([
                        {
                            name: 'Doanh thu',
                            data: seriesRs,
                        },
                    ]);

                    setOptions({
                        chart: {
                            id: 'line-chart',
                        },
                        xaxis: {
                            categories: CateRs,
                        },
                        title: {
                            text: 'Doanh thu theo tháng',
                            align: 'left',
                        },
                    });
                } else {
                    console.error('Error: Response status not 200');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [year]); // Effect triggers when 'year' changes

    return (
        <div>
            <Chart options={options} series={series} type="line" height={250} />
        </div>
    );
};

export default CustomerReview;
