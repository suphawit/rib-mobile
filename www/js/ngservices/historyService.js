angular.module('service.historyService', [])
	.service('historyFundtransfertService', function(mainSession, invokeService,displayUIService) {

		this.setTime = function(data) {
			var transactions = data;
			var stmt_json = [];
			var sortSTMTJSON = function(txnParam){
				var str_date = displayUIService.convertDateNoTimeForUI(txnParam.transactionDate);
				txnParam.creditDate = displayUIService.convertDateNoTimeForUI(txnParam.creditDate);
				txnParam.debitDate = displayUIService.convertDateNoTimeForUI(txnParam.debitDate);
				txnParam.transactionDate = displayUIService.convertDateTimeForUI(txnParam.transactionDate);
				
				var tmpjson = {
						'date': str_date.date,
						'transactions' : []
				};
				if(stmt_json.length === 0){
	
					tmpjson.transactions.push(txnParam);
					stmt_json.push(tmpjson);
	
				} else {
	
					var date_is_available = false;
					var matched_d_index = 0;
	
					for(var d_index in stmt_json){
						if(stmt_json[d_index].date == str_date.date){
							matched_d_index = d_index;
							date_is_available = true;
							break;
						}
					}
	
					if(!date_is_available){
						tmpjson.transactions.push(txnParam);
						stmt_json.push(tmpjson);
					} else{
						stmt_json[matched_d_index].transactions.push(txnParam);
					}
				}
			};
			for (var index = 0; index < transactions.length; index++) {
				var txn = transactions[index];
				sortSTMTJSON(txn);
			}
			return stmt_json;
		};
		
		this.inquiryHistoryFundtransfer = function(month,callback) {
			var invokeAdapter = { adapter: 'FundTransferAdapter' };
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.params.period = month;
			obj.actionCode = 'ACT_INQUIRY_TRANSFER_HISTORY';
			obj.procedure = 'inquiryTransferHistoryProcedure';
			obj.onSuccess = function(result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj, invokeAdapter);
		};

        this.getCurrentFundTransferDetail = function() {
            return this.currentFundTransferDetail;
        };

        this.setCurrentFundTransferDetail = function(transaction) {
            this.currentFundTransferDetail = transaction
        };


    })
	.service('historyBillpaymentService', function(mainSession, invokeService, displayUIService) {

        var currentBillPaymentDetail;
		
		this.inquiryHistoryBillpayment = function(month,callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.params.period = month;
			obj.params.paging = {pageSize:0,page:0};
			obj.actionCode = 'ACT_INQUIRY_HISTORY_PAYMENT_PIB_RIB';
			obj.procedure = 'inquiryBillPaymentHistoryProcedure';
			obj.onSuccess = function(result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj);
		};
		
		this.setTime = function(data) {
			var transactions = data;
			var stmt_json = [];
			var sortSTMTJSON = function(txnParam){
				var str_date = displayUIService.convertDateNoTimeForUI(txnParam.transactionDate);
				txnParam.paymentDate = displayUIService.convertDateNoTimeForUI(txnParam.paymentDate);
				txnParam.transactionDate = displayUIService.convertDateTimeForUI(txnParam.transactionDate);
	
				var tmpjson = {
						'date': str_date.date,
						'transactions' : []
				};
				if(stmt_json.length === 0){
	
					tmpjson.transactions.push(txnParam);
					stmt_json.push(tmpjson);
	
				} else {
	
					var date_is_available = false;
					var matched_d_index = 0;
	
					for(var d_index in stmt_json){
						if(stmt_json[d_index].date == str_date.date){
							matched_d_index = d_index;
							date_is_available = true;
							break;
						}
					}
	
					if(!date_is_available){
						tmpjson.transactions.push(txnParam);
						stmt_json.push(tmpjson);
					} else{
						stmt_json[matched_d_index].transactions.push(txnParam);
					}
				}
			}
			for (var index = 0; index < transactions.length; index++) {
				var txn = transactions[index];
				sortSTMTJSON(txn);
			}
			return stmt_json;
		};

        this.getCurrentBillPaymentDetail = function() {
            return currentBillPaymentDetail;
        }

        this.setCurrentBillPaymentDetail = function(transaction) {
            currentBillPaymentDetail = transaction
        }
		
	})

	.service('historyRTPService', function(mainSession, invokeService,displayUIService) {
	
		this.setTime = function(data) {
			var transactions = data;
			var stmt_json = [];
			var sortSTMTJSON = function(txnParam){
				var str_date = displayUIService.convertDateNoTimeForUI(txnParam.createdDate);
				txnParam.expiryDate = displayUIService.convertDateNoTimeForUI(txnParam.expiryDate);
				txnParam.transactionDate = displayUIService.convertDateTimeForUI(txnParam.createdDate);
				
				var tmpjson = {
						'date': str_date.date,
						'transactions' : []
				};
				if(stmt_json.length === 0){
	
					tmpjson.transactions.push(txnParam);
					stmt_json.push(tmpjson);
	
				} else {
	
					var date_is_available = false;
					var matched_d_index = 0;
	
					for(var d_index in stmt_json){
						if(stmt_json[d_index].date == str_date.date){
							matched_d_index = d_index;
							date_is_available = true;
							break;
						}
					}
	
					if(!date_is_available){
						tmpjson.transactions.push(txnParam);
						stmt_json.push(tmpjson);
					} else{
						stmt_json[matched_d_index].transactions.push(txnParam);
					}
				}
			};
			for (var index = 0; index < transactions.length; index++) {
				var txn = transactions[index];
				sortSTMTJSON(txn);
			}
			return stmt_json;
		};
		
		this.inquiryHistoryRTP = function(month,callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.params.period = month;
			obj.actionCode = 'ACT_RTP_INQUIRY_HISTORY';
			obj.procedure = 'inquiryRTPHistoryProcedure';
			obj.onSuccess = function(result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj);
		};
		
		
	})
	.service('historyNDIDAuthenService', function(mainSession, invokeService, displayUIService, mockHistoryNdidAuthenService) {
		var currentDetail;
		var invokeOption = { adapter: 'NdidAuthenAdapter'};

		this.setTime = function(data) {
			var transactions = data;
			var stmt_json = [];
			var sortSTMTJSON = function(txnParam){
				var str_date = displayUIService.convertDateNoTimeForUI(moment(txnParam.transactionDateTime).format('DD/MM/YYYY'));
				txnParam.requestDateTime = moment(txnParam.requestDateTime).format('DD/MM/YYYY HH:mm');
				txnParam.transactionDateTime = moment(txnParam.transactionDateTime).format('DD MMM YYYY HH:mm');
				
				var tmpjson = {
					'date': str_date.date,
					'transactions' : []
				};
				if(stmt_json.length === 0){
	
					tmpjson.transactions.push(txnParam);
					stmt_json.push(tmpjson);
	
				} else {
	
					var date_is_available = false;
					var matched_d_index = 0;
	
					for(var d_index in stmt_json){
						if(stmt_json[d_index].date == str_date.date){
							matched_d_index = d_index;
							date_is_available = true;
							break;
						}
					}
	
					if(!date_is_available){
						tmpjson.transactions.push(txnParam);
						stmt_json.push(tmpjson);
					} else{
						stmt_json[matched_d_index].transactions.push(txnParam);
					}
				}
			};
			for (var index = 0; index < transactions.length; index++) {
				var txn = transactions[index];
				sortSTMTJSON(txn);
			}
			return stmt_json;
		};
		
		this.inquiryHistory = function(month,callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.params.selectedMonth = month;
			obj.actionCode = 'INQUIRY_REQUEST_HISTORY';
			// obj.procedure = 'inquiryRTPHistoryProcedure';
			obj.onSuccess = function(result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj, invokeOption);
			// mockHistoryNdidAuthenService.run('INQUIRY_REQUEST_HISTORY').then(function(result){
			// 	callback(result);
			// });
		};

		this.inquiryRequestMessage = function(requestId,callback) {
			var obj = {};
			obj.params = {};
			obj.params.language = mainSession.lang;
			obj.params.requestId = requestId;
			obj.actionCode = 'INQUIRY_REQUEST_MESSAGE';
			// obj.procedure = 'inquiryRTPHistoryProcedure';
			obj.onSuccess = function(result) {
				var resultObj = result.responseJSON.result;
				callback(resultObj);
			};
			invokeService.executeInvokePublicService(obj, invokeOption);
		};
		
		this.getCurrentDetail = function() {
            return currentDetail;
        };

        this.setCurrentDetail = function(transaction) {
            currentDetail = transaction
        };
		
	}).service('mockHistoryNdidAuthenService', function($q, $timeout) {
		var inquiryRequestNDIDHistory = {
			"responseStatus": {
				"responseCode": "RIB-I-SCC000",
				"responseMessage": "Success",
				"errorMessage": ""
			},
			"value": {
				"requestHistoryList": [
					{
						"requestId": "ryiouqewyrqweriyoqw",
						"refCode": "20191001090000",
						"requestDateTime": "2019-10-01T09:00:00.000Z",
						"requestMessage": "KKP Transaction",
						"requestStatusEn": "accepted",
						"requestStatusTh": "ยอมรับ",
						"requestorNameEn": "Audi",
						"requestorNameTh": "ออดี้",
						"transactionDateTime": "2019-10-02T09:30:00.000Z"
					},
					{
						"requestId": "hfksjdhafiudsalhifhewirew",
						"refCode": "20190930090000",
						"requestDateTime": "2019-09-30T09:00:00.000Z",
						"requestMessage": "KKP Transaction",
						"requestStatusEn": "rejected",
						"requestStatusTh": "ปฏิเสธ",
						"requestorNameEn": "BMW",
						"requestorNameTh": "บีเอ็มดับบลิว",
						"transactionDateTime": "2019-09-30T11:30:00.000Z"
					},
					{
						"requestId": "jafdopfdsalfkl;kasf;lks",
						"refCode": "20190929113000",
						"requestDateTime": "2019-09-29T11:30:00.000Z",
						"requestMessage": "KKP Transaction",
						"requestStatusEn": "rejected",
						"requestStatusTh": "ปฏิเสธ",
						"requestorNameEn": "Audi",
						"requestorNameTh": "ออดี้",
						"transactionDateTime": "2019-09-29T11:40:00.000Z"
					}
				]
			}
		};

		this.run = function(actionCode){
			var defered = $q.defer();
			var returnData = {};
			switch(actionCode){
				case 'INQUIRY_REQUEST_HISTORY': 
					returnData = inquiryRequestNDIDHistory;
					break;
			}
			
			$timeout(function(){
                defered.resolve(returnData);
            },500);

			return defered.promise;
		};

	});