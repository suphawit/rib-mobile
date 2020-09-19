angular.module('service.mutualFund', [])
    .service('mutualFundService', function (invokeService, mainSession, popupService, kkconst, $http, $sce, $q, $ionicLoading) {
        'use strict';
        this.mutualFundPortDetail = {};
        this.mutualFundSelectPortDetail = {
            fundCode: null,
            fundFacsheetCode: null,
            fundClass: null,
            fundAllowance: undefined
        };
        this.dataTatalPage = {};
        this.dataTatalPage2 = {};
        this.dataTransactionToday = {};
        this.nevigatePage = {};
        this.listMutualFundAll = {};
        this.dataConfirmResult = {};
        this.isSyncUnitholder = false;

        this.setSelectMutualFundPortDetail = function (mfPortSelectDetail) {
            this.mutualFundSelectPortDetail = mfPortSelectDetail;
        };

        this.getSelectMutualFundPortDetail = function () {
            return this.mutualFundSelectPortDetail;
        };

        this.setMutualFundPortDetail = function (mfPortDetail) {
            this.mutualFundPortDetail = mfPortDetail;

        };

        this.getMutualFundPortDetail = function () {
            return this.mutualFundPortDetail;
        };

        this.setNevigatePageMutualFund = function (nevigatePage) {
            this.nevigatePage = nevigatePage;
        };

        this.getNevigatePageMutualFund = function () {
            return this.nevigatePage;
        };

        this.setFundListAll = function (result) {
            this.listMutualFundAll = result;
        };

        this.getFundListAll = function () {
            return this.listMutualFundAll;
        };

        this.getPortMutualFundDetailSummary = function (callback) {
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_GET_PORT_DETAIL_AND_SUMMARY_MUTUAL_FUND';
            obj.procedure = 'getMutualFundPortDetailAndSummaryProcedure';
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj);
        };

        this.getPortMutualFundDetail = function (callback) {
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_GET_PORT_DETAIL_MUTUAL_FUND';
            obj.procedure = 'getMutualFundPortDetailProcedure';
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj);
        };

        this.getPortMutualFundSummary = function (callback) {
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_GET_PORT_SUMMARY_MUTUAL_FUND';
            obj.procedure = 'getMutualFundPortSummaryProcedure';
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj);
        };

        this.getPortMutualFundTransactionDetail = function (param) {
            var deferred = $q.defer();

            var request = {
                params: {
                    fundCode: param.fundCode,
                    unitHolderNumber: param.unitHolderNumber,
                    dateFrom: param.year + '0101',
                    dateTo: param.year + '1231',
                    pageSize: param.pageSize || 20,
                    pageNumber: param.pageNumber
                },
                actionCode: 'ACT_GET_PORT_TRANSACTION_MUTUAL_FUND',
                procedure: 'getMutualFundPortTransactionProcedure',
                onSuccess: function (result) {
                    deferred.resolve(result.responseJSON.result);
                    console.log('service.getPortMutualFundTransactionDetail, request, result', request, result.responseJSON.result);
                }
            };

            invokeService.executeInvokePublicService(request);

            return deferred.promise;
        };

        this.getMutualFundTermsAndConditions = function (lang) {

            var deferred = $q.defer();
            var request = {};
            request.params = {'actionCode': 'rib_mf_term_and_con'};
            request.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
            request.procedure = 'getTermAndConditionProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: 'utilityAdapter'});

            return deferred.promise;
        };

        this.getPortMutualFundTransaction = function () {
            return [
                {
                    'subName': 'menu.purchase',
                    'link': 'app.mutualFundPurchase'
                },
                {
                    'subName': 'menu.switch',
                    'link': 'app.mutualFundSwitch'
                },
                {
                    'subName': 'menu.redeem',
                    'link': 'app.mutualFundRedeem'
                },
                {
                    'subName': 'menu.riskProfile',
                    'link': 'app.suitabilityScore'
                },
                {
                    'subName': 'menu.todayTransaction',
                    'link': 'app.mutualFundHistory'
                }
            ];
        };

        this.getPortMutualFundList = function (mutualFundType) {
            console.log('mutualFundType==============>', mutualFundType);
            var deferred = $q.defer();
            var request = {};
            request.params = {'requestType': mutualFundType};

            request.actionCode = 'ACT_GET_FUND_LIST';
            request.procedure = 'getFundListDataProcedure';

            request.onSuccess = function (result) {

                deferred.resolve(result.responseJSON);

            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.getPortMutualFundListSwitchIn = function (MUTUALFUND_SI, fundId) {

            var deferred = $q.defer();
            var request = {};

            request.params = {
                'requestType': 'SI',
                'fundId': fundId
            };
            request.actionCode = 'ACT_GET_FUND_LIST';
            request.procedure = 'getFundListDataProcedure';

            request.onSuccess = function (result) {

                deferred.resolve(result.responseJSON);

            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.getUnitHolder = function (mutualFundList, fundId) {

            var deferred = $q.defer();

            var request = {};
            request.params = {
                'requestType': mutualFundList,
                'fundId': fundId
            };
            request.actionCode = 'ACT_GET_UNITHOLDER_BY_CIF';
            request.procedure = 'getUnitHolderByCIFProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.submitValidatePrepareFund = function (fundID, requestType, toFundID) {

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'fundId': fundID,
                'requestType': requestType,
                'toFundId': toFundID
            };
            request.actionCode = 'ACT_GET_MESSAGE_ACCEPT';
            request.procedure = 'getMessageAcceptProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.submitPrepareMutualFund = function (submitPrepareMutualFund, orderType) {
            //	submitPrepareMutualFund
            var amount = submitPrepareMutualFund.amount;

            var amountValue = parseFloat(amount.replace(/,/g, ''));

            var deferred = $q.defer();
            var request = {};

            request.params = {
                'orderType': orderType,
                'unitholderId': submitPrepareMutualFund.unitHolderData.unitHolderId,
                'accountNo': submitPrepareMutualFund.accountData.selectedFromAccountID + ':' + submitPrepareMutualFund.accountData.selectedFromAccNo,
                'bankCode': submitPrepareMutualFund.accountData.bankCode,
                'fundId': submitPrepareMutualFund.fundListInfoShow.fundId,
                'amount': amountValue,
                'ltfCondition': (submitPrepareMutualFund.LTF_Condition !== null)
                    ? submitPrepareMutualFund.LTF_Condition
                    : null
            };
            // console.log(" -------------------submitPrepareMutualFund.LTF_Condition -----------------", submitPrepareMutualFund.LTF_Condition );
            request.actionCode = 'ACT_PREPARE_ORDER';
            request.procedure = 'prepareOrderProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.submitPrepareMutualFundRedeem = function (submitPrepareMutualFund, orderType) {

            var taxType;
            var amount = submitPrepareMutualFund.amount;
            var amountValue = parseFloat(amount.replace(/,/g, ''))
                .toFixed(4);

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'orderType': orderType,
                'unitholderId': submitPrepareMutualFund.unitHolderData.unitHolderId,
                'accountNo': submitPrepareMutualFund.unitHolderData.bankAccount,
                'bankCode': submitPrepareMutualFund.unitHolderData.bankCode,
                'fundId': submitPrepareMutualFund.fundListInfoShow.fundId,
                'unit': amountValue,
                'ltfCondition': (submitPrepareMutualFund.LTF_Condition !== undefined)
                    ? submitPrepareMutualFund.LTF_Condition
                    : null
            };

            request.actionCode = 'ACT_PREPARE_ORDER';
            request.procedure = 'prepareOrderProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.submitPrepareMutualFundRedeemAmount = function (submitPrepareMutualFund, orderType) {

            var taxType;
            var amount = submitPrepareMutualFund.amount;
            var amountValue = parseFloat(amount.replace(/,/g, ''))
                .toFixed(4);

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'orderType': orderType,
                'unitholderId': submitPrepareMutualFund.unitHolderData.unitHolderId,
                'accountNo': submitPrepareMutualFund.unitHolderData.bankAccount,
                'bankCode': submitPrepareMutualFund.unitHolderData.bankCode,
                'fundId': submitPrepareMutualFund.fundListInfoShow.fundId,
                'amount': amountValue,
                'ltfCondition': (submitPrepareMutualFund.LTF_Condition !== undefined)
                    ? submitPrepareMutualFund.LTF_Condition
                    : null
            };

            request.actionCode = 'ACT_PREPARE_ORDER';
            request.procedure = 'prepareOrderProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.submitPrepareMutualFundSwitch = function (submitPrepareMutualFund, orderType) {

            var taxType;
            var amount = submitPrepareMutualFund.amount;
            var amountValue = parseFloat(amount.replace(/,/g, ''))
                .toFixed(4);

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'orderType': orderType,
                'unitholderId': submitPrepareMutualFund.unitHolderData.unitHolderId,
                'bankCode': submitPrepareMutualFund.accountData.bankCode,
                'fundId': submitPrepareMutualFund.fundListInfoShow.fundId,
                'toFundId': submitPrepareMutualFund.fundListTo,
                'unit': amountValue,
                'ltfCondition': (submitPrepareMutualFund.LTF_Condition !== undefined)
                    ? submitPrepareMutualFund.LTF_Condition
                    : null
            };

            request.actionCode = 'ACT_PREPARE_ORDER';
            request.procedure = 'prepareOrderProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.submitPrepareMutualFundSwitchAmount = function (submitPrepareMutualFund, orderType) {

            var taxType;
            var amount = submitPrepareMutualFund.amount;
            var amountValue = parseFloat(amount.replace(/,/g, ''))
                .toFixed(4);

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'orderType': orderType,
                'unitholderId': submitPrepareMutualFund.unitHolderData.unitHolderId,
                'bankCode': submitPrepareMutualFund.accountData.bankCode,
                'fundId': submitPrepareMutualFund.fundListInfoShow.fundId,
                'toFundId': submitPrepareMutualFund.fundListTo,
                'amount': amountValue,
                'ltfCondition': (submitPrepareMutualFund.LTF_Condition !== undefined)
                    ? submitPrepareMutualFund.LTF_Condition
                    : null
            };

            request.actionCode = 'ACT_PREPARE_ORDER';
            request.procedure = 'prepareOrderProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.getTransactionTodayList = function () {

            var deferred = $q.defer();
            var request = {};
            //request.params = { "period" : periodSelect};
            request.actionCode = 'ACT_INQUIRY_OUTSTANDING';
            request.procedure = 'getInquiryOutstandingProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;

        };

        this.submitConfirmMutualFund = function (verifyTransactionId) {

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'verifyTransactionId': verifyTransactionId,
                'confirmCutOffTime': ''
            };
            request.actionCode = 'ACT_CONFIRM_ORDER';
            request.procedure = 'confirmOrderProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.cancelOrderTransaction = function (dataCancel) {

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'referenceNO': dataCancel.referenceNo,
                'mutualFundRef': dataCancel.mutualFundref
            };
            request.actionCode = 'ACT_CANCEL_ORDER';
            request.procedure = 'cancelOrderProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.getTransactionHistoryMutualFund = function (periodSelect, pageNumber) {

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'period': periodSelect.toString(),
                'requestType': '',
                'actionType': 'ALL',
                'pageNumber': pageNumber,
                'pageSize': 5

            };
            request.actionCode = 'ACT_INQUIRY_TRANSACTION_HISTORY';
            request.procedure = 'getInquirytransactionHistoryProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.getTransactionTransactionPD = function (pageNumber) {

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'requestType': '',
                'actionType': 'PENDING',
                'pageNumber': pageNumber,
                'pageSize': 5

            };
            request.actionCode = 'ACT_INQUIRY_TRANSACTION_HISTORY';
            request.procedure = 'getInquirytransactionHistoryProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.getOutStandingFundID = function (fundId, unitHolderId) {

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'fundId': fundId,
                'unitHolderId': unitHolderId
            };

            request.actionCode = 'ACT_INQUIRY_OUTSTANDING';
            request.procedure = 'getInquiryOutstandingProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;
        };

        this.setConfirmMutualFund = function (dataTatalPage) {
            this.dataTatalPage = dataTatalPage;

        };

        this.getConfirmMutualFund = function () {
            return this.dataTatalPage;

        };

        this.setFundTransactionToday = function (dataTransactionToday) {
            this.dataTransactionToday = dataTransactionToday;
        };

        this.getFundTransactionToday = function () {
            return this.dataTransactionToday;
        };

        this.setConfirmResultMutualFund = function (dataConfirmResult) {
            this.dataConfirmResult = dataConfirmResult;
        };

        this.getConfirmResultMutualFund = function () {
            return this.dataConfirmResult;
        };

        this.getSummaryNAVChartData = function (fundId) {

            var resultGetSummaryNAVChartData = [
                {
                    'month': '3',
                    'day': 90
                },
                {
                    'month': '6',
                    'day': 180
                },
                {
                    'month': '12',
                    'day': 365
                }
            ];
            return resultGetSummaryNAVChartData;

        };

        this.createChartMyPortfolio = function (valueOfPl, fundCode) {
            var ctx = $('#myChart2');

            var myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    datasets: [
                        {
                            data: valueOfPl,
                            backgroundColor: [
                                '#56B9F7',
                                '#0AE8EB',
                                '#AFFFAF',
                                '#FFFF8B',
                                '#FFE7AC',
                                '#DDDDDD'
                            ],
                            borderWidth: 0
                        }
                    ],
                    labels: fundCode

                },
                options: {
                    legend: {
                        display: false
                    },
                    pieceLabel: {
                        render: 'percentage',
                        fontStyle: 'bold',
                        fontFamily: 'Quark-Light',
                        fontSize: 14
                    }
                }
            });
        };

        this.getPortfolio = function (callback) {
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_INQUIRY_OUTSTANDING';
            obj.procedure = 'getInquiryOutstandingProcedure';
            console.log(obj);
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj, {adapter: kkconst.FUND_CONNEXT_ADAPTER});
        };

        this.verifyIsUnitHolderExist = function (callback) {
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_GET_UNITHOLDER_BY_ID';
            obj.procedure = 'getUnitHolderByIDProcedure';
            console.log(obj);
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj, {adapter: kkconst.FUND_CONNEXT_ADAPTER});
        };

        this.syncUnitHolderForFundConnext = function () {
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_SYNC_UNITHOLDER_FROM_PHATRA';
            obj.procedure = 'syncUnitHolderFromPhatra';
            console.log(obj);
            obj.onSuccess = function () {
            };
            obj.onFailure = function () {
            };
            invokeService.executeInvokePublicService(obj, {adapter: kkconst.FUND_CONNEXT_ADAPTER});
        };

        this.setIsSyncUnitholderForFundConnext = function (isSyncUnitholder) {
            this.isSyncUnitholder = isSyncUnitholder;
        };
        this.getIsSyncUnitholderForFundConnext = function () {
            return this.isSyncUnitholder;
        };

        this.inquiryNav = function (fundId, period) {

            var deferred = $q.defer();
            var request = {};
            request.params = {
                'fundId': fundId,
                'navMonthPeriod': period
            };
            request.actionCode = 'ACT_INQUIRY_NAV';
            request.procedure = 'getInquiryNavProcedure';

            request.onSuccess = function (result) {
                deferred.resolve(result.responseJSON);
            };
            request.onFailure = function (result) {
                deferred.resolve(result.responseJSON);
            };
            invokeService.executeInvokePublicService(request, {adapter: kkconst.FUND_CONNEXT_ADAPTER});

            return deferred.promise;

        };

        this.checkIsAcceptConsent = function (callback) {
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_CHECK_ACCEPT_CONSENT';
            obj.procedure = 'checkAcceptConsentProcedure';
            console.log(obj);
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj, {adapter: kkconst.FUND_CONNEXT_ADAPTER});
        };

        this.getFundConsent = function (callback) {
            var obj = {};
            obj.params = {'actionCode': 'fund_consent'};
            obj.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
            obj.procedure = 'getFundConsentProcedure';
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj, {adapter: 'utilityAdapter'});
        };

        this.acceptConsent = function (callback) {
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_CUST_ACCEPT_CONSENT';
            obj.procedure = 'custAcceptConsentProcedure';
            console.log(obj);
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj, {adapter: kkconst.FUND_CONNEXT_ADAPTER});
        };

        this.getFundMenuFlag = function (callback) {
            var obj = {};
            obj.params = {'actionCode': 'fund_menu_flag'};
            obj.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
            obj.procedure = 'getApiVersionProcedure';
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj, {adapter: 'utilityAdapter'});
        };

        this.getFundDividendNews = function (period, callback) {
            var obj = {};
            obj.params = {'period': period.toString()};
            obj.actionCode = 'ACT_INQUIRY_FUND_DIVIDEND';
            obj.procedure = 'getInquiryFundDividend';
            console.log(obj);
            obj.onSuccess = function (result) {
                var resultObj = result.responseJSON.result;
                callback(resultObj);
            };
            invokeService.executeInvokePublicService(obj, {adapter: kkconst.FUND_CONNEXT_ADAPTER});
        };

        this.openFundFactSheet = function (fundCode, fundFactSheetCode, callback, getUrlFailure, getFileFailure) {
            var obj = {
                params: {
                    language: mainSession.lang,
                    fundCode: fundCode
                },
                actionCode: 'ACT_CODE_FUND_FACT_SHEET_URL',
                procedure: 'getFundFactSheetUrlProcedure',
                onSuccess: function (result) {
                    console.log('getFundFactSheetUrlProcedure result', result);
                    if (result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
                        $ionicLoading.show({ template: kkconst.SPINNER, noBackdrop: false });
                        var fundFactSheetRootUrl = result.responseJSON.result.value.fundFactSheetRootUrl;
                        console.log('posting fundFactSheetUrl', fundFactSheetRootUrl, {Symbol: fundFactSheetCode});
                        $http.post(fundFactSheetRootUrl, {Symbol: fundFactSheetCode}, {responseType: 'blob'})
                            .then(function (resp) {
                                // response is base64 of pdf file
                                console.log('post fundFactSheetUrl resp', resp);
                                var filename = 'Fund_Fact_Sheet.pdf';
                                saveAsPDF(filename, resp.data)
                                    .then(function (file) {
                                        console.log('saveAsPDF success:', file);
                                        // if (mainSession.deviceOS === 'Android') {
                                        var resumedRemoveFile = function () {
                                            setTimeout(function () {
                                                console.log('file.remove:', file.toURL());
                                                file.remove(function () {
                                                    console.log('file.removed:');
                                                }, function (error) {
                                                    console.log('file.remove error:', error);
                                                });
                                                document.removeEventListener('resume', resumedRemoveFile, false);
                                            }, 500);
                                        };
                                        console.log('addEventListener:', file.toURL());
                                        document.addEventListener('resume', resumedRemoveFile, false);
                                        console.log('disusered.open:', file.toURL());
                                        cordova.plugins.disusered.open(file.toURL());
                                        // } else {
                                        //     // console.log('window.open:', file.toURL());
                                        //     // // window.open(file.toURL(), '_system', 'location=yes');
                                        // }
                                        $ionicLoading.hide();
                                        callback();
                                    }, function (error) {
                                        console.log('saveAsPDF error:', error);
                                        popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.canNotOpenFundFactSheet');
                                        $ionicLoading.hide();
                                        callback();
                                    });
                            }, function (response) {
                                console.log('post fundFactSheetUrl error', response);
                                getFileFailure(response);
                                $ionicLoading.hide();
                            });
                    }
                },
                onFailure: function (result) {
                    getUrlFailure(result);
                }
            };
            console.log('getFundFactSheetUrlProcedure obj', obj);
            invokeService.executeInvokePublicService(obj, {adapter: 'utilityAdapter'});
        };

        // function base64ToBlob(data, contentType, sliceSize) {
        //     contentType = contentType || "";
        //     sliceSize = sliceSize || 512;
        //     var byteCharacters = atob(data);
        //     var byteArrays = [];
        //     for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        //         var slice = byteCharacters.slice(offset, offset + sliceSize);
        //         var byteNumbers = new Array(slice.length);
        //         for (var i = 0; i < slice.length; i++) {
        //             byteNumbers[i] = slice.charCodeAt(i);
        //         }
        //         var byteArray = new Uint8Array(byteNumbers);
        //         byteArrays.push(byteArray);
        //     }
        //     return new Blob(byteArrays, {type: contentType});
        // }

        function saveAsPDF(filename, content) {
            var deferred = $q.defer();

            var savePath;
            if (mainSession.deviceOS === 'Android') {
                savePath = cordova.file.dataDirectory;
            } else if (mainSession.deviceOS === 'iOS') {
                savePath = cordova.file.documentsDirectory;
            }
            window.resolveLocalFileSystemURL(savePath, function (dir) {
                console.log('resolveLocalFileSystemURL success:', dir);
                dir.getFile(filename, {create: true}, function (file) {
                    console.log('getFile success:', file);
                    file.createWriter(function (fileWriter) {
                        console.log('createWriter success:', fileWriter);
                        fileWriter.truncate(0);
                        // Convert the base64 string in a Blob
                        console.log('createWriter content:', content);
                        fileWriter.write(content);
                        deferred.resolve(file);
                    }, function (error) {
                        console.log('createWriter error:', error);
                        deferred.reject(error);
                    });
                }, function (error) {
                    console.log('getFile error', error);
                    deferred.reject(error);
                });
            }, function (error) {
                console.log('resolveLocalFileSystemURL error', error);
                deferred.reject(error);
            });

            return deferred.promise;
        }
    });
