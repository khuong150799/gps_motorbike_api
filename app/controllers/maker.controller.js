const markerService = require('../services/marker.service');

exports.getAll = (req, res, next) => {
    const { lat, lng, distance } = req.query;
    // console.log('params', params);
    markerService.getAll(lat, lng, distance, (err, result) => {
        if (err) {
            res.send({ result: false, error: err });
            return;
        }
        res.send({
            result: true,
            data: result,
        });
    });
};
