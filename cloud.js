var AV = require('leanengine');


// 获取用户名 request.currentUser.get("username")
// 判断是否登录 if(request.currentUser)

AV.Cloud.define('DiveLog.GetGroupId', function(request) {
  return { "GroupId": request.body.LogId};
});
