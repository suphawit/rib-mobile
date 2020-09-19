angular.module('service.eDonationService', [])
    .service('eDonationService', function (mainSession, $translate, kkconst, displayUIService, invokeService) {

        this.currentAccount;
        this.amountModel = {
            amount: ''
        };
        this.isNewBiller;
        this.isScanBill;
        this.memo = {
            txt: ''
        };

        this.setCurrentAccount = function (data) {
            this.currentAccount = data;
        };
        this.getCurrentAccount = function () {
            return this.currentAccount;
        };

        this.setCurrentAmount = function (data) {
            this.currentAmount = data;
        };
        this.getCurrentAmount = function () {
            return this.currentAmount;
        };

        this.setIsNewBiller = function (data) {
            this.isNewBiller = data;
        };
        this.getIsNewBiller = function () {
            return this.isNewBiller;
        };

        this.setIsScanBill = function (data) {
            this.isScanBill = data;
        };
        this.getIsScanBill = function () {
            return this.isScanBill;
        };

        this.setMemo = function (data) {
            this.memo = data;
        };
        this.getMemo = function () {
            return this.memo;
        };

        this.getCustomerType = function(callback){
            var obj = {};
            obj.params = {};
            obj.actionCode = 'ACT_EDONATION_INQUIRY_CUSTOMER_TYPE';
            obj.procedure = 'inquiryCustomerType';
            obj.onSuccess = function(result) {
                if(result.responseJSON.result && result.responseJSON.result.responseStatus && result.responseJSON.result.responseStatus.responseCode === kkconst.success) {
                    callback(result.responseJSON.result.responseStatus,result.responseJSON.result.value);
                } else {
                    callback(result.responseJSON.result.responseStatus);
                }
            };

            invokeService.executeInvokePublicService(obj);
        };
    });
