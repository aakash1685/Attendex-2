const getDistance = (ofcLat, ofcLng, userLat, userLng) => {
  const R = 6371e3;
  const φ1 = (ofcLat * Math.PI) / 180;
  const φ2 = (userLat * Math.PI) / 180;
  const Δφ = ((userLat - ofcLat) * Math.PI) / 180;
  const Δλ = ((userLng - ofcLng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

module.exports = getDistance;