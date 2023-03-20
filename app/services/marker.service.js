const { default: axios } = require('axios');
const util = require('util');
const { tree } = require('../helper/rbush.helper');

exports.getAll = async (lat = 10.8231, lng = 106.6297, radius = 10000, result) => {
    try {
        // const center = { lat: 10.8231, lng: 106.6297 };
        // const radius = 10000;
        const R = 6371e3; // đường kính trái đất
        const latRadian = (lat * Math.PI) / 180;
        const lngRadian = (lng * Math.PI) / 180;
        const distance = radius / R;
        // console.log(distance);

        const minLat = latRadian - distance;
        const maxLat = latRadian + distance;
        const minLng = lngRadian - distance / Math.cos(latRadian);
        const maxLng = lngRadian + distance / Math.cos(latRadian);

        const minX = (minLng * 180) / Math.PI;
        const minY = (minLat * 180) / Math.PI;
        const maxX = (maxLng * 180) / Math.PI;
        const maxY = (maxLat * 180) / Math.PI;
        // console.log('tree', util.inspect(tree, false, null, true /* enable colors */));
        // console.log(tree.data.children.length);
        if (tree.data.children.length <= 0) {
            await axios({
                method: 'GET',
                url: 'http://localhost:3002/api/devices/getall',
            });
        }

        const _result = await tree.search({
            minX,
            minY,
            maxX,
            maxY,
        });

        // console.log(_result);
        // insertTree(resultRows,10.8231,106.6297,10000)
        // let resultEnd = [];
        // _result.forEach((value) => {
        //     console.log('value', value);
        //     console.log('resultEnd', resultEnd);
        //     if (!resultEnd.includes(value.id)) {
        //         resultEnd = [...resultEnd, value];
        //     }
        // });
        // console.log(resultEnd);
        result(null, _result);
    } catch (error) {
        console.log(error);
        result({ msg: error }, null);
    }
};
