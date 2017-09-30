var AV = require('leanengine');
var Coder = require('./coder');

var DiveGroup = AV.Object.extend('DiveGroup');
var DiveLog = AV.Object.extend('DiveLog');

var errorFn = function (res) {
    return function (error) {
        res.error(error);
    }
};

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

// 获取用户名 request.currentUser.get("username")
// 判断是否登录 if(request.currentUser)

AV.Cloud.define('DiveLog.GetGroupId', function(req, res) {

	var logId = req.params.LogId;
	
	new AV.Query('DiveLog').get(logId).then(function (divelog) {

		var groupId = divelog.get('groupId');

		if (groupId) {
			res.success({"GroupId": groupId});
		}
		else {

			new DiveGroup().save().then(function (divegroup) {

				// 成功保存之后，更新code
				divegroup.fetch().then(function (divegroup) {

					var index = parseInt(divegroup.get('index'));
					var groupId = Coder.encode(index);
					
					divegroup.set('groupId', groupId);
					divegroup.set('bit', groupId[groupId.length-1]);
					divegroup.save();

					divelog.set('groupId', groupId);
					divelog.save();
        			
        			res.success({"GroupId": groupId});

    			}, errorFn(res));

			}, errorFn(res));

		}

	}, errorFn(res));

});

AV.Cloud.define('DiveLog.JoinGroup', function(req, res) {
	var userId = req.params.UserId;
	var groupId = req.params.GroupId;

	// res.success({"Result": 1});

	new AV.Query('_User').get(userId).then(function (user) {		
		if (user) {
			var logCount  = user.get('diveLogCount');
			var logHour = user.get('diveHourCount');
			var logCountLife = user.get('diveLogCountLife');
			var logHourLife = user.get('diveHourCountLife');

			var query = new AV.Query('DiveLog');
				query.equalTo('groupId', groupId);
				query.find().then(function (divelogs) {
				var theDivelog;
				for (var i = 0; i < divelogs.length; i++) {
					var divelog = divelogs[i];
					var uid = divelog.get('user');
					var isCreator = divelog.get('isCreator');
					if (uid == userId) {
						// 去重
						errorFn({"Error":"Already has divelog"});
					};
					if (isCreator) {
						theDivelog = divelog;
					};
				}

				var diveHour = theDivelog.get('durationDive') / 3600;
				var newDiveLog = theDivelog.clone();
				
				res.success(newDivelog.toFullJSON());

				// 复制日志
				// var newDivelog = AV.parseJSON(originDivelog.toFullJSON())

				theDivelog.id = '';
				theDivelog.set('user', userId);
				theDivelog.set('logUUID', guid());
				theDivelog.set('isCreator', false);
				theDivelog.set('diveLogCount', logCount + 1);
				theDivelog.set('diveHourCount', logHour + diveHour);
				theDivelog.set('diveLogCountLife', logCountLife + 1);
				theDivelog.set('diveHourCountLife', logHourLife + diveHour);				

				newDivelog.save();

				res.success({"Result": 1});

  			}, errorFn(res));

		}
		else {
			errorFn(res);
		}

	}, errorFn(res));

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
