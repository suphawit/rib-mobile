/**
 *
 */
angular.module('service.common', [])

//Stored main session for website
	.service('mainSession', function (cordovadevice) {
		//'use strict';
		this.lang = '';
		this.loginDetailCAA = {};


		this.deviceUUID = 'bp11';


		this.deviceOS = '';
		this.devicName = '';
		this.devicModel = '';
		this.deviceToken = '';
		this.deviceOsVersion = '';
		this.deviceType = '';
		this.appVersion = '';

		this.lastConnection = '';

		this.accessToken = '';
		this.sessionToken = '';

		this.biometricType = '';
		this.countBioAction = 0;

		this.getConfig = function(callback){
			var paramkeyArray=['srvendpoint','srvendpointversion','openssl', 'urlpinning'];
			CustomConfigParameters.get(function(configData){
				// this.configValues = configData
				callback(configData);
			},function(err){
			console.log(err);
			},paramkeyArray);
		}
		

		this.createDeviceInfo = function () {
			if (cordovadevice.properties('platform') === 'preview') {

				this.deviceOS = 'OSX';
				this.devicName = 'device_name_test';
				this.devicModel = 'device.model';
				this.deviceToken = 'deviceToken';
				this.deviceOsVersion = 'device.version';
				this.deviceType = 'device.platform';
			} else {
				this.deviceOS = device.platform;
				this.devicName = device.model;
				this.devicModel = device.model;
				this.deviceToken = 'deviceToken';
				this.deviceOsVersion = device.version;
				this.deviceType = device.platform;
			}
			console.log('mainSession.createDeviceInfo device ', device);
		};

		this.createUserDeviceInfo = function () {
			// do something
		};

		this.createSession = function (loginDetail) {
			var logInresult = loginDetail;
			this.loginDetailCAA = {};
			this.loginDetailCAA.sessionToken = logInresult.sessionToken;
			this.loginDetailCAA.userID = logInresult.userID;
			this.loginDetailCAA.lastLogin = logInresult.lastLogin;
			this.loginDetailCAA.firstNameTH = logInresult.firstNameTH;
			this.loginDetailCAA.lastNameTH = logInresult.lastNameTH;
			this.loginDetailCAA.firstNameEN = logInresult.firstNameEN;
			this.loginDetailCAA.lastNameEN = logInresult.lastNameEN;
		};

		this.getSession = function () {
			return this.loginDetailCAA;
		}

		this.isJsonString = function (str) {
			try {
				var json = JSON.parse(str);
				return (typeof json === 'object');
			} catch (e) {
				return false;
			}
		}


	})

	.service('generalService', function () {
		//'use strict';
		var obj = {
			daysArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
			weekDayNamesArray: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			monthsArray: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			monthsFullNameArray: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			yearsArray: [],
			nextSixMonths: []
		};

		obj.onFocusClearAmount = function (field) {

			if (!field || parseInt(field) === 0) {
				return '';
			} else {
				return field;
			}

		};
		obj.onBlurFormatCurrency = function (field) {

			try {
				var val = this.parseNumber(field);
				var res = this.formatNumber(val);
				return res;
			}
			catch (ex) {
				return '0.00';
			}
		};

		obj.addCommas = function (field) {
			field += '';
			var x = field.replace(/[^0-9\.]+/g, '').split('.');

			var x1 = x[0];
			while (x1.charAt(0) === '0') {
				x1 = x1.substr(1);
			}

			var x2 = x.length > 1 ? x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}

			var scale = '.00';
			if (x2 !== '' && x2.length < 2) {
				scale = '.' + this.paddingRight(x2, '0', 2);
			}
			if (x2 !== '' && x2.length >= 2) {
				scale = '.' + x2.substring(0, 2);
			}

			var precision = '0';
			if (x1 !== '' && x1.length > 0) {
				precision = x1;
			}

			return precision + scale;
		};

		obj.formatNumber = function (field) {
			var res = '0.00';

			if (this.nullSafeTrim(field) !== '') {
				res = this.addCommas(field);
			}

			return res;
		};

		obj.parseNumber = function (field) {
			var res = '0.00';
			if (this.nullSafeTrim(field) !== '') {
				res = field.replace(/,/g, '');
			}

			return res;
		};

		//right padding s with c to a total of n chars
		obj.paddingRight = function (s, c, n) {
			if (!s || !c || s.length >= n) {
				return s;
			}

			var max = (n - s.length) / c.length;
			for (var i = 0; i < max; i++) {
				s += c;
			}

			return s;
		};

		obj.nullSafeTrim = function (field) {
			if (field === undefined || field === null || field === '') {
				return '';
			}
			field = field.toString();
			return field.replace(/^\s+|\s+$/g, '');
		};

		obj.CommifyNumber = function (x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}; //end commify

		obj.adjustText = function (text) {
			var transformedTxt = text;
			transformedTxt = transformedTxt.replace(/([^\sA-Z\-])|(^\-)+/g, "");
			transformedTxt = transformedTxt.replace("\- ", "-");
			transformedTxt = transformedTxt.replace(" \-", "-");
			transformedTxt = transformedTxt.replace(/\s\-+/g, '');
			transformedTxt = transformedTxt.replace(/\-\s+/g, '');
			transformedTxt = transformedTxt.replace(/^-+|-+$|(-)+/g, '$1');
			transformedTxt = transformedTxt.replace(/\s+/g, ' ');
			transformedTxt = transformedTxt.replace(/^\s+|\s+$/g, '');


			return transformedTxt;
		};

		obj.isEmpty = function (str) {
			return (!str || 0 === str.length);
		};
		obj.formatCurrency = function (payAmount) {
			var retVal = '0.00';
			if (payAmount !== undefined && payAmount !== 'undefined') {
				var amountData = payAmount.toString();
				if (amountData.indexOf('.') !== -1) {
					var array = amountData.split('.');
					var test = array[1].slice(0, 2);
					retVal = parseFloat(array[0] + '.' + test);
				} else {
					retVal = parseFloat(payAmount);
				}
			}
			return retVal;
		};

		obj.cloneObject = function (obj) {
			var returnObj = obj;
			if (obj) {
				returnObj = JSON.parse(JSON.stringify(obj));
			}
			return returnObj;
		};
		return obj;

	})
	.service('generalValueDateService', function () {
		//'use strict';
		var obj = {
			daysArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
			weekDayNames: ['label.weekDay.Sun', 'label.weekDay.Mon', 'label.weekDay.Tue', 'label.weekDay.Wed', 'label.weekDay.Thu', 'label.weekDay.Fri', 'label.weekDay.Sat'],
			weekDayNamesArray: ['label.weekDay.Sunday', 'label.weekDay.Monday', 'label.weekDay.Tuesday', 'label.weekDay.Wednesday', 'label.weekDay.Thursday', 'label.weekDay.Friday', 'label.weekDay.Saturday'],
			monthsArray: ['label.months.Jan', 'label.months.Feb', 'label.months.Mar', 'label.months.Apr', 'label.months.May', 'label.months.Jun', 'label.months.Jul', 'label.months.Aug', 'label.months.Sep', 'label.months.Oct', 'label.months.Nov', 'label.months.Dec'],
			monthsFullNameArray: ['label.months.January', 'label.months.February', 'label.months.March', 'label.months.April', 'label.months.MayFullName', 'label.months.June', 'label.months.July', 'label.months.August', 'label.months.September', 'label.months.October', 'label.months.November', 'label.months.December'],
			yearsArray: [],
			nextSixMonth: []
		};
		return obj;
	})
	.factory('BankCodesImgService', function (kkconst, anyIDService) {
		//'use strict';
		var obj = {
			bankCodeImagesList: {
				'000': { 'url': 'images/bank/000.png', 'color': '#D1D3D4', 'bankCode': '000', 'bankName': 'Bank' },
				'002': { 'url': 'images/bank/002.png', 'color': '#02419a', 'bankCode': '002', 'bankName': 'BBL' },
				'004': { 'url': 'images/bank/004.png', 'color': '#2FB457', 'bankCode': '004', 'bankName': 'KBAN' },
				'005': { 'url': 'images/bank/005.png', 'color': '#333B97', 'bankCode': '005', 'bankName': 'ABNA' },
				'006': { 'url': 'images/bank/006.png', 'color': '#00a4e4', 'bankCode': '006', 'bankName': 'KTB' },
				'008': { 'url': 'images/bank/008.png', 'color': '#007bc0', 'bankCode': '008', 'bankName': 'JPMO' },
				'009': { 'url': 'images/bank/009.png', 'color': '#e62129', 'bankCode': '009', 'bankName': 'OCBC' },
				'010': { 'url': 'images/bank/010.png', 'color': '#bc010c', 'bankCode': '010', 'bankName': 'BTMU' },
				'011': { 'url': 'images/bank/011.png', 'color': '#0379c3', 'bankCode': '011', 'bankName': 'TMB' },
				'014': { 'url': 'images/bank/014.png', 'color': '#592974', 'bankCode': '014', 'bankName': 'SCB' },
				'017': { 'url': 'images/bank/017.png', 'color': '#003a75', 'bankCode': '017', 'bankName': 'CITI' },
				'018': { 'url': 'images/bank/018.png', 'color': '#b3d457', 'bankCode': '018', 'bankName': 'SMBC' },
				'020': { 'url': 'images/bank/020.png', 'color': '#0072AA', 'bankCode': '020', 'bankName': 'SCBT' },
				'022': { 'url': 'images/bank/022.png', 'color': '#7e262b', 'bankCode': '022', 'bankName': 'CIMB' },
				'023': { 'url': 'images/bank/023.png', 'color': '#0168b3', 'bankCode': '023', 'bankName': 'RHB' },
				'024': { 'url': 'images/bank/024.png', 'color': '#00367b', 'bankCode': '024', 'bankName': 'UOBT' },
				'025': { 'url': 'images/bank/025.png', 'color': '#FFC425', 'bankCode': '025', 'bankName': 'AYUD' },
				'026': { 'url': 'images/bank/026.png', 'color': '#005395', 'bankCode': '026', 'bankName': 'MEGA' },
				'027': { 'url': 'images/bank/027.png', 'color': '#ee1b2e', 'bankCode': '027', 'bankName': 'BA' },
				'028': { 'url': 'images/bank/028.png', 'color': '#007856', 'bankCode': '028', 'bankName': 'CACI' },
				'029': { 'url': 'images/bank/029.png', 'color': '#04aeec', 'bankCode': '029', 'bankName': 'IOB' },
				'030': { 'url': 'images/bank/030.png', 'color': '#EC098D', 'bankCode': '030', 'bankName': 'GSB' },
				'031': { 'url': 'images/bank/031.png', 'color': '#ED1C24', 'bankCode': '031', 'bankName': 'HSBC' },
				'032': { 'url': 'images/bank/032.png', 'color': '#010088', 'bankCode': '032', 'bankName': 'DEUT' },
				'033': { 'url': 'images/bank/033.png', 'color': '#ff860b', 'bankCode': '033', 'bankName': 'GHB' },
				'034': { 'url': 'images/bank/034.png', 'color': '#13007d', 'bankCode': '034', 'bankName': 'AGRI' },
				'035': { 'url': 'images/bank/035.png', 'color': '#cc0000', 'bankCode': '035', 'bankName': 'EXIM' },
				'039': { 'url': 'images/bank/039.png', 'color': '#2f2a77', 'bankCode': '039', 'bankName': 'MHCB' },
				'045': { 'url': 'images/bank/045.png', 'color': '#019678', 'bankCode': '045', 'bankName': 'BNPP' },
				'052': { 'url': 'images/bank/052.png', 'color': '#a6002b', 'bankCode': '052', 'bankName': 'BOC' },
				'053': { 'url': 'images/bank/053.png', 'color': '#ed1b2e', 'bankCode': '053', 'bankName': 'SCOT' },
				'065': { 'url': 'images/bank/065.png', 'color': '#F57F20', 'bankCode': '065', 'bankName': 'TBAN' },
				'066': { 'url': 'images/bank/066.png', 'color': '#006F3B', 'bankCode': '066', 'bankName': 'ISBT' },
				'067': { 'url': 'images/bank/067.png', 'color': '#034EA2', 'bankCode': '067', 'bankName': 'TISC' },
				'069': { 'url': 'images/bank/069.png', 'color': '#594F74', 'bankCode': '069', 'bankName': 'KKB' },
				'070': { 'url': 'images/bank/070.png', 'color': '#c90205', 'bankCode': '070', 'bankName': 'ICBC' },
				'071': { 'url': 'images/bank/071.png', 'color': '#0060aa', 'bankCode': '071', 'bankName': 'TCRB' },
				'073': { 'url': 'images/bank/073.png', 'color': '#004f92', 'bankCode': '073', 'bankName': 'LH' },
				'079': { 'url': 'images/bank/079.png', 'color': '#007dba', 'bankCode': '079', 'bankName': 'ANZB' },
				'080': { 'url': 'images/bank/080.png', 'color': '#0379c3', 'bankCode': '080', 'bankName': 'SMTP' },
				'098': { 'url': 'images/bank/098.png', 'color': '#4674b2', 'bankCode': '098', 'bankName': 'SMEB' }
			}
		};
		obj.getBankCodeImagesList = function () {
			return obj.bankCodeImagesList;
		};
		obj.getBankCodeImg = function (bankCode, field) {

			var result = '';
			var bankcode = obj.bankCodeImagesList[bankCode] || obj.bankCodeImagesList['000'];

			if (field === 'image') {
				result = bankcode.url;
			} else if (field === 'color') {
				result = bankcode.color;
			} else {
				// do something
			}

			return result;
		};
		obj.getBankName = function (bankCode) {
			var bankList = obj.bankCodeImagesList[bankCode] || obj.bankCodeImagesList['000'];
			return bankList.bankName;
		};

		obj.getBankDataByBankCode = function (banksList, bankCode) {
			var returnValue = {};
			for (var i = 0; i < banksList.length; i++) {
				var item = banksList[i];
				if (item['bankCode'] === bankCode) {
					returnValue = item;
					break;
				}
			}
			return returnValue;
		};

		obj.setToShowAccountName = function(isorft, bankcode, anyidType){

			var isAnyid = anyIDService.isAnyID(anyidType)

			if(isAnyid === true){
				return false;
			}

			if(isorft === '0' && bankcode !== kkconst.bankcode.kkbank){
				return true;
			} else {
				return false;
			}




		};


		return obj;
	})
	.factory('ValidationService', function () {
		//'use strict';
		var obj = {};
		obj.verifyPhoneFormat = function (phoneNo) {
			var re = /^0\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
			return re.test(phoneNo);

		};

		obj.verifyEmailFormat = function (email) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			return re.test(email);
		};

		obj.verifyAliasName = function (name) {
			if (!name) {
				return false;
			}
			return name.length > 30 ? false : true;
		};

		obj.verifyAccountNo = function (data) {
			var expression = /^[0-9]*$/;
			return expression.test(data);
		};

		obj.verifyEWalletFormat = function (data) {
			var expression = /^\d{15}$/;
			return expression.test(data);
		};

		obj.covertStringIntoDate = function (strDate) {
			if (!strDate) {
				return '';
			}
			var pattern;
			if (strDate.indexOf('/') > -1) {
				pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
				return strDate.length > 7 ? new Date(strDate.replace(pattern, '$3-$2-$1')) : strDate;
			}

			if (strDate.indexOf('-') > -1) {
				pattern = /(\d{2})-(\d{2})-(\d{4})/;
				return strDate.length > 7 ? new Date(strDate.replace(pattern, '$3-$2-$1')) : strDate;
			}
		};

		obj.validSpecialChar = function(dataText){
			var expression = /[-!$%^&*()_+|~=`{}[:;<>?,.@#\]]/g;
			// prevent special character
			return expression.test(dataText)
		}

		obj.validNewline = function(dataText){
			var expression = /\n\r|\n|\r/g;
			// prevent newline character
			return expression.test(dataText);
		}

		return obj;
	})

	.factory('popupService', function ($ionicPopup, mainSession, $filter, cordovadevice) {
		//'use strict';
		var obj = {};

		obj.showErrorPopupMessage = function (title, respCode, option) {
			if (cordovadevice.properties('platform') !== 'preview' && cordovadevice.properties('platform') != null) {
				// WL.SimpleDialog.show(
				// 	this.convertTranslate(title), this.convertTranslate(respCode, option),
				// 	[{
				// 		text: this.convertTranslate('button.close'), handler: function () {
				// 			// do something
				// 		}
				// 	}]
				// );
				navigator.notification.alert(
					this.convertTranslate(respCode, option),
					function () {
						// do something
					},
					this.convertTranslate(title),
					this.convertTranslate('button.close')
				);
			} else {
				window.swal({
					title: this.convertTranslate(title),
					text: this.convertTranslate(respCode, option),
					type: "warning",
					closeButtonText: this.convertTranslate('button.close'),
					closeOnConfirm: true
				});
			}

		};
		obj.errorPopMsgCB = function (title, respCode, callback) {
			if (cordovadevice.properties('platform') !== 'preview' && cordovadevice.properties('platform') != null) {
				// WL.SimpleDialog.show(
				// 	this.convertTranslate(title), this.convertTranslate(respCode),
				// 	[{
				// 		text: this.convertTranslate('button.close'), handler: function () {
				// 			callback(true);
				// 		}
				// 	}]
				// );
				navigator.notification.alert(
					this.convertTranslate(respCode),
					function () {
						callback(true);
					},
					this.convertTranslate(title),
					this.convertTranslate('button.close')
				);
			} else {
				window.swal({
					title: this.convertTranslate(title),
					text: this.convertTranslate(respCode),
					type: "warning",
					closeButtonText: this.convertTranslate('button.close'),
					closeOnConfirm: true
				}, function () {
					callback(true);
				});
			}

		};
		// obj.showConfirmPopupMessage = function (title, respCode) {
		// 	var translationTitle = this.convertTranslate(title);
		// 	var confirmPopup = $ionicPopup.alert({
		// 		title: '<i class="icon ion-information-circled"> </i> ' + translationTitle,
		// 		cssClass: 'addNewAccPopup',
		// 		template: '<div translate="' + respCode + '"></div>'
		// 	});
		// 	confirmPopup.then(function (res) {
		// 		// do something
		// 	});
		// };

		obj.showConfirmPopupMessageCallback = function (title, respCode, callback, option) {
			if (cordovadevice.properties("platform") !== "preview" && cordovadevice.properties("platform") != null) {
				// WL.SimpleDialog.show(this.convertTranslate(title), this.convertTranslate(respCode,option), [
				// 	{
				// 		text: this.convertTranslate('button.ok'),
				// 		handler: function () { callback(true); }
				// 	}, {
				// 		text: this.convertTranslate('label.cancel'),
				// 		handler: function () { callback(false); }
				// 	}
				// ]);
				navigator.notification.confirm(
					this.convertTranslate(respCode,option),
					function (resultClick) {
						if(resultClick == 1) {
							callback(true);
						}else {
							callback(false);
						}
					},
					this.convertTranslate(title),
					[
						this.convertTranslate('button.ok'),
						this.convertTranslate('label.cancel')
					]
				);
			} else {
				window.swal({
						title: this.convertTranslate(title),
						text: this.convertTranslate(respCode,option),
						type: "warning",
						showCancelButton: true,
						confirmButtonText: this.convertTranslate('button.ok'),
						cancelButtonText: this.convertTranslate('label.cancel'),
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function (isConfirm) {
						if (isConfirm) {
							callback(true);
						} else {
							callback(false);
						}
					});
			}

		};

		obj.showConfirmBiometricPopupMessageCallback = function (title, respCode, callback, option) {
			if (cordovadevice.properties("platform") !== "preview" && cordovadevice.properties("platform") != null) {
				navigator.notification.confirm(
					this.convertTranslate(respCode,option),
					function (resultClick) {
						if(resultClick == 1) {
							callback(true);
						}else {
							callback(false);
						}
					},
					this.convertTranslate(title),
					[
						this.convertTranslate('button.allow'),
						this.convertTranslate('button.notallow')
					]
				);
			} else {
				window.swal({
						title: this.convertTranslate(title),
						text: this.convertTranslate(respCode,option),
						// type: "warning",
						showCancelButton: true,
						confirmButtonText: this.convertTranslate('button.allow'),
						cancelButtonText: this.convertTranslate('button.notallow'),
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function (isConfirm) {
						if (isConfirm) {
							callback(true);
						} else {
							callback(false);
						}
					});
			}

		};

		obj.showConfirmPopupDynamicMessageCallback = function (title, text, callback, option) {
			if (cordovadevice.properties("platform") !== "preview" && cordovadevice.properties("platform") != null) {
				// WL.SimpleDialog.show(this.convertTranslate(title), text, [
				// 	{
				// 		text: this.convertTranslate('button.ok'),
				// 		handler: function () { callback(true); }
				// 	}, {
				// 		text: this.convertTranslate('label.cancel'),
				// 		handler: function () { callback(false); }
				// 	}
				// ]);
				navigator.notification.confirm(
					text,
					function (resultClick) {
						if(resultClick == 1) {
							callback(true);
						}else {
							callback(false);
						}
					},
					this.convertTranslate(title),
					[
						this.convertTranslate('button.ok'),
						this.convertTranslate('label.cancel')
					]
				);
			} else {
				window.swal({
						title: this.convertTranslate(title),
						text: text,
						type: "warning",
						showCancelButton: true,
						confirmButtonText: this.convertTranslate('button.ok'),
						cancelButtonText: this.convertTranslate('label.cancel'),
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function (isConfirm) {
						if (isConfirm) {
							callback(true);
						} else {
							callback(false);
						}
					});
			}

		};

		obj.showRegisterPopupMessageCallback = function (title, respCode, callback) {
			if (cordovadevice.properties("platform") !== "preview" && cordovadevice.properties("platform") != null) {
				// WL.SimpleDialog.show(this.convertTranslate(title), this.convertTranslate(respCode), [
				// 	{
				// 		text: this.convertTranslate('label.register'),
				// 		handler: function () { callback(true); }
				// 	}, {
				// 		text: this.convertTranslate('label.cancel'),
				// 		handler: function () { callback(false); }
				// 	}
				// ]);
				navigator.notification.confirm(
					this.convertTranslate(respCode),
					function (resultClick) {
						if(resultClick == 1) {
							callback(true);
						}else {
							callback(false);
						}
					},
					this.convertTranslate(title),
					[
						this.convertTranslate('label.register'),
						this.convertTranslate('label.cancel')
					]
				);
			} else {
				window.swal({
						title: this.convertTranslate(title),
						text: this.convertTranslate(respCode),
						type: "warning",
						showCancelButton: true,
						confirmButtonText: this.convertTranslate('label.register'),
						cancelButtonText: this.convertTranslate('label.cancel'),
						closeOnConfirm: true,
						closeOnCancel: true
					},
					function (isConfirm) {
						if (isConfirm) {
							callback(true);
						} else {
							callback(false);
						}
					});
			}

		};
		// obj.showNormalPopupMessage = function (title, respCode) {
		// 	var translationTitle = this.convertTranslate(title);
		// 	var confirmPopup = $ionicPopup.alert({
		// 		title: '<i class="icon ion-checkmark-circled"> </i> ' + translationTitle,
		// 		cssClass: 'blueColorGeneralPopup',
		// 		template: '<div translate="' + respCode + '"></div>'
		// 	});
		// 	confirmPopup.then(function (res) {
		// 		// do something
		// 	});
		// };

		//Using translation js function for title
		obj.convertTranslate = function (str, option) {
			var strConvert = $filter('translate')(str, (option || {}));

			if(strConvert.indexOf('RIB-E-') > -1){
				strConvert = $filter('translate')('RIB-E-UNK999', (option || {}));
			}

			return strConvert;
		};

		obj.savedPopup = {};

		obj.showNormalPopupMessageCallback = function (title, respCode, callback) {
			if (cordovadevice.properties("platform") !== "preview" && cordovadevice.properties("platform") != null) {
				// WL.SimpleDialog.show(
				// 	this.convertTranslate(title), this.convertTranslate(respCode),
				// 	[{
				// 		text: this.convertTranslate('button.ok'), handler: function () {
				// 			callback(true);
				// 		}
				// 	}]
				// );
				navigator.notification.alert(
					this.convertTranslate(respCode),
					function () {
						callback(true);
					},
					this.convertTranslate(title),
					this.convertTranslate('button.ok')
				);
			} else {
				window.swal({
						title: this.convertTranslate(title),
						text: this.convertTranslate(respCode),
						type: "warning",
						closeButtonText: this.convertTranslate('button.ok'),
						closeOnConfirm: true
					},
					function (isConfirm) {
						console.log(isConfirm);
						if (isConfirm) {
							callback(true);
						}
					});
			}

		};

		return obj;
	})
	.service('resetPinVerifyUsersession', function () {
		//'use strict';
		this.obj = {};
	})
	.service('datePickerPluginService', function (mainSession, kkconst) {
		//'use strict';
		var options = {
			date: new Date(),
			mode: 'date'
		};
		this.getCal = function (successCallBack, failCallBack) {
			datePicker.show(options,
				function (result) {
					successCallBack(result);
				}, function (result) {
					failCallBack(result);
				});
		};
		this.setLocal = function (localCallBack) {
			var nativeLocal = 'en_EN';
			if (mainSession.lang === kkconst.LANGUAGE_th) {
				nativeLocal = 'th_TH';
			}
			localCallBack(nativeLocal);
		};
	})
	.service('dateService', function ($ionicModal, $rootScope, invokeService, generalValueDateService, datePickerPluginService, $filter, $ionicLoading, mainSession, kkconst, $q, cordovadevice, connectionService) {// NOSONAR
		//'use strict';
		this.obj = {};

		this.recurringTypesLangs = { th: [{ name: 'ทุกสัปดาห์', value: 1 }, { name: 'ทุกเดือน', value: 2 }], en: [{ name: 'Every Week', value: 1 }, { name: 'Every Month', value: 2 }] };

		this.timeOfRecurringTypesLangs = { th: [{ name: '1 ครั้ง', value: 1 }, { name: '2 ครั้ง', value: 2 }, { name: '3 ครั้ง', value: 3 }, { name: '4  ครั้ง', value: 4 }, { name: '5 ครั้ง', value: 5 }, { name: '6 ครั้ง', value: 6 }], en: [{ name: '1 time', value: 1 }, { name: '2 times', value: 2 }, { name: '3 times', value: 3 }, { name: '4 times', value: 4 }, { name: '5 times', value: 5 }, { name: '6 times', value: 6 }] };

		this.timeOfMutualFund = { th: [{ name: '3 เดือน', value: 0 }, { name: '6 เดือน', value: 1 }, { name: '12 เดือน', value: 2 }], en: [{ name: '3 Month', value: 0 }, { name: '6 Month', value: 1 },{ name: '12 Month', value: 2 }]}

		this.today = function () {
			var def = $q.defer();
			$ionicLoading.show({ template: kkconst.SPINNER, noBackdrop: true });
			// var invocationData = {
			// 	adapter: kkconst.mainAdapter,
			// 	procedure: 'fetchCurrentDateProcedure',
			// 	parameters: ''
			// };


			// var request = new WLResourceRequest('/adapters/' + invocationData.adapter + '/' + invocationData.procedure, WLResourceRequest.POST);
			// request.setTimeout(36000);
			// var newParams = { 'params': '' };
			//
			// request.sendFormParameters(newParams).then(
			// 	function (result) {
			// 		$ionicLoading.hide();
			// 		if (result.responseJSON.isSuccessful) {
			// 			var date_json = result.responseJSON;
			// 			def.resolve(date_json);
			// 		}
			// 		else {
			// 			def.resolve(false);
			// 		}
			// 	},
			// 	function (error) {
			// 		$ionicLoading.hide();
			// 		def.resolve(false);
			// 	}
			// );

			var obj = new Object();
			obj.params = {};

			obj.actionCode = 'getDateTime';
			obj.procedure = 'getDateTime';

			obj.onSuccess = function(result) {
				result.responseJSON.result.month -= 1;
				console.log('obj.onSuccess  result', JSON.stringify(result))
				def.resolve(result.responseJSON.result);
			};
			obj.onFailure = function(result) {
				def.resolve(true);
			};
			// Execute
			invokeService.executeInvokePublicService(obj);

			return def.promise;

		};
		var datePickerPlatfrom = {};
		var datePickPlatform = function(startD){
			if (mainSession.deviceOS === 'iOS') {
				datePickerPlatfrom = datePicker;
				return $filter('date')(startD, 'yyyy-MM-dd');
			} else {
				datePickerPlatfrom = datePickerAndroid;
				return $filter('date')(startD, 'yyyy-MM-dd 00:00:01');
			}
		};
		var checkDefaultDateStr = function(str,defultDateSt){
			if (str === undefined) {
				return defultDateSt;
			}
			return str;
		};
		var mindateStr = '';
		var setFutureScheduleDate = function (todayParam, defaultDateStr, callback) {

			var nativeLocal = 'en_EN';
			datePickerPluginService.setLocal(function (local) {
				nativeLocal = local;
			});
			var startDate = new Date(todayParam);
			startDate.setDate(startDate.getDate() + 1);


			var endDate = new Date(todayParam);
			endDate.setDate(endDate.getDate() + kkconst.config.datelimit);

			mindateStr = datePickPlatform(startDate);

			var defultDateStart = $filter('date')(startDate, 'yyyy-MM-dd');
			var maxDateStr = $filter('date')(endDate, 'yyyy-MM-dd');

			defaultDateStr = checkDefaultDateStr(defaultDateStr,defultDateStart);

			var options = {
				date: new Date(defaultDateStr),
				mode: 'date',
				locale: nativeLocal,
				minDate: Date.parse(new Date(mindateStr)),
				maxDate: Date.parse(new Date(maxDateStr))
			};

			datePickerPlatfrom.show(options, function (date) {
				if (date) {
					var dateObj = {};
					var recieveDateObj = {};
					var strDate;
					dateObj.date = date.getDate();
					dateObj.weekDayArray = generalValueDateService.weekDayNamesArray[date.getDay()];
					dateObj.monthFullArray = generalValueDateService.monthsFullNameArray[date.getMonth()];
					dateObj.year = date.getFullYear();
					recieveDateObj.date = date.getDate();
					recieveDateObj.mouth = date.getMonth() + 1;
					recieveDateObj.year = date.getFullYear();
					strDate = recieveDateObj.date + '/' + recieveDateObj.mouth + '/' + recieveDateObj.year;
					if ((recieveDateObj.date < 10) && (recieveDateObj.mouth < 10)) {
						strDate = ('0' + recieveDateObj.date) + '/' + ('0' + recieveDateObj.mouth) + '/' + recieveDateObj.year;
					} else if (recieveDateObj.mouth < 10) {
						strDate = recieveDateObj.date + '/' + ('0' + recieveDateObj.mouth) + '/' + recieveDateObj.year;
					} else if (recieveDateObj.date < 10) {
						strDate = ('0' + recieveDateObj.date) + '/' + recieveDateObj.mouth + '/' + recieveDateObj.year;
					} else {
						// do something
					}


					var dateStr = date.getDate();
					var monthNum = date.getMonth() + 1;

					if (dateObj.date < 10) {
						dateStr = '0' + dateObj.date;
					}
					if (monthNum < 10) {
						monthNum = '0' + (date.getMonth() + 1);
					}
					var defaultDPDateStr = dateObj.year + '-' + monthNum + '-' + dateStr;

					callback(dateObj, strDate, defaultDPDateStr);

				}

			}, function (err) {
				callback(null, null, null);
			});
		};
		var todayStr;
		this.selectFutureScheduleDate = function (defaultDateStr, callback) {
			this.today().then(function(result){

				if (result !== false) {

					var date = result.date;
					var month = result.month;
					var year = result.year;

					var dateStr = date;
					var monthNum = month + 1;

					if (date < 10) {
						dateStr = '0' + date;
					}
					if (monthNum < 10) {
						monthNum = '0' + (month + 1);
					}
					todayStr = year + '-' + monthNum + '-' + dateStr;

					setFutureScheduleDate(todayStr, defaultDateStr, function (dateObj, strDate, defultStr) {
						callback(dateObj, strDate, defultStr);
					});
				}else {
					callback(null, null, null);
				}
			});
		};

		var setBirthDate = function (todayParam, callback) {
			var strStartDate = '1970-01-01';
			var nativeLocal = 'en_EN';
			datePickerPluginService.setLocal(function (local) {
				nativeLocal = local;
			});
			var startDate = new Date(strStartDate);
			startDate.setDate(startDate.getDate() + 1);

			var endDate = new Date(todayParam);
			endDate.setDate(endDate.getDate() + 1);

			mindateStr = datePickPlatform(startDate);

			var defaultDateStr = $filter('date')(endDate, 'yyyy-MM-dd');
			var maxDateStr = $filter('date')(endDate, 'yyyy-MM-dd');

			var options = {
				date: new Date(defaultDateStr),
				mode: 'date',
				locale: nativeLocal,
				minDate: Date.parse(new Date(mindateStr)),
				maxDate: Date.parse(new Date(maxDateStr))
			};

			datePickerPlatfrom.show(options, function (date) {
				if (date) {
					var dateObj = {};
					var recieveDateObj = {};
					var strDate;
					dateObj.date = date.getDate();
					dateObj.weekDayArray = generalValueDateService.weekDayNamesArray[date.getDay()];
					dateObj.monthFullArray = generalValueDateService.monthsFullNameArray[date.getMonth()];
					dateObj.year = date.getFullYear();
					recieveDateObj.date = date.getDate();
					recieveDateObj.mouth = date.getMonth() + 1;
					recieveDateObj.year = date.getFullYear();
					strDate = recieveDateObj.date + '/' + recieveDateObj.mouth + '/' + recieveDateObj.year;
					if ((recieveDateObj.date < 10) && (recieveDateObj.mouth < 10)) {
						strDate = ('0' + recieveDateObj.date) + '/' + ('0' + recieveDateObj.mouth) + '/' + recieveDateObj.year;
					} else if (recieveDateObj.mouth < 10) {
						strDate = recieveDateObj.date + '/' + ('0' + recieveDateObj.mouth) + '/' + recieveDateObj.year;
					} else if (recieveDateObj.date < 10) {
						strDate = ('0' + recieveDateObj.date) + '/' + recieveDateObj.mouth + '/' + recieveDateObj.year;
					} else {
						// do something
					}

					var dateStr = date.getDate();
					var monthNum = date.getMonth() + 1;

					if (dateObj.date < 10) {
						dateStr = '0' + dateObj.date;
					}
					if (monthNum < 10) {
						monthNum = '0' + (date.getMonth() + 1);
					}
					var defaultDPDateStr = dateObj.year + '-' + monthNum + '-' + dateStr;

					callback(dateObj, strDate, defaultDPDateStr);
				}

			}, function (err) {
				callback(null, null, null);
			});
		};

		this.selectBirthDate = function(callback){
			this.today().then(function(result){
				if (result !== false) {

					var date = result.date;
					var month = result.month;
					var year = result.year;

					var dateStr = date;
					var monthNum = month + 1;

					if (date < 10) {
						dateStr = '0' + date;
					}
					if (monthNum < 10) {
						monthNum = '0' + (month + 1);
					}
					todayStr = year + '-' + monthNum + '-' + dateStr;

					setBirthDate(todayStr, function (dateObj, strDate, defultStr) {
						callback(dateObj, strDate, defultStr);
					});
				}
			});
		}
	})

	.service('displayUIService', function (generalService, mainSession, dateService) {
		//'use strict';
		var obj = {
			daysArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
			weekDayNamesArray: ['label.weekDay.Sunday', 'label.weekDay.Monday', 'label.weekDay.Tuesday', 'label.weekDay.Wednesday', 'label.weekDay.Thursday', 'label.weekDay.Friday', 'label.weekDay.Saturday'],
			monthsArray: ['label.months.Jan', 'label.months.Feb', 'label.months.Mar', 'label.months.Apr', 'label.months.May', 'label.months.Jun', 'label.months.Jul', 'label.months.Aug', 'label.months.Sep', 'label.months.Oct', 'label.months.Nov', 'label.months.Dec'],
			monthsFullNameArray: ['label.months.January', 'label.months.February', 'label.months.March', 'label.months.April', 'label.months.MayFullName', 'label.months.June', 'label.months.July', 'label.months.August', 'label.months.September', 'label.months.October', 'label.months.November', 'label.months.December'],
			yearsArray: [],
			nextSixMonth: []
		};

		this.initLastSixMonthly = function (callback) {
			var lang = mainSession.lang;
			var currDate = new Date();
			var currMonth = currDate.getMonth() + 1;
			var month;
			var currYear = currDate.getFullYear();
			var criteriaMonthlyList = [];
			for (var i = 0; i < 6; i++) {
				currMonth--;
				if (currMonth < 0) {
					currYear = currDate.getFullYear() - 1;
					currMonth = 12 + currMonth;
				}
				if (currMonth < 9) {
					month = '0' + (currMonth + 1);
				}
				else {
					month = currMonth + 1;
				}

				criteriaMonthlyList.push({
					monthYear: window.translationsLabel[lang][obj.monthsFullNameArray[currMonth]] + ' ' + currYear,
					value: currYear + '-' + month
				});
			}
			callback(criteriaMonthlyList);
		};

		this.initLastFiveYear = function (callback) {
			dateService.today()
				.then(function (result) {
					var currYear = result.year;
					var yearList = [];
					for (var i = 0; i < 5; i++, currYear--) {
						yearList.push({
							year: currYear,
							value: currYear
						});
					}
					callback(yearList);
				});
		};

		this.convertDateTimeForUI = function (dateTime) {
			//Format 01-jan-2016
			var dateTimeUI = dateTime.split('/');
			var result = {};
			if (dateTimeUI[0].indexOf('0') === '0') {
				result.date = dateTimeUI[0].slice(1);
			} else {
				result.date = dateTimeUI[0];
			}
			if (dateTimeUI[1].indexOf('0') === '0') {
				var resultMonth = dateTimeUI[1].slice(0);
				result.monthNo = dateTimeUI[1];
				result.month = obj.monthsArray[resultMonth - 1];
			} else {
				result.month = obj.monthsArray[dateTimeUI[1] - 1];
				result.monthNo = dateTimeUI[1];
			}
			result.year = dateTimeUI[2].substring(0, dateTimeUI[2].length - 3);
			return result;
		};

		this.convertDateTimeForTxnDateUI = function (dateTime) {
			//Format 01-jan-2016
			var temp = dateTime.split(' ');
			dateTime = temp[0];
			var dateTimeUI = dateTime.split('/');
			var result = {};
			if (dateTimeUI[0].indexOf('0') === '0') {
				result.date = dateTimeUI[0].slice(1);
			} else {
				result.date = dateTimeUI[0];
			}
			if (dateTimeUI[1].indexOf('0') === '0') {
				var resultMonth = dateTimeUI[1].slice(0);
				result.monthNo = dateTimeUI[1];
				result.month = obj.monthsArray[resultMonth - 1];
			} else {
				result.month = obj.monthsArray[dateTimeUI[1] - 1];
				result.monthNo = dateTimeUI[1];
			}
			result.year = dateTimeUI[2].substring(0, 4);
			result.time = temp[1];
			return result;
		};

		this.convertDateNoTimeForUI = function (dateTime) {
			var dateTimeUI = '';
			if(dateTime == null){
				return '';
			}else{
				dateTimeUI = dateTime.split('/');
			}

			var result = {};
			if (dateTimeUI[0].indexOf('0') === '0') {
				result.date = dateTimeUI[0].slice(1);
			} else {
				result.date = dateTimeUI[0];
			}
			if (dateTimeUI[1].indexOf('0') === '0') {
				var resultMonth = dateTimeUI[1].slice(0);
				result.month = obj.monthsArray[resultMonth - 1];
				result.monthNo = dateTimeUI[1];
			} else {
				result.month = obj.monthsArray[dateTimeUI[1] - 1];
				result.monthNo = dateTimeUI[1];
			}
			result.year = dateTimeUI[2].substring(0, 4);
			return result;
		};

		this.convertDateTimeForTxnDateNoSecUI = function (dateTime) {
			var temp = dateTime.split(' ');
			dateTime = temp[0];
			var dateTimeUI = dateTime.split('/');
			var result = {};
			if (dateTimeUI[0].indexOf('0') === '0') {
				result.date = dateTimeUI[0].slice(1);
			} else {
				result.date = dateTimeUI[0];
			}
			if (dateTimeUI[1].indexOf('0') === '0') {
				var resultMonth = dateTimeUI[1].slice(0);
				result.monthNo = dateTimeUI[1];
				result.month = obj.monthsArray[resultMonth - 1];
			} else {
				result.month = obj.monthsArray[dateTimeUI[1] - 1];
				result.monthNo = dateTimeUI[1];
			}
			result.year = dateTimeUI[2].substring(0, 4);

			result.time =  temp[1].substring(0,5);
			return result;
		};


		this.convertForShowWeekDayDate = function (dateTime) {
			//Format 01-jan-2016

			var dateTimeUI = dateTime.split('/');
			var dt = new Date(dateTimeUI[2] + '-' + dateTimeUI[1] + '-' + dateTimeUI[0]);
			var result = {};
			result.dateTime = dateTimeUI[2] + '-' + dateTimeUI[1] + '-' + dateTimeUI[0];
			result.dayOfWeek = obj.weekDayNamesArray[dt.getDay()];
			result.date = dateTimeUI[0];
			if (dateTimeUI[1].indexOf('0') === '0') {
				var resultMonth = dateTimeUI[1].slice(0);
				result.month = obj.monthsFullNameArray[resultMonth - 1];
			} else {
				result.month = obj.monthsFullNameArray[dateTimeUI[1] - 1];
			}
			result.year = dateTimeUI[2];
			return result;
		};


	}).service('connectionService', function ($sce, $rootScope, $state, $ionicLoading, mainSession, popupService, kkconst, whiteList, cordovadevice, cordovaNetworkInfo) {
	//'use strict';
	this.isCheckDevice = false;
	this.initNetworkSate = function () {

		var networkState = cordovaNetworkInfo.getNetworkType();
		var states = {};
		states[Connection.UNKNOWN] = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI] = 'WiFi connection';
		states[Connection.CELL_2G] = 'Cell 2G connection';
		states[Connection.CELL_3G] = 'Cell 3G connection';
		states[Connection.CELL_4G] = 'Cell 4G connection';
		states[Connection.CELL] = 'Cell generic connection';
		states[Connection.NONE] = 'No network connection';

		if (this.isCheckDevice) {
			this.isCheckDevice = false;
			if (states[networkState] === states[Connection.WIFI]) {
				if (mainSession.lastConnection !== states[Connection.WIFI]) {
					popupService.showErrorPopupMessage('label.warning', 'label.cellConnect');
					mainSession.lastConnection = states[Connection.WIFI];
				}
			} else {
				mainSession.lastConnection = '';
			}
		}
	};

	this.check = function () {
		//alert("Check1");
		if (cordovadevice.properties('platform') !== 'preview') {
			this.initNetworkSate();
		}
		return true;
	};

	this.sendFormParamsSuccess = function (result, obj) {
		console.log('sendFormParamsSuccess', result);
		//parse to json object follow by old structure
		result.responseJSON = JSON.parse(result.data);
		//remove string return data
		delete result.data;

		var popupAndGotoMenuState = function (msgCode) {
			popupService.errorPopMsgCB('lable.error', msgCode, function (ok) {
				if (ok) {
					// $state.go(kkconst.ROUNTING.MENU.STATE);
					// // WL.Client.reloadApp();
					// location.reload();
					window.location = window.location.href.replace(/#.*/, '');
				}
			});
		};

		if (result.responseJSON.result && result.responseJSON.result.responseStatus.responseCode === kkconst.invalidToken) {
			popupAndGotoMenuState(kkconst.invalidToken);
			return;
		} else if (result.responseJSON.result && result.responseJSON.result.responseStatus.responseCode === kkconst.tokenTimeOut) {
			popupAndGotoMenuState(kkconst.tokenTimeOut);
			return;
		} else if (result.responseJSON.result && result.responseJSON.result.responseStatus.responseCode === kkconst.DISABLE_APP) {
			connectionService.disableApp();
			return;
		} else if (result.responseJSON.result && result.responseJSON.result.responseStatus.responseCode === kkconst.FORCE_UPDATE) {
			connectionService.forceUpdate(result.responseJSON);
			return;
		}else if (result.responseJSON.result && result.responseJSON.result.responseStatus === undefined) {
			result.responseJSON.result = {};
			result.responseJSON.result.responseStatus = {};
			var responseStatus = result.responseJSON.result.responseStatus;
			responseStatus.responseCode = 'RIB-E-CONN02';
		}else {
			console.log(mainSession.lang)
			if (result.responseJSON.result && result.responseJSON.result.responseStatus) {
				if (mainSession.lang == 'en') {
					result.responseJSON.result.responseStatus.errorMessage = result.responseJSON.result.responseStatus.errorMessageEn;
					result.responseJSON.errorMessage = result.responseJSON.result.responseStatus.errorMessageEn;
				}else {
					result.responseJSON.result.responseStatus.errorMessage = result.responseJSON.result.responseStatus.errorMessageTh;
					result.responseJSON.errorMessage = result.responseJSON.result.responseStatus.errorMessageTh;
				}
			}
		}
		$rootScope.$apply(function () {
			$ionicLoading.hide();
			obj.onSuccess(result);
		});
	};

	this.sendFormParamsError = function (error, obj) {
		console.log('sendFormParamsError', error);
		error.responseJSON = {};
		var err = JSON.parse(error.error);
		console.log('sendFormParamsError err', err);
		error.responseJSON.result = err.error_response;

		// var errorMsg = error.responseJSON.errorMessage;
		// if (error.responseJSON.result === undefined && errorMsg === kkconst.invalidToken) {
		// 	popupService.showErrorPopupMessage('lable.error', errorMsg);
		// 	// $state.go(kkconst.ROUNTING.MENU.STATE);
		// 	// // WL.Client.reloadApp();
		// 	// location.reload();
		//
		// 	window.location = window.location.href.replace(/#.*/, '');
		// }
		if (error.responseJSON.result && error.responseJSON.result.responseStatus === undefined) {
			error.responseJSON.result = {};
			error.responseJSON.result.responseStatus = {};
			var responseStatus = error.responseJSON.result.responseStatus;
			responseStatus.responseCode = 'RIB-E-CONN02';
			error.responseJSON.result.responseStatus = responseStatus
		}else {
			if (mainSession.lang == 'en') {
				error.responseJSON.result.responseStatus.errorMessage = error.responseJSON.result.responseStatus.errorMessageEn;
				error.responseJSON.errorMessage = error.responseJSON.result.responseStatus.errorMessageEn;
			}else {
				error.responseJSON.result.responseStatus.errorMessage = error.responseJSON.result.responseStatus.errorMessageTh;
				error.responseJSON.errorMessage = error.responseJSON.result.responseStatus.errorMessageTh;
			}
		}
		$rootScope.$apply(function () {
			$ionicLoading.hide();
			obj.onSuccess(error);
		});
	};

	this.getFormParamsSuccess = function (result, obj) {

		//parse to json object follow by old structure
		result.responseJSON = JSON.parse(result.data);
		//remove string return data
		delete result.data;

		$rootScope.$apply(function () {
			obj.onSuccess(result);
		});

		$ionicLoading.hide();
	};
	this.pinTrustedCert = function (obj, urlRequest, newParams) {
		const options = {
			method: 'post',
			timeout: kkconst.SERVICE_TIMEOUT,
			data: {}
		};
		options.data = newParams;
		console.log('options.data', JSON.stringify(options.data))
		// var url = kkconst.SERVER_ENDPOINT + kkconst.SERVER_ENDPOINT_VERSION + urlRequest;
		var connectionService = this;
		connectionService.SSLChecker(obj.procedure, function (result) {
			if (result === true) {

				var popupAndGotoMenuState = function (msgCode) {
					popupService.errorPopMsgCB('lable.error', msgCode, function (ok) {
						if (ok) {
							// $state.go(kkconst.ROUNTING.MENU.STATE);
							// // WL.Client.reloadApp();
							// location.reload();
							window.location = window.location.href.replace(/#.*/, '');
						}
					});
				};
				// check internet status
				if (cordovaNetworkInfo.getNetworkType() !== 'none') {
					
					var analytics = {};
					analytics.trackingObj = {};
					analytics.type = "analytic";
					analytics.uuid = mainSession.deviceUUID;
					analytics.appID = "com.kiatnakinbank.kkebanking." + mainSession.deviceOS;
					analytics.appVersion = mainSession.appVersion;

					analytics.deviceOS = mainSession.deviceOS;
					analytics.deviceName = mainSession.devicName;
					analytics.deviceModel = mainSession.devicModel;
					analytics.deviceToken = mainSession.deviceToken;
					analytics.deviceVersion = mainSession.deviceOsVersion;
					analytics.deviceType = mainSession.deviceType;	
					analytics.trackingObj = obj.params.header;

					cordova.plugin.http.setHeader('Authorization', 'Bearer ' + mainSession.accessToken);
					// cordova.plugin.http.setHeader('kk-application-id', 'rib.kiatnakin.com');
					// cordova.plugin.http.setHeader('kk-application-version', '1.0.0');
					cordova.plugin.http.setHeader('kk-application-id', analytics.appID);
					//4.4.1 -> disable
					//4.4.3 -> force update
					//4.4.4 -> apple review
					cordova.plugin.http.setHeader('kk-application-version', analytics.appVersion);
					// cordova.plugin.http.setHeader('kk-application-version', '4.4.3');
					cordova.plugin.http.setHeader('x-analytic', JSON.stringify(analytics));
					cordova.plugin.http.setDataSerializer('json');
					// cordova.plugin.http.setRequestTimeout(kkconst.SERVICE_TIMEOUT);
					mainSession.getConfig(function(values){
						cordova.plugin.http.sendRequest(values.srvendpoint + '/'+ values.srvendpointversion + urlRequest, options, function(response) {
							// prints 200
							connectionService.sendFormParamsSuccess(response,obj);
							// $ionicLoading.hide();
						}, function(e) {
							console.log('e', e)
							console.log('e.error == null', e.error == null)
							console.log('mainSession.isJsonString(e.error)', mainSession.isJsonString(e.error))
							$ionicLoading.hide();
							if (e.error == null || mainSession.isJsonString(e.error) === false) {
								if(obj.procedure === 'confirmFundTransferProcedure' || obj.procedure === 'ACT_GET_CUST_INFO') {
									var error = {error: "{\"error_response\":{\"language\":null,\"responseStatus\":{\"developerMessage\":null,\"errorMessageEn\":\"\",\"errorMessageTh\":\"\",\"httpStatus\":412,\"responseCode\":\"RIB-E-CONN02\",\"responseMessage\":\"\",\"responseNamespace\":\"\"}}}"};
									connectionService.sendFormParamsError(error, obj);
								}else {
									popupService.showErrorPopupMessage('lable.error', 'RIB-E-CONN02');
									
								}
								// popupAndGotoMenuState('RIB-E-CONN02');
							} else {
								var err = JSON.parse(e.error);
								console.log(err)
								if (obj.procedure === 'checkDeviceUUIDProcedure') {
									console.log('obj.procedure', obj.procedure)
									if (err.error_response != null && err.error_response.error_code == kkconst.DISABLE_APP) {
										console.log(kkconst.DISABLE_APP)
										connectionService.disableApp();
									} else if (err.error_response != null && err.error_response.error_code == kkconst.FORCE_UPDATE) {
										console.log(kkconst.FORCE_UPDATE)
										connectionService.forceUpdate(err.error_response);
									} else {
										console.log(err)
										popupService.showErrorPopupMessage('lable.error', 'RIB-E-UNK999');
										// popupAndGotoMenuState('RIB-E-CONN02');
									}
								}else if (obj.procedure === 'ACT_LOGOUT') {
									return;
								} else {
									if (err.error_response == null) {
										popupService.showErrorPopupMessage('lable.error', 'RIB-E-UNK999');
									} else if (err.error_response.responseStatus && err.error_response.responseStatus.responseCode == kkconst.invalidToken) {
										popupAndGotoMenuState(kkconst.invalidToken);
										return;
									} else if (err.error_response.responseStatus && err.error_response.responseStatus.responseCode == kkconst.tokenTimeOut) {
										popupAndGotoMenuState(kkconst.tokenTimeOut);
										return;
									} else if (err.error_response != null && err.error_response.error_code == kkconst.DISABLE_APP) {
										console.log(kkconst.DISABLE_APP)
										connectionService.disableApp();
										return;
									} else if (err.error_response != null && err.error_response.error_code == kkconst.FORCE_UPDATE) {
										console.log(kkconst.FORCE_UPDATE)
										connectionService.forceUpdate(err.error_response);
										return;
									// } else if(obj.procedure === 'syncUnitHolderFromPhatra') {
									// 	return;
									} else {
										connectionService.sendFormParamsError(e, obj);
									}
								}
							}
						});

					});
					

				} else {
					$ionicLoading.hide();
					popupAndGotoMenuState('RIB-E-CONN01');
				}
			} else {
				$ionicLoading.hide();
				popupService.errorPopMsgCB('lable.error', 'RIB-E-UNK999', function (ok) {
					if (ok) {
						// $state.go(kkconst.ROUNTING.MENU.STATE);
						// // WL.Client.reloadApp();
						// location.reload();
						window.location = window.location.href.replace(/#.*/, '');
					}
				});
			}
		});
	};
	this.getCurrentTimeFromServer = function (obj) {
		const options = {
			method: 'get',
			data: {}
		};
		// var url = kkconst.SERVER_ENDPOINT + '/getDateTime';
		var connectionService = this;
		connectionService.SSLChecker(obj.procedure, function (result) {
			if (result === true) {

				var popupAndGotoMenuState = function (msgCode) {
					popupService.errorPopMsgCB('lable.error', msgCode, function (ok) {
						if (ok) {
							// $state.go(kkconst.ROUNTING.MENU.STATE);
							// location.reload();
							window.location = window.location.href.replace(/#.*/, '');
						}
					});
				};
				// check internet status
				if (cordovaNetworkInfo.getNetworkType() !== 'none') {
					cordova.plugin.http.setHeader('kk-application-id', "com.kiatnakinbank.kkebanking." + mainSession.deviceOS);
					cordova.plugin.http.setHeader('kk-application-version', '1.0.0');
					cordova.plugin.http.setDataSerializer('json');
					cordova.plugin.http.setRequestTimeout(kkconst.SERVICE_TIMEOUT);

					mainSession.getConfig(function(values){
						cordova.plugin.http.sendRequest(values.srvendpoint + '/getDateTime', options, function(response) {
							// prints 200
							console.log(JSON.stringify(response))
							connectionService.getFormParamsSuccess(response, obj);
						}, function(e) {
								console.log(JSON.stringify(e))
						});
					});

				} else {
					$ionicLoading.hide();
					popupAndGotoMenuState('RIB-E-CONN01');
				}
			} else {
				$ionicLoading.hide();
				popupService.errorPopMsgCB('lable.error', 'RIB-E-UNK999', function (ok) {
					if (ok) {
						// $state.go(kkconst.ROUNTING.MENU.STATE);
						// // WL.Client.reloadApp();
						// location.reload();
						window.location = window.location.href.replace(/#.*/, '');
					}
				});
			}
		});
	};

	this.webRequest = function (obj,urlRequest,newParams) {
		console.log('aedaede')
		var request = new WLResourceRequest(urlRequest, WLResourceRequest.POST, WLOpt);
		request.setTimeout(kkconst.SERVICE_TIMEOUT);
		request.sendFormParameters(newParams).then(

			function (result) {
				var respJSONresult = result.responseJSON.result;
				var responseInject = {};
				responseInject = result;
				if (respJSONresult === undefined || respJSONresult.responseStatus === undefined) {
					responseInject.responseJSON.result = {
						responseStatus: {
							responseCode: 'RIB-E-CONN02'
						}
					};
					$ionicLoading.hide();
					return;
				}
				if (respJSONresult.responseStatus.responseCode === kkconst.invalidToken) {
					$rootScope.$broadcast('eventInvalidToken', { result: false });
				} else {
					$rootScope.$apply(function () {
						obj.onSuccess(result);
					});
				}
				$ionicLoading.hide();

			},
			function () {

				if (obj.procedure === 'checkDeviceUUIDProcedure') {
					popupService.errorPopMsgCB('lable.error', 'RIB-E-AD0003', function (ok) {
						if (ok) {
							// $state.go(kkconst.ROUNTING.MENU.STATE);
							// // WL.Client.reloadApp();
							// location.reload();
							window.location = window.location.href.replace(/#.*/, '');
						}
					});
				} else {
					popupService.showErrorPopupMessage('lable.error', 'RIB-E-AD0003');
				}
				$ionicLoading.hide();

			}
		);
	};



	this.SSLChecker = function (procedure, callback) {
		var sslCertificateChecker = new SSLCertificateChecker();

		if (cordovadevice.properties('platform') === 'preview') {
			callback(true);
		} else {
			var fingerprint = kkconst.SERVER_SSL_FINGERPRINT_PINNING;

			mainSession.getConfig(function(values){
				if (values.openssl === 'true') {
					sslCertificateChecker.check(connectionSecure, connectionFalse, values.urlpinning, fingerprint);
	
				} else {
					cordova.plugin.http.setServerTrustMode('nocheck', function() {
	
						callback(true);
					}, function() {
						console.log('error :(');
					});
				}
			});
			
		}

		function connectionSecure(message) {
			// Message is always: CONNECTION_SECURE.
			// Now do something with the trusted server.
			cordova.plugin.http.disableRedirect(true, function() {
				console.log('success!');
			}, function() {
				console.log('error :(');
			});
			cordova.plugin.http.setSSLCertMode('pinned', function() {
				console.log('success!');
				callback(true);
			}, function() {
				console.log('error :(');
				callback(false);
			});
		}
		function connectionFalse(message) {

			//CONNECTION_NOT_SECURE OR CONNECTION FAIL.
			callback(false);
		}
		this.disableApp = function() {
			// Make app unusable
			document.body.style.backgroundColor = "#c8cbd0";

			document.getElementById("indexPage").innerHTML =

				'<div class="aligncenter ios-bar-maintain" style="text-align:center; font-size:16px">'
				+'  <table style="width:100%; max-width:720px; height:100vh;text-align:center;border:0px; '
				+'  margin-left:auto; margin-right:auto;" cellspacing="0" cellpadding="0">'
				+'        <tr>'
				+'            <td>'
				+'                <table style="width:100%; height:100vh; text-align:center;border:0px;" cellspacing="0" cellpadding="0">'
				+'                    <tbody>'
				+'                        <tr>'
				+'                            <td style="width:100%;  padding:10px; text-indent: 20px;  color: white;">'
				+'                                <div style=" padding:10px; background-color: #594F74;  text-align: left;">'
				+'		ธนาคารขอแจ้งปิดระบบงาน เพื่อปรับปรุงระบบ KKP e-Banking ให้มีประสิทธิภาพมากยิ่งขึ้น มีผลทำให้ไม่สามารถเข้าใช้งานระบบได้ จึงขออภัยในความไม่สะดวกมา ณ โอกาสนี้'
				+'                                     <br />'
				+'						<div style ="margin:5px 0px 0px 0px; padding:0px;">ติดต่อสอบถามเพิ่มเติม KKP Contact Center 02 165 5555</div> 		'
				+'                                </div>'
				+'                                <div style=" padding:10px; background-color: #696081;  text-align: left;">'
				+'											We would like to announce that KKP e-Banking is temporary closed in order to improve the KKP e-Banking performance. We apologize for any inconvenience and appreciate your understanding. '
				+'<br /><div style ="margin:5px 0px 0px 0px; padding:0px;">For more information, please contact KKP Contact Center 02 165 5555.</div>'
				+'                                </div>'
				+'									<div><img src="images/BrowserNotSupport.png" /></div>			'
				+'                            </td>'
				+'                        </tr>'
				+'                    </tbody>'
				+'                </table>'
				+'            </td>'
				+'        </tr>'
				+'    </table>'
				+'</div>';

			//window.location.href = "maintenance.html";
			// document.addEventListener('backbutton', onBackKeyDown, false);

		}

		this.forceUpdate =function(param) {
			// this.disableApp();
			var url = undefined;
			if (mainSession.deviceOS === 'Android') {
				url = param.url_android;
			}else {
				url = param.url_ios;
			}
			if (url === undefined) {
				url = 'https://google.com'
			}
			navigator.notification.alert(
				param.error_message,
				function () {
					console.log('click Download new version')
					window.open(url, '_system', 'location=no','hardwareback=no');
				},
				"New version available",
				"Download new version"
			);
			document.addEventListener("resume", function() {
				window.location = window.location.href.replace(/#.*/, '');
			});
		}
	};
})


	.service('statusBarService', function () {
		//'use strict';
		this.lightContent = function (isLight) {
			if (window.StatusBar) {
				if (isLight) {
					// Relies on UIViewControllerBasedStatusBarAppearance false
					window.StatusBar.styleLightContent();
				} else {
					window.StatusBar.styleDefault();
				}
				window.StatusBar.show();
			}
		};

	})
	.service('anyIDService', function (kkconst, fundtransferService, mainSession) {
		//'use strict';
		var _anyIDList;

		//check anyid type
		var _isAnyID = function (anyIDTYPE) {
			if (anyIDTYPE === kkconst.ANY_ID_TYPE.ACCOUNT || anyIDTYPE === undefined) {
				return false;
			} else {
				return true;
			}
		};

		var _getDefaultValidate = function(anyidType){
			var maxlengthValidate = {
				'ACCTNO':'20'
			};
			var returnLength = maxlengthValidate[anyidType];
			if(returnLength == undefined){
				return '20';
			}
			return	returnLength;

		};

		var _setMaxLength = function(length,anyidType){
			if(length > 0){
				return length;
			}
			return _getDefaultValidate(anyidType);

		}

		var _getAnyIDinfo = function(anyIDTYPE){
			var anyIDList = fundtransferService.anyIdTypeList;
			var maxLength;
			for(var i = 0; i < anyIDList.length; i++){
				var item = anyIDList[i];
				if (item.type === anyIDTYPE) {
					maxLength = _setMaxLength(item.valueLength, anyIDTYPE);
					return {
						'DescriptionName': mainSession.lang === kkconst.LANGUAGE_th ? item.descriptionTH : item.descriptionEN,
						'LabelName': mainSession.lang === kkconst.LANGUAGE_th ? item.labelTh : item.labelEn,
						'iconColor': item.iconColor,
						'icon': item.icon,
						'maxLength': maxLength
					};
				}
			}
			return false;
		};
		//for promptpay
		var _getAnyIDList = function () {
			return this._anyIDList;
		};

		var _setAnyIDList = function( anyIDList) {
			this._anyIDList = anyIDList;
		};

		return {
			isAnyID :_isAnyID,
			getAnyIDinfo :_getAnyIDinfo,
			getAnyIDList :_getAnyIDList,
			setAnyIDList: _setAnyIDList,
			getDefaultValidate : _getDefaultValidate
		};

	})
	.service('webStorage', function () {
		var prefix = 'kk.';
		var webStorageData = {
			setLocalStorage: function (key, value) {
				localStorage[prefix + key] = JSON.stringify(value);
			},
			getLocalStorage: function (key) {
				return localStorage[prefix + key] ? JSON.parse(localStorage[prefix + key]) : {};
			},
			removeLocalStorage: function(key){
				localStorage.removeItem(key);
			}
		};

		return webStorageData;
	}).service('downloadAndStoreFile', function ($http, webStorage, $q) {
	var storageKey = 'biller_logo_list';
	var defaultVersion = '1.0';
	var BILLER_FILE_VERSION = '';
	var MAX_SIZE = 3072; // 3MB
	var DATA_VERSION = '';

	var isLimit = function(){
		var data_size = Math.round(JSON.stringify(webStorage.getLocalStorage(storageKey)).length / 1024);
		return data_size > MAX_SIZE;
	};
	var createNewData = function(version){
		return {
			version: version ? version : defaultVersion,
			data: {}
		};
	};
	var checkDataVersion = function(version){
		var storage_data = webStorage.getLocalStorage(storageKey);
		var version_data = storage_data['version'];
		if(version && version !== version_data){
			webStorage.removeLocalStorage(storageKey);
			webStorage.setLocalStorage(storageKey, createNewData(version));
		}
	};
	var setDataToStorage = function(key, data, version){
		var storage_data = webStorage.getLocalStorage(storageKey);
		if (isLimit()){
			webStorage.removeLocalStorage(storageKey);
			storage_data = createNewData(version);
		}
		storage_data['data'][key] = data;
		webStorage.setLocalStorage(storageKey, storage_data);
	};

	this.getFromImageUrl = function(url) {
		var version = BILLER_FILE_VERSION;
		return $q(function(resolve, reject) {
			checkDataVersion(version);

			var filename = url.replace(/^.*[\\\/]/, '').split('.')[0];
			var storage_data = webStorage.getLocalStorage(storageKey);
			if (storage_data['data'][filename] === undefined){
				var img = new Image();
				img.setAttribute('crossOrigin', 'anonymous');

				img.onload = function () {
					var canvas = document.createElement("canvas");
					canvas.width = this.width;
					canvas.height = this.height;

					var ctx = canvas.getContext("2d");
					ctx.drawImage(this, 0, 0);

					var dataURL = canvas.toDataURL("image/png");
					var baseSixtyFour = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
					setDataToStorage(filename, baseSixtyFour, version);
					resolve(dataURL);
				};

				img.src = url;
			} else {
				resolve('data:image/png;base64,'+storage_data['data'][filename]);
			}
		});
	};

	this.getBillerIconName = function(billerdata){
		return billerdata.billerProfileId;
	};

	this.setBillerFileVersion = function(value){
		BILLER_FILE_VERSION = value || defaultVersion;
	};

	this.getDataVersion = function(){
		return DATA_VERSION;
	};

	this.setDataVersion = function(value){
		DATA_VERSION = value || defaultVersion;
	};

	this.setStoreData = function(key, data){
		var storage_data = createNewData(DATA_VERSION);
		storage_data['data'] = data;
		webStorage.setLocalStorage(key, storage_data);
	};

	this.getStoreData = function(key){
		return webStorage.getLocalStorage(key);
	};

	this.validDataVersion = function(key){
		return webStorage.getLocalStorage(key)['version'] == DATA_VERSION;
	}
});
