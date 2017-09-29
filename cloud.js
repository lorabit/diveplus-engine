var AV = require('leanengine');


AV.Cloud.define('DiveLog.GetGroupId', function(request) {
  return { "GroupId": request.currentUser.get("name")};
});
