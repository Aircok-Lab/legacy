var userPattern = {};

userPattern.setBuildingListPattern = function(buildingList) {
  if (!buildingList) return null;
  var insertStr = "," + "/";
  buildingList = buildingList.replace(/(\s*)/gi, "");
  if (!buildingList.endsWith(",")) buildingList = buildingList + ",";
  buildingList = buildingList.replace(/\,/g, insertStr);
  buildingList = "/" + buildingList;
  return buildingList;
};

userPattern.setPositionListPattern = function(positionList) {
  if (!positionList) return null;
  var insertStr = "," + "/";
  positionList = positionList.replace(/(\s*)/gi, "");
  if (!positionList.endsWith(",")) positionList = positionList + ",";
  positionList = positionList.replace(/\,/g, insertStr);
  positionList = "/" + positionList;
  return positionList;
};

userPattern.deletePattern = function(userInfo) {
  if (!userInfo) return null;
  delete userInfo.password;
  var insertStr = ",";
  var user = userInfo;
  if (userInfo.buildingList) {
    userInfo.buildingList = userInfo.buildingList.replace(/\,\//g, insertStr);
    if (userInfo.buildingList.endsWith(","))
      user.buildingList = userInfo.buildingList.slice(0, -1);
    if (userInfo.buildingList.startsWith("/"))
      user.buildingList = user.buildingList.substring(1);
  }

  if (userInfo.positionList) {
    userInfo.positionList = userInfo.positionList.replace(/\,\//g, insertStr);
    if (userInfo.positionList.endsWith(","))
      user.positionList = userInfo.positionList.slice(0, -1);
    if (userInfo.positionList.startsWith("/"))
      user.positionList = user.positionList.substring(1);
  }

  if (userInfo.deviceList) {
    userInfo.deviceList = userInfo.deviceList.replace(/\,\//g, insertStr);
    if (userInfo.deviceList.endsWith(","))
      user.deviceList = userInfo.deviceList.slice(0, -1);
    if (userInfo.deviceList.startsWith("/"))
      user.deviceList = user.deviceList.substring(1);
  }
  return user;
};

module.exports = userPattern;
