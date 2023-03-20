const router = require('express').Router();
const makerController = require('../controllers/maker.controller');
module.exports = (app) => {
    router.get('/getall', makerController.getAll);
    app.use('/api/maker', router);
};
