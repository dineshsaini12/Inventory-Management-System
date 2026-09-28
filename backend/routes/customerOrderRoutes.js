const express = require("express");

const router = express.Router();

const {
    createCustomerOrder,
    getAllCustomerOrders,
    getCustomerOrderDetails
} = require("../controllers/customerOrderController");


router.post(
    "/",
    createCustomerOrder
);


router.get(
    "/",
    getAllCustomerOrders
);


router.get(
    "/:orderId",
    getCustomerOrderDetails
);


module.exports = router;