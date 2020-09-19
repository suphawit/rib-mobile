angular.module('service.rtprequestService', [])
    .service('rtprequestService', function ($translate, invokeService, mainSession, kkconst, anyIDService) {
        this.resultRTPVerify = {};
        this.resultRTPConfirm = {};

        this.getAnyIDIcon = function(anyIDType){
             return anyIDService.getAnyIDinfo(anyIDType).icon;
        }

        this.getAnyIDIconColor = function (anyIDType) {
            return anyIDService.getAnyIDinfo(anyIDType).iconColor;
        };

        this.getAnyIDLabelName = function (anyIDType) {
            return anyIDService.getAnyIDinfo(anyIDType).LabelName;
        }

        this.setResultRTPVerify = function (data) {
			this.resultRTPVerify = data;
		}

		this.getResultRTPVerify = function () {
			return JSON.parse(JSON.stringify(this.resultRTPVerify));
        }
        
        this.setResultRTPConfirm = function (data) {
			this.resultRTPConfirm = data;
		}

		this.getResultRTPConfirm = function () {
			return JSON.parse(JSON.stringify(this.resultRTPConfirm));
        }

        function searchCategory(categoryList, name) {
            for (var i = 0; i < categoryList.length; i++) {
                if (categoryList[i].categoryName === name) {
                    return true;
                }
            }
            return false;
        }
        var getCategory = function (accountList) {
            var categoryList = [];
            var isFavourite = false;
            for (var key = 0; key < accountList.length; key++) {
                var account = accountList[key];
                if ((isFavourite == false) && (account.isFavourite === 'Y')) {
                    categoryList.splice(0, 0, { categoryName: window.translationsLabel[mainSession.lang]['label.favourite'] });
                    isFavourite = true;
                }
                var newCategory = !searchCategory(categoryList, account.categoryName);
                if (newCategory) {
                    categoryList.push({ categoryName: account.categoryName });
                }
            }
            return categoryList;
        }

        this.inquiryRTPInquiryAnyidOther = function (callback) {
            var request = {
                params: {
                },
                actionCode: 'ACT_RTP_INQUIRY_ANYID_OTHER',
                procedure: 'inquiryRTPInquiryAnyidOtherProcedure'
            };
            request.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                if (kkconst.success === resultCode) {
                    var accountList = resultObj.value;
                    var categoryList = getCategory(accountList);
                    var accountListObj = {
                        accountList: accountList,
                        categoryList: categoryList
                    }
                    callback(resultCode, accountListObj);
                } else {
                    callback(resultCode || kkconst.unknown);
                }
            };
            request.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                callback(resultCode || kkconst.unknown);
            };

            invokeService.executeInvokePublicService(request);
        };

        this.inquiryRTPInquiryAnyidMy = function (callback) {
            var request = {
                params: {
                },
                actionCode: 'ACT_RTP_INQUIRY_ANYID_MY',
                procedure: 'inquiryRTPInquiryAnyidMyProcedure'
            };
            request.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                if (kkconst.success === resultCode) {
                    callback(resultCode, resultObj);
                } else {
                    callback(resultCode || kkconst.unknown, resultObj);
                }
            };
            request.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                callback(resultCode || kkconst.unknown, resultObj);
            };

            invokeService.executeInvokePublicService(request);
        };

        this.verifyRTP = function (data, callback) {
            var request = {
                params: {
                    fromAnyIdType: data.fromAnyIdType,
                    fromAnyIdValue: data.fromAnyIdValue,
                    fromAccountNo: data.fromAccountNo,
                    toAnyIdType: data.toAnyIdType,
                    toAnyIdValue: data.toAnyIdValue,
                    amount: data.amount,
                    memo: data.memo
                },
                actionCode: 'ACT_RTP_VERIFY_CREATE',
                procedure: 'verifyCraeteRTPProcedure'
            };
            request.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                if (kkconst.success === resultCode) {
                    callback(resultCode, resultObj);
                } else {
                    callback(resultCode || kkconst.unknown);
                }
            };
            request.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                callback(resultCode || kkconst.unknown);
            };
            invokeService.executeInvokePublicService(request);
        }

        this.getRequestOTP = function (verifyTransactionId,callback) {
            var invokeAdapter = { adapter: 'otpAdapter' };
            var request = {
                params: {
                    actionOTP: 'create_rtp',
                    language: $translate.use(),
                    verifyTransactionId: verifyTransactionId
                },
                actionCode: 'ACT_REQUEST_OTP',
                procedure: 'requestOTPWithLoginProcedure'
            }
            request.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                if (kkconst.success === resultCode) {
                    callback(resultCode, resultObj);
                } else {
                    callback(resultCode || kkconst.unknown);
                }
            };

            request.onFailure = function (result) {
                var resultObj = result.responseJSON.result;
                var resultCode = resultObj.responseStatus.responseCode;
                callback(resultCode || kkconst.unknown);
            };

            invokeService.executeInvokePublicService(request, invokeAdapter);
        };

        this.confirmRTPRequest = function (data, callback) {

			var request = {
				params: {
					verifyTransactionId: data.verifyTransactionId
				},
				actionCode: 'ACT_RTP_CONFIRM_CREATE',
				procedure: 'confirmCraeteRTPProcedure'
			};

			request.onSuccess = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				if (kkconst.success === resultCode) {
					callback(resultCode, resultObj);
				} else {
					callback(resultCode || kkconst.unknown);
				}
			};

			request.onFailure = function (result) {
				var resultObj = result.responseJSON.result;
				var resultCode = resultObj.responseStatus.responseCode;
				callback(resultCode || kkconst.unknown);
			};

			invokeService.executeInvokePublicService(request);
		};
    });
