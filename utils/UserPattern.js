var userPattern = {};

userPattern.setBuildingListPattern = function(buildingList) {
  var insertStr = "," + "/";
  buildingList = buildingList.replace(/(\s*)/gi, "");
  if (!buildingList.endsWith(",")) buildingList = buildingList + ",";
  buildingList = buildingList.replace(/\,/g, insertStr);
  buildingList = "/" + buildingList;
  return buildingList;
};

userPattern.setPositionListPattern = function(positionList) {
  var insertStr = "," + "/";
  positionList = positionList.replace(/(\s*)/gi, "");
  if (!positionList.endsWith(",")) positionList = positionList + ",";
  positionList = positionList.replace(/\,/g, insertStr);
  positionList = "/" + positionList;
  return positionList;
};

userPattern.deletePattern = function(userInfo) {
  delete userInfo.Password;
  var insertStr = ",";
  var user = userInfo;
  userInfo.BuildingList = userInfo.BuildingList.replace(/\,\//g, insertStr);
  if (userInfo.BuildingList.endsWith(","))
    user.BuildingList = userInfo.BuildingList.slice(0, -1);
  if (userInfo.BuildingList.startsWith("/"))
    user.BuildingList = user.BuildingList.substring(1);

  userInfo.PositionList = userInfo.PositionList.replace(/\,\//g, insertStr);
  if (userInfo.PositionList.endsWith(","))
    user.PositionList = userInfo.PositionList.slice(0, -1);
  if (userInfo.PositionList.startsWith("/"))
    user.PositionList = user.PositionList.substring(1);
  return user;
};

module.exports = userPattern;
