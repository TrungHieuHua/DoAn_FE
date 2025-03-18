import * as httpRequest from '~/ultils/httpRequest';

export const getall = async (name, fromPrice, toPrice, procedures, categories, page, perPage) => {
    try {
        const res = await httpRequest.post('v1/products/search', {
            name: name,
            priceBigger: toPrice,
            priceLower: fromPrice,
            procedureIds: procedures,
            categoryIds: categories,
            page: page,
            size: perPage || 100,
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const deleted = async (id) => {
    try {
        const res = await httpRequest.deleted('v1/products', {
            params: {
                id: id,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const deletedDetail = async (id) => {
    try {
        const res = await httpRequest.deleted('v1/product-details', {
            params: {
                id: id,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const create = async (req) => {
    try {
        const res = await httpRequest.post('v1/products', {
            name: req.title,
            category: parseInt(req.category_id, 10),
            img: req.avatar,
            description: req.description,
            priceRange: req.price,
            procedure: parseInt(req.procedure_id, 10),
            status: req.status,
        });

        return res.data;
    } catch (error) {
        console.log(error);
        return error.response;
    }
};

export const createdetail = async (req) => {
    try {
        const res = await httpRequest.post('v1/product-details', {
            productId: req.productId,
            color: req.color,
            size: req.size,
            quantity: req.quantity,
            img: req.image,
            price: req.price,
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getalldetails = async (id) => {
    try {
        const res = await httpRequest.get('v1/product-details/' + id, {});
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const getbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/products/' + id, {});
        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const getdetailbyid = async (id) => {
    try {
        const res = await httpRequest.get('v1/product-details/' + id, {});
        
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const update = async (req) => {
    try {
        const res = await httpRequest.update('v1/products', {
            id: req.id,
            name: req.title,
            category: parseInt(req.category_id, 10),
            img: req.avatar,
            description: req.description,
            priceRange: req.price,
            procedure: parseInt(req.procedure_id, 10),
            status: req.status,
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
};

export const updatedetail = async (req) => {
    try {
        const res = await httpRequest.update('v1/product-details', {
            id: req.id,
            productId: req.productId,
            color: req.color,
            size: req.size,
            quantity: req.quantity,
            img: req.image,
            price: req.price,
        });
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const updateIsDelete = async (req) => {
    try {
        const res = await httpRequest.update('v1/products/status', {
            id: req.id,
            // name: req.name,
            // category: parseInt(req.category_id, 10),
            // img: req.avatar,
            // description: req.description,
            // priceRange: req.price,
            // procedure: parseInt(req.procedure_id, 10),
            // status: req.status,
            // isDeleted: !req.isDeleted,
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
};

export const updateDetailsIsDelete = async (req) => {
    try {
        const res = await httpRequest.update('v1/product-details/status', {
            id: req.id,
            // name: req.name,
            // category: parseInt(req.category_id, 10),
            // img: req.avatar,
            // description: req.description,
            // priceRange: req.price,
            // procedure: parseInt(req.procedure_id, 10),
            // status: req.status,
            // isDeleted: !req.isDeleted,
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
};
