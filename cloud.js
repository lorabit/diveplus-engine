var AV = require('leanengine');
var Coder = require('./coder');

var DiveGroup = AV.Object.extend('DiveGroup');
var DiveLog = AV.Object.extend('DiveLog');
var User = AV.Object.extend('_User');

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
	return res.error({"Error":"dsafd"});
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
	return res.error("fdsjklfk");

	var userId = req.params.UserId;
	var groupId = req.params.GroupId;

	// res.success({"Result": 1});

	if (!Coder.isValid(groupId)) {
		res.error({"Error":"Invalid group id"});
		return;
	}

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
					
					if (uid.id == userId) {
						// 去重
						res.error({"Error":"Already has divelog"});
						return;
					};

					if (isCreator) {
						theDivelog = divelog;
					};
				}

				// 复制日志
				var diveHour = theDivelog.get('durationDive') / 3600;
				var newDivelog = theDivelog.clone();
				var newUser = AV.Object.createWithoutData('_User', userId);
				newDivelog.set('user', newUser);
				newDivelog.set('logUUID', guid());
				newDivelog.set('isCreator', false);	
				newDivelog.set('logIndex', logCount + 1);

				newDivelog.save().then(function (divelog) {

					user.set('diveLogCount', logCount + 1);
					user.set('diveHourCount', logHour + diveHour);
					user.set('diveLogCountLife', logCountLife + 1);
					user.set('diveHourCountLife', logHourLife + diveHour);

					user.save().then(function (divelog) {

						res.success({"LogId": newDivelog.id});

					}, errorFn(res));

				}, errorFn(res));

  			}, errorFn(res));

		}
		else {
			res.error({"Error": "No such user"});
		}

	}, errorFn(res));

});

// 根据userID来获取divelog里面的buddys信息，后续将所有的字段的更新放在后台
AV.Cloud.define('DiveLog.GetGroupUserInfos', function(req, res) {
	
	var groupId = req.params.GroupId;

	var query = new AV.Query('DiveLog');
	query.equalTo('groupId', groupId);
	query.include('user');
	query.find().then(function (divelogs) {
		// res.success({"a":1});
		// return;
		if (divelogs && divelogs.length > 0) {
			var users = {};
			for (var i = 0; i < divelogs.length; i++) {
				var user = divelogs[i].get('user');
				users[user.id] = user.toJSON();
			}
			res.success(users);	
		}
		else {
			res.error({"Error": "GroupId not found"});
		}

	}, errorFn(res));
});

AV.Cloud.define('DiveLog.VarifyGroupId', function(req, res) {
	var groupId = req.params.GroupId;
	if (Coder.isValid(groupId)) {
		var query = new AV.Query('DiveLog');
		query.equalTo('groupId', groupId);
		query.find().then(function (divelogs) {
			if (divelogs && divelogs.length > 0) {
				res.success({"GroupId": groupId});
			}
			else {
				res.error({"Error": "GroupId does not exist"});
			}

		}, errorFn(res));
	}
	else{
		res.error({"Error": "Wrong GroupId format"})
	}
});
