var AV = require('leanengine');
var Coder = require('./coder');

// 获取用户名 request.currentUser.get("username")
// 判断是否登录 if(request.currentUser)

AV.Cloud.define('DiveLog.GetGroupId', function(request) {
	var groupId;
	var logId = request.params.LogId;

	var DiveGroup = AV.Object.extend('DiveGroup');
	var diveGroup = new DiveGroup();
	var query = new AV.Query('DiveLog');
	query.get(logId).then(function (divelog) {
		groupId = divelog['groupId']
		if (groupId) {
			return { "GroupId": request.params.LogId};
		}
		else {
			var DiveGroup = AV.Object.extend('DiveGroup');
			var diveGroup = new DiveGroup();
			diveGroup.save().then(function (diveGroup) {
				// 成功保存之后，更新code
				var groupIndex = diveGroup['index'];
				var groupCode = Coder.encode(parseInt(groupIndex));
				var varifyBit = groupCode[groupCode.length-1];

				return { "GroupId": groupCode, "Msg": "save" };

				// diveGroup['code'] = groupCode;
				// diveGroup['bit'] = varifyBit;

				// diveGroup.save().the(function (diveGroup) {
				// 	return { "GroupId": groupCode };
				// }, function (error) {
				// 	return { "GroupId": "" , "Error": error };
				// });
			}, function (error) {
				// 异常处理
				console.error('Failed to create new object, with error message: ' + error.message);
				return { "GroupId": "" , "Error": error };
			});
		}
	}, function (error) {
		return { "GroupId": "" , "Error": error };
	});
});

AV.Cloud.define('DiveLog.JoinGroup', function(request) {
	// 声明一个 Todo 类型for (var i = 0; i < alphabet.length; i++) {

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
	return { "GroupId": request.params.LogId};
});

// 根据userID来获取divelog里面的buddys信息，后续将所有的字段的更新放在后台
AV.Cloud.define('DiveLog.QueryDiveLog', function(request) {
	// var UserId = request.params.UserId;
	// var User = AV.Object.createWithoutData('User', 'UserId');
	// var query = new AV.Query('DiveLog');
	// query.equalTo('user', User);

	// query.find().then(function (results) {

 //  	}, function (error) {

 //  	});

	// return { "GroupId": request.params.LogId};
});

AV.Cloud.define('DiveLog.VarifyGroupID', function(request) {
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
	return { "GroupId": request.params.LogId};
});
