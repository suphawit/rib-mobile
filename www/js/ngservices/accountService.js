/**
 * editOtherAccounts
 */
angular.module('service.accountService', [])
.factory('editOtherAccountService', function() {
		
	var obj = {};
	
	obj.currentSelectedAccount = {};
	obj.currentEditDetails = {};
	obj.currentSelectedAcctCategory = {};
	obj.listOfAcctCategories = [];
	obj.listOfBanksCodesImg = [];
	obj.addOtherAccDetails = {};
	
	//Use this function to CLEAR the Service Cache data
	this.clear = function() {
		obj.currentSelectedAccount = {};
		obj.currentEditDetails = {};
		obj.currentSelectedAcctCategory = {};
		obj.listOfAcctCategories = [];
		obj.listOfBanksCodesImg = [];
	};
	
	obj.setaddOtherAccDetails = function(accDetails) {
		obj.addOtherAccDetails = accDetails;
	};
		 
	obj.getaddOtherAccDetails = function() {
		return obj.addOtherAccDetails ;
	};
	
	obj.setListOfBanksCodesImg = function(curAccount) {
		obj.listOfBanksCodesImg = curAccount;
	};
		 
	obj.getListOfBanksCodesImg = function() {
		return obj.listOfBanksCodesImg ;
	};
	
	obj.setCurrentSelectedAccount = function(curAccount) {
		obj.currentSelectedAccount = curAccount;
	};
		 
	obj.getCurrentSelectedAccount = function() {
		return obj.currentSelectedAccount ;
	};
		 
	obj.setCurrentEditDetails = function(editDetails) {
		obj.currentEditDetails = editDetails;
	};
		 
	obj.getCurrentEditDetails = function() {
		return obj.currentEditDetails ;
	};
		 
	obj.setCurrentSelectedAcctCategory = function(accCategory) {
		obj.currentSelectedAcctCategory = {
			categoryID: accCategory.catId || '',category: accCategory.catName || ''
		};			 
	};
		 
	obj.getCurrentSelectedAcctCategory = function() {		 
		return obj.currentSelectedAcctCategory;
	};
		 	
	obj.setListOfAcctCategories = function(listAccCatg) {
		obj.listOfAcctCategories = listAccCatg;
	};
		 
	obj.getListOfAcctCategories = function() {
		return obj.listOfAcctCategories ;
	};
	
	return obj;
		 
		 
})

.service('fundTransferTOService', function() {
		
		 this.currentSelectedAccountData = {};
		 this.transferAmount = '';
		 this.newAccNo = '';
		 this.newAccBnkCode = '';
		 this.otherAccount = '';
		 this.TOaccNotSelected = true;
		 this.currentSelectedAcctCategory = {};
		 this.TOnewAccNotSelected = true;
		 this.bankImgUrl = '';
		 
		//Use this function to CLEAR the Service Cache data
		 this.clear = function() {
			 this.currentSelectedAccountData = {};
			 this.transferAmount = '';
			 this.newAccNo = '';
			 this.newAccBnkCode = '';
			 this.otherAccount = '';
			 this.TOaccNotSelected = true;
			 this.currentSelectedAcctCategory = {};
			 this.TOnewAccNotSelected = true;
		};
		 
		 this.setBankImgUrl = function(url) {
			 this.bankImgUrl = url; 
		 };
		 
		 this.getBankImgUrl = function() {
			return this.bankImgUrl;
		 };
		 
		 this.setSelectedAccount = function(selAccount) {
			 this.currentSelectedAccountData = selAccount; 
		 };
		 
		 this.getSelectedAccount = function() {
			return this.currentSelectedAccountData;
		 };
		 
		 this.clearSelectedAccount = function() {
			this.currentSelectedAccountData = {};
		 };
		 
		 this.setTransferAmount = function(amount) {
			 this.transferAmount = amount; 
		 };
		 
		 this.getTransferAmount = function() {
			 return this.transferAmount; 
		 };
		 
		 this.setNewAccountNumber = function(accNo) {
			 this.newAccNo = accNo;
		 };
		 
		 this.getNewAccountNumber = function() {
			 return this.newAccNo;
		 };
		 
		 this.setNewAccountBankCode = function(bnkCode) {
			 this.newAccBnkCode = bnkCode;
		 };
		 
		 this.getNewAccountBankCode = function() {
			 return this.newAccBnkCode;
		 };
		 
		 this.setOtherAccount = function(isOther) {
			 this.otherAccount = isOther;
		 };
		 
		 this.getOtherAccount = function() {
			 return this.otherAccount;
		 };
		 
		 this.setTOaccNotSelected = function(status) {
			 this.TOaccNotSelected = status;
		 };
		 
		 this.getTOaccNotSelected = function() {
			 return this.TOaccNotSelected;
		 };
		 		 
	 	this.setCurrentSelectedAcctCategory = function(accCategory) {
	 		this.currentSelectedAcctCategory = {
				categoryID: accCategory.catId || '', category: accCategory.catName || ''
			};			 
		};
			 
	 	this.getCurrentSelectedAcctCategory = function() {		 
			return this.currentSelectedAcctCategory;
		};
		 
})
	
