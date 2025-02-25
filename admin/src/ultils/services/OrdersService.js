import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (fullName, fromDate, toDate, status, page, perPage) => {
    try {
        const res = await httpRequest.post('v1/orders/search', {
            fullName,
            dateFrom: fromDate,
            dateTo: toDate,
            status: status || null,
            page: page,
            size: perPage || 10000000000,
        });
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response;
    }
};

export const getrecents = async () => {
    try {
        const res = await httpRequest.get('orders/getrecents.php');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const count = async () => {
    try {
        const res = await httpRequest.get('orders/count.php');
        return res;
    } catch (error) {
        console.log(error);
        return error.response;
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/orders/' + id, {});
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
};

export const deleted = async (id) => {
    try {
        const res = await httpRequest.deleted('orders/delete.php', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
        return error.response;
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update(
            'v1/orders?' + 'id=' + req.id + '&status=' + req.status + '&paymentStatus=' + req.paymentStatus,
            {
                params: {
                    id: req.id,
                    status: req.status,
                },
            },
        );
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
};

export const statistic = async (req) => {
    try {
        const res = await httpRequest.get('v1/orders/statistic', {
            params: {
                month: req.month,
                year: req.year,
            },
        });
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
};

export const productSales = async (req) => {
    try {
        const res = await httpRequest.get('v1/orders/product-sales', {
            params: {
                month: req.month,
                year: req.year,
            },
        });
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
};

export const exportStatistic = async (req) => {
    try {
        const res = await httpRequest.get('v1/exports/statistics', {
            params: {
                month: req.month,
                year: req.year,
            },
        });
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
};

export const exportProductSales = async (req) => {
    try {
        const res = await httpRequest.get('v1/exports/product-sales', {
            params: {
                month: req.month,
                year: req.year,
            },
        });

        console.log(res);

        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
};
