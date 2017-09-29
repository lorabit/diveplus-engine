var AV = require('leanengine');


AV.Cloud.define('getGroupId', function(request) {
  return { "groupId": 1234};
});