.service('fundTransferFROMService', function() {
		
		this.currentSelectedFROMAccountData = {};
		this.FROMaccNotSelected = true;
		
		this.clear = function() {
			this.currentSelectedFROMAccountData = {};
			this.FROMaccNotSelected = true;
		};
		
		
		this.setSelectedFROMAccount = function(selAccount) {
			 this.currentSelectedFROMAccountData = selAccount; 
		};
		 
		 this.getSelectedFROMAccount = function() {
			return this.currentSelectedFROMAccountData;
			
		};
		
		
		 
})

.service('fundTransferResponseService', function() {
		
		this.fundTransferResponseData = {};
		this.alertEmail = '';
		this.alertSMS = '';
		this.recurring = '';
		this.recurrance = '';
		this.otpCharges = {};
		this.otpData = {};
		this.responseAfterTransfer = {};
		this.refNote = '';
		this.changeSchedule = false;
		this.oneTime = true;
		
		//Use this function to CLEAR the Service Cache data
		this.clear = function() {
			this.fundTransferResponseData = {};
			this.alertEmail = '';
			this.alertSMS = '';
			this.recurring = '';
			this.recurrance = '';
			this.otpCharges = {};
			this.otpData = {};
			this.responseAfterTransfer = {};
			this.refNote = '';
			this.changeSchedule = false;
			this.oneTime = true;
		};
		 
	 
		this.setFundTransferResponse = function(response) {
			 this.fundTransferResponseData = response; 
		};
		 
		 this.getFundTransferResponse = function() {
			return this.fundTransferResponseData;
		 };
		
		this.setAlertEmail = function(email){
			this.alertEmail = email;
		};
		
		this.getAlertEmail = function(){
			return this.alertEmail;
		};
		
		this.setAlertSMS = function(number){
			this.alertSMS = number;
		};
		
		this.getAlertSMS = function(){
			return this.alertSMS;
		};
		
		this.setRecurring = function(rec){
			this.recurring = rec;
		};
		
		this.getRecurring = function(){
			return this.recurring;
		};
		
		this.setRecurrance = function(rec){
			this.recurrance = rec;
		};
		
		this.getRecurrance = function(){
			return this.recurrance;
		};
		this.setFundTransferOTPCharges = function(responseCharges) {
			this.otpCharges = responseCharges;
		};
		
		this.getFundTransferOTPCharges = function() {
			return this.otpCharges;
		};
		
		this.setOTPData = function(responseOTP) {
			this.otpData = responseOTP;
		};
		
		this.getOTPData = function() {
			return this.otpData;
		};
		
		this.setResposeAfterTransfer = function(afterResponse) {
			this.responseAfterTransfer = afterResponse;
		};
		
		this.getResposeAfterTransfer = function() {
			return this.responseAfterTransfer;
		};
		
		this.setReferenceNote = function(note) {
			this.refNote = note;
		};
		
		this.getReferenceNote = function() {
			return this.refNote;
		};
})

.service('fundTransferResponseTDService', function() {
	this.fundTransferRatesTDResponseData = {};
	this.termTD = {};
	this.selectedTermType = {};
	this.fundTransferResponseTD = {};
	
	this.setFundTransferRatesTD = function(responseRates) {
		this.fundTransferRatesTDResponseData = responseRates;
	};
	
	this.getFundTransferRatesTD = function() {
		return this.fundTransferRatesTDResponseData;
	};
	
	this.setTermTD = function(term) {
		this.termTD = term;
	};
	
	this.getTermTD = function() {
		return this.termTD;
	};
	
	this.setFcconTdTermType = function(termType) {
		this.selectedTermType = termType;
	};
	
	this.getFcconTdTermType = function() {
		return this.selectedTermType;
	};
	
	this.setFundTransferResponseTD = function(resp) {
		this.fundTransferResponseTD = resp;
	};
	
	this.getFundTransferResponseTD = function() {
		return this.fundTransferResponseTD;
	};
})


.service('fundTransferService', function() {

	this.selectFundTransferSchedule = {};
	this.addAccountFundTransfer = {};
	
	this.isShownToAccountSection = true;
	this.isShownNewAccountSection = false;
	
	this.bankImage = '';
	this.bankImagecolor= '';
	
	this.setBankImage = function(image) {
		this.bankImage = image;
	};
	
	this.getBankImage = function() {
		return this.bankImage;
	};
	
	this.setBankImageColor = function(color) {
		this.bankImagecolor = color;
	};
	
	this.getBankImageColor = function() {
		return this.bankImagecolor;
	};

	this.setFundTransferSchedule = function(selectFundTransferSchedule) {
		this.selectFundTransferSchedule = selectFundTransferSchedule;
	};
	this.getFundTransferSchedule = function() {
		return this.selectFundTransferSchedule;
	};

	this.setaddAccountFundTransfer = function(addAccountFundTransfer) {
		this.addAccountFundTransfer = addAccountFundTransfer;
	};
	this.getaddAccountFundTransfer = function() {
		return this.addAccountFundTransfer;
	};
})	


	
.service('fundTransferAddOtherAccount', function() {
		
		this.selectFundTransferAddOtherAccount = {};
		
		this.setFundTransferAddOtherAccount = function(selectAccount) {
			this.selectFundTransferAddOtherAccount = selectAccount;
		};
		this.getFundTransferAddOtherAccount = function() {
			return this.selectFundTransferAddOtherAccount;
		};
});