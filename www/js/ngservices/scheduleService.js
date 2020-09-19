angular.module('service.scheduleService', [])
		.service('scheduleFundtransferService',function(mainSession, $ionicPopup, invokeService, displayUIService) {
			
			var _invokeAdapter = { adapter: 'FundTransferAdapter' };
			
			this.inquiryFundTransfer = function(callback) {
				var _invokeAdapter = { adapter: 'FundTransferAdapter' };
				var obj = {};	
				obj.params = {};
				obj.params.language = mainSession.lang;
				obj.actionCode = 'ACT_INQUIRY_FUND_TRANSFER_SCHEDULE'; //'ACT_INQUIRY_FUND_TRANSFER';
				obj.procedure = 'inquiryTransferScheduleProcedure'; //'inquiryFundTransferProcedure';

				obj.onSuccess = function(result) {
					var resultObj = result.responseJSON.result;
					callback(resultObj);
				};
				invokeService.executeInvokePublicService(obj, _invokeAdapter);
			};

			this.deleteFundTransferAllSchedule = function(param,
					callback) {
				var obj = {};
				obj.params = {};
				obj.params.masterTransactionId = param.masterTransactionID;
				obj.actionCode = 'ACT_DELETE_ALL_FUND_TRANSFER';
				obj.procedure = 'deleteAllFundTransferProcedure';

				obj.onSuccess = function(result) {
					var resultObj = result.responseJSON.result;
					callback(resultObj);
				};
				invokeService.executeInvokePublicService(obj, _invokeAdapter);
			};

			this.deleteFundTransferSchedule = function(param, callback) {
				var obj = {};
				obj.params = {};
				obj.params.transactionId = param.transactionID;
				obj.params.masterTransactionId = param.masterTransactionID;
				obj.actionCode = 'ACT_DELETE_FUND_TRANSFER';
				obj.procedure = 'deleteFundTransferProcedure';

				obj.onSuccess = function(result) {
					var resultObj = result.responseJSON.result;
					callback(resultObj);
				};
				invokeService.executeInvokePublicService(obj, _invokeAdapter);
			};

			this.inquiryFundTransferFee = function(param, callback) {
				var obj = {};
				obj.params = {};
				obj.params.transactionId = param.transactionID;
				obj.actionCode = 'ACT_INQUIRY_TRANSFER_FEE';
				obj.procedure = 'inquiryTransferFeeProcedure';

				obj.onSuccess = function(result) {
					var resultObj = result.responseJSON.result;
					callback(resultObj);
				};
				invokeService.executeInvokePublicService(obj, _invokeAdapter);
			};
			
		
			this.returnSetAccountList = function(data) {
				var daysDateArray = [];
				var tempDates = [];
				for (var i = 0; i < data.length; i++) {
					var recurringTimesVal = 0;
					var debDate = data[i].debitDate;
					var item = $.inArray(debDate, tempDates);
					if (item < 0) {
						tempDates.push(debDate);
						if (data[i].recurringTimes && data[i].recurringTimes !== "0") {
							recurringTimesVal = data[i].recurringTimes ;
						}
						daysDateArray
								.push({
									d : displayUIService.convertDateNoTimeForUI(debDate),
									items : [ {
										toEmail : data[i].toEmail,
										atsTransferDetails : data[i].atsTransferDetails,
										ownerAccount : data[i].ownerAccount,
										memo : data[i].memo,
										referenceNumber : data[i].referenceNumber,
										toAccountNumber : data[i].toAccountNumber,
										toAccountID		: data[i].toAccountID,
										recurringTimes : recurringTimesVal,
										atsReceiving : data[i].atsReceiving,
										amount : data[i].amount,
										scheduleType : data[i].scheduleType,
										creditDate : displayUIService.convertDateNoTimeForUI(data[i].creditDate),
										debitDate : displayUIService.convertDateNoTimeForUI(data[i].debitDate),
										debitDate1 : data[i].debitDate,
										masterTransactionID : data[i].masterTransactionID,
										toMobileNumber : data[i].toMobileNumber,
										msgLanguage : data[i].msgLanguage,
										status : data[i].status,
										addAccountType : data[i].addAccountType,
										fromAccountNumber : data[i].fromAccountNumber,
										fromAccountID : data[i].fromAccountID,
										toAliasName : data[i].toAliasName || data[i].toAccountAliasName,
										toAccountName : data[i].toAccountName,
										toCategoryID : data[i].toCategoryID,
										bankName : data[i].bankName,
										transactionID : data[i].transactionID,
										bankCode : data[i].bankCode,
										transferDate : data[i].transferDate,
										atsTransferDetail : data[i].atsTransferDetail,
										fromAliasName : data[i].fromAliasName,
										recurringType : data[i].recurringType,
										transactionDate : displayUIService.convertDateTimeForUI(data[i].transactionDate),
										anyIDType : data[i].anyIDType,
										fromBankCode : data[i].fromBankCode
									} ]
								});

					} else {
						// same date record already exists, just add its
						// more details/items/records
						if (data[i].recurringTimes && data[i].recurringTimes !== "0") {
							recurringTimesVal = data[i].recurringTimes;
						}
						if (daysDateArray[item]) {
							daysDateArray[item].items
									.push({
										toEmail : data[i].toEmail,
										atsTransferDetails : data[i].atsTransferDetails,
										ownerAccount : data[i].ownerAccount,
										memo : data[i].memo,
										referenceNumber : data[i].referenceNumber,
										toAccountNumber : data[i].toAccountNumber,
										toAccountID		: data[i].toAccountID,
										recurringTimes : recurringTimesVal,
										atsReceiving : data[i].atsReceiving,
										amount : data[i].amount,
										scheduleType : data[i].scheduleType,
										creditDate : displayUIService.convertDateNoTimeForUI(data[i].creditDate),
										debitDate : displayUIService.convertDateNoTimeForUI(data[i].debitDate),
										debitDate1 : data[i].debitDate,
										masterTransactionID : data[i].masterTransactionID,
										toMobileNumber : data[i].toMobileNumber,
										msgLanguage : data[i].msgLanguage,
										status : data[i].status,
										addAccountType : data[i].addAccountType,
										fromAccountNumber : data[i].fromAccountNumber,
										fromAccountID : data[i].fromAccountID,
										toAliasName : data[i].toAliasName || data[i].toAccountAliasName,
										toAccountName : data[i].toAccountName,
										toCategoryID : data[i].toCategoryID,
										bankName : data[i].bankName,
										transactionID : data[i].transactionID,
										bankCode : data[i].bankCode,
										transferDate : data[i].transferDate,
										atsTransferDetail : data[i].atsTransferDetail,
										fromAliasName : data[i].fromAliasName,
										recurringType : data[i].recurringType,
										transactionDate : displayUIService.convertDateTimeForUI(data[i].transactionDate),
										anyIDType : data[i].anyIDType,
										fromBankCode : data[i].fromBankCode
									});
						}
					}
				}

				return daysDateArray;
			};
		
			
		})
		.service('scheduleBillpaymentService',function(mainSession, $ionicPopup, invokeService, displayUIService) {

			this.inquiryScheduleBill = function(callback) {

				var obj = {};
				obj.params = {};
				obj.params.language = mainSession.lang;
				obj.actionCode = 'ACT_INQUIRY_BILL_SCHEDULE_PERIOD_PIB_RIB';
				obj.procedure = 'inquiryPayInfoPIBRIBProcedure';

				obj.onSuccess = function(result) {
					callback(result.responseJSON.result);
				};
				invokeService.executeInvokePublicService(obj);
			};

			this.deleteAllBillpaymemtSchudule = function(param, callback) {
				var obj = {};
				obj.params = {};
				obj.params.masterTransactionID = param.masterTransactionID;
				obj.actionCode = 'ACT_DELETE_BILL_SCHEDULE_ALL';
				obj.procedure = 'deleteBillPaymentProcedure';
				obj.onSuccess = function(result) {
					callback(result.responseJSON.result);
				};
				invokeService.executeInvokePublicService(obj);
			};

			this.deleteBillpaymemtSchudule = function(param, callback) {
				var obj = {};
				obj.params = {};
				obj.params.transactionID = param.transactionID;
				obj.actionCode = 'ACT_DELETE_BILL_SCHEDULE_ONETIME';
				obj.procedure = 'deleteAllBillPaymentProcedure';
				obj.onSuccess = function(result) {
					callback(result.responseJSON.result);
				};
				invokeService.executeInvokePublicService(obj);
			};

			this.returnSetBillList = function(data) {
				var daysDateArray = [];
				var tempDates = [];
				for (var i = 0; i < data.length; i++) {
					var recurringTimesVal = 0;
					var debDate = data[i].paymentDate;
					var item = $.inArray(debDate, tempDates);
					if (item < 0) {

						tempDates.push(debDate);
						if (data[i].recurringTimes && data[i].recurringTimes !== "0") {
							recurringTimesVal = data[i].recurringTimes;
						}
						daysDateArray
								.push({
									d : displayUIService.convertDateNoTimeForUI(debDate),
									items : [ {
										availableBalance : data[i].availableBalance,
										billPaymentType : data[i].billPaymentType,
										billPaymentTypeDesc : data[i].billPaymentTypeDesc,
										billerAliasName : data[i].billerAliasName,
										billerID : data[i].billerID,
										billerName : data[i].billerName,
										billerProfileId : data[i].billerProfileId,
										effectiveDate : data[i].effectiveDate,
										feeAmount : data[i].feeAmount,
										fromAccountNumber : data[i].fromAccountNumber,
										fromAliasName : data[i].fromAliasName,
										immediateType : data[i].immediateType,
										masterTransactionID : data[i].masterTransactionID,
										memo : data[i].memo,
										msgLanguage : data[i].msgLanguage,
										payAmount : data[i].payAmount,
										paymentDate : displayUIService.convertDateNoTimeForUI(data[i].paymentDate),
										paymentDate1 : data[i].paymentDate,
										paymentStatus : data[i].paymentStatus,
										paymentStatusDesc : data[i].paymentStatusDesc,
										recurringTimes : recurringTimesVal,
										recurringType : data[i].recurringType,
										reference1 : data[i].reference1,
										reference2 : data[i].reference2,
										reference3 : data[i].reference3,
										referenceNO : data[i].referenceNO,
										scheduleType : data[i].scheduleType,
										scheduleTypeDesc : data[i].scheduleTypeDesc,
										transactionDate : displayUIService.convertDateTimeForUI(data[i].transactionDate),
										transactionID : data[i].transactionID,
										refInfos: data[i].refInfos || [], //for add new bill schedule
										addNewBillerFlag: (data[i].addNewBillerFlag == 'Y'),
										profileCode: data[i].profileCode || '',
										promptPayBillerId: data[i].promptpayBillerId || ''
									} ]
								});

					} else {
						// same date record already exists, just add its
						// more details/items/records
						if (data[i].recurringTimes && data[i].recurringTimes !== "0") {
							recurringTimesVal = data[i].recurringTimes;
						}
						if (daysDateArray[item]) {
							daysDateArray[item].items
									.push({
										availableBalance : data[i].availableBalance,
										billPaymentType : data[i].billPaymentType,
										billPaymentTypeDesc : data[i].billPaymentTypeDesc,
										billerAliasName : data[i].billerAliasName,
										billerID : data[i].billerID,
										billerName : data[i].billerName,
										effectiveDate : data[i].effectiveDate,
										feeAmount : data[i].feeAmount,
										fromAccountNumber : data[i].fromAccountNumber,
										fromAliasName : data[i].fromAliasName,
										immediateType : data[i].immediateType,
										masterTransactionID : data[i].masterTransactionID,
										memo : data[i].memo,
										msgLanguage : data[i].msgLanguage,
										payAmount : data[i].payAmount,
										paymentDate : displayUIService.convertDateNoTimeForUI(data[i].paymentDate),
										paymentDate1 : data[i].paymentDate,
										paymentStatus : data[i].paymentStatus,
										paymentStatusDesc : data[i].paymentStatusDesc,
										recurringTimes : recurringTimesVal,
										recurringType : data[i].recurringType,
										reference1 : data[i].reference1,
										reference2 : data[i].reference2,
										reference3 : data[i].reference3,
										referenceNO : data[i].referenceNO,
										scheduleType : data[i].scheduleType,
										scheduleTypeDesc : data[i].scheduleTypeDesc,
										transactionDate : displayUIService.convertDateTimeForUI(data[i].transactionDate),
										transactionID : data[i].transactionID,
										refInfos: data[i].refInfos || [], //for add new bill schedule
										addNewBillerFlag: (data[i].addNewBillerFlag == 'Y'),
										profileCode: data[i].profileCode || '',
										promptPayBillerId: data[i].promptpayBillerId || ''
									});
						}
					}
				}
				return daysDateArray;
			};// end function

		});
