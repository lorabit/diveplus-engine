var AV = require('leanengine');


// 获取用户名 request.currentUser.get("username")
// 判断是否登录 if(request.currentUser)

AV.Cloud.define('DiveLog.GetGroupId', function(request) {
	return { "GroupId": request.body.LogId};
	// 声明一个 Todo 类型
	var DiveGroup = AV.Object.extend('DiveGroup');
	// 新建一个 Todo 对象
	var diveGroup = new DiveGroup();
	// todo.set('title', '工程师周会');
	diveGroup.save().then(function (diveGroup) {
		// 成功保存之后，执行其他逻辑.
		console.log('New object created with objectId: ' + diveGroup.id);
	}, function (error) {
		// 异常处理
		console.error('Failed to create new object, with error message: ' + error.message);
	});
});
