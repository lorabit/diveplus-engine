var AV = require('leanengine');


AV.Cloud.define('DiveLog.GetGroupId', function(request) {
  return { "groupId": 1234};
});
