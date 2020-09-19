/**
 * MyAccountTermDepositService
 */
angular.module('service.myAccountTermDepositService', [])

.service('myAccountTermDepositService', function($translate) {

	this.selectTermDepositAccountDetail = {};
	
	this.selectTermDepositInquiryDetail = {};
	
	this.termMasterDataList = [];
	
	this.termMonth = "";
	this.termPeriod = "";
	this.termNetAmount = "";
	this.confirmTermData = {};
	
	this.defaultTermObj = {};
	
	this.ratesTerms = {};
	
	this.setRatesTerms = function(rates) {
		this.ratesTerms = rates;
	};
	
	this.getRatesTerms = function() {
		return this.ratesTerms;
	};
	
	this.setDefaultTermObj = function(defVal) {
		this.defaultTermObj = defVal;
	};
	
	this.getDefaultTermObj = function() {
		return this.defaultTermObj;
	};
	
	this.setConfirmTermData = function(confirm) {
		this.confirmTermData = confirm;
	};
	
	this.getConfirmTermData = function() {
		return this.confirmTermData;
	};
	
	this.setTermNetAmount = function(amount) {
		this.termNetAmount = amount;
	};
	
	this.getTermNetAmount = function() {
		return this.termNetAmount;
	};
	
	this.setTermMonth = function(termMonthVal) {
		this.termMonth = termMonthVal;
	};
	
	this.getTermMonth = function() {
		return this.termMonth;
	};
	
	this.setTermPeriod = function(termPeriodVal) {
		this.termPeriod = termPeriodVal;
	};
	
	this.getTermPeriod = function() {
		return this.termPeriod;
	};
	
	this.setTermsMasterDataList = function(masterData) {
		this.termMasterDataList = masterData;
	};
	
	this.getTermsMasterDataList = function() {
		return this.termMasterDataList;
	};

	this.setSelectedTermDepositAccountDetail = function(selectedAccDetail) {
		this.selectTermDepositAccountDetail = selectedAccDetail;
	};
	this.getSelectedTermDepositAccountDetail = function() {
		return this.selectTermDepositAccountDetail;
	};
	
	this.setSelectTermDepositInquiryDetail = function(data) {
		this.selectTermDepositInquiryDetail = data;
	};
	this.getSelectTermDepositInquiryDetail = function() {
		return this.selectTermDepositInquiryDetail;
	};
	
	
	this.selectedTermOption = {};
	this.selectedTermType = {};
	this.selectedTermFreq = {};
	this.optionsTermType = [];
	this.optionsTermFreq = [];
	
	this.setSelectedTermOption = function(data) {
		this.selectedTermOption = data;
	};
	this.getSelectedTermOption = function() {
		return this.selectedTermOption;
	};
	
	this.setSelectedTermType = function(data) {
		this.selectedTermType = data;
	};
	this.getSelectedTermType = function() {
		return this.selectedTermType;
	};
	
	this.setSelectedTermFreq = function(data) {
		this.selectedTermFreq = data;
	};
	this.getSelectedTermFreq = function() {
		return this.selectedTermFreq;
	};
	
	this.setOptionsTermType = function(data) {
		this.optionsTermType = data;
	};
	this.getOptionsTermType = function() {
		return this.optionsTermType;
	};
	
	this.setOptionsTermFreq = function(data) {
		this.optionsTermFreq = data;
	};
	this.getOptionsTermFreq = function() {
		return this.optionsTermFreq;
	};
	this.dayMonthDesc = function(type,s){

		var returnText = '';
		var lbls = 'label.months';
		var lbl = 'label.month';

		if(type === 'D'){
			lbls = 'label.days';
			lbl = 'label.day';
		}
		
		if(s === 1){
			returnText = returnText + ' ' + s + ' ' + window.translationsLabel[$translate.use()][lbl];
		}else{
			returnText = returnText + ' ' + s + ' ' + window.translationsLabel[$translate.use()][lbls];
		}

		return returnText;
	}
	
});
