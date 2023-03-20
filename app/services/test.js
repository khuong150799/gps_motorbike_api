const rtree = require('rtree');
const util = require('util')

// Tạo cây R-tree với max_entries = 50 và min_entries = 25
const tree = rtree({max_entries: 50, min_entries: 25});

// Hàm truy vấn các điểm nằm trong bán kính distance (mét) xung quanh điểm với tọa độ (lat, lon)
function queryPoints(lat, lon, distance) {
  // console.log('lat',lat);
  const boundingBox = [lon - distance / (111320 * Math.cos(lat)), lat - distance / 111320, lon + distance / (111320 * Math.cos(lat)), lat + distance / 111320];
  console.log('boundingBox',boundingBox);
  const result = [];
  console.log('tree',util.inspect(tree, false, null, true /* enable colors */))
  
  tree.search({x:boundingBox[1],y:boundingBox[2],w:boundingBox[3],h:boundingBox[4]}).forEach(point => {
    console.log(687868967);
    if (getDistance(lat, lon, point.lat, point.lng) <= distance) {
      console.log('point',point);
      result.push(point);
    }
  });
  return result;
}

// Hàm tính khoảng cách giữa hai điểm với tọa độ (lat1, lon1) và (lat2, lon2)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // earth radius in meters
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Hàm chuyển đổi từ độ sang radian
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Truy vấn toàn bộ dữ liệu từ cơ sở dữ liệu MySQL
// connection.query('SELECT * FROM points', (error, results, fields) => {
//   if (error) throw error;
function insertTree(results,lat, lng, distance){
  
  results.forEach(point => {
    // console.log('lng',point.dataValues.lng);
    // console.log('lat',point.dataValues.lat);
    tree.insert({x:point.dataValues.lng, y:point.dataValues.lat, w:point.dataValues.lng, h:point.dataValues.lat}, point.dataValues);
  });
  
  // Truy vấn các điểm trong bán kính 500 mét xung quanh điểm với tọa độ (10.1234, 106.5678)
  const queryResult = queryPoints(lat, lng, distance);
  
  console.log('queryResult',queryResult);
}

// Tìm tất cả các điểm trong bán kính 500m từ điểm (lat, lng)
function searchWithinRadius(lat, lng, radius) {
  // Tính toán các giá trị tọa độ tương ứng với bán kính
  const latDelta = radius / 111000; // 111000 mét tương đương với 1 độ vĩ độ
  const lngDelta = radius / (111000 * Math.cos(lat * (Math.PI / 180))); // 1 độ kinh độ tại xích đạo tương đương với khoảng 111000 * cos(lat) mét
  
  // Tạo bounding box với các tọa độ xác định
  const bbox = { xmin: lng - lngDelta, ymin: lat - latDelta, xmax: lng + lngDelta, ymax: lat + latDelta };
  
  // Tìm kiếm bằng R-tree
  const results = tree.search(bbox);

  return results;
}

module.exports = insertTree

