var AV = require('leanengine');


AV.Cloud.define('DiveLog.GetGroupId', function(request) {
  return { "GroupId": JSON.stringify(request)};
});
