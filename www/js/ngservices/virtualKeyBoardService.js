/**
 * 
 */
angular.module('service.virtualKeyboard', []).factory('dataShareService', function($rootScope){
	var obj = {
		'target': {},
		'isVirtualKeyBoardActive': false,
		'setTarget': function(targetId, element){
			obj.target[targetId] = element;
		},
		'getTarget': function(targetId){
			return obj.target[targetId];
		},
		'removeTarget': function(targetId){
			obj.target[targetId] = undefined;
			delete obj.target[targetId];
		},
		'getModel': function(targetId){
			 return obj.target[targetId].model;
		},
		'setModel': function(targetId, value){
			obj.target[targetId].model = value;
		},
		'getOption': function(targetId){
			 return obj.target[targetId].option;
		},
		'setOption': function(targetId, value){
			obj.target[targetId].option = value;
		},
		'getElement': function(targetId){
			 return obj.target[targetId].element;
		},
		'setElement': function(targetId, value){
			obj.target[targetId].element = value;
		},
		'broadcast': function(msg, params){
			$rootScope.$broadcast(msg, params);
		}
	};
	
	return obj;
});