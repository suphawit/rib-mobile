/* App Constants
* This file contains list of CONSTANT values
* All labels should be defined in Capital Letters , so please upgrade on Capital Letters, for example, KKCONST.SERVICE_TIMEOUT
*/

var globalConstant = {};
// App inactivity Session Timeout settings
globalConstant.IdleTime = {
	idle: 300,// 5*60, // time period when Idle state service will start counting as Idle time (in seconds)
	timeout: 60,//1*60, // once Idle state started then it will wait for this timeframe before fire the session event(in seconds)
	interval : 30 // time interval to check if Idle state is active or not
};


//Service timeout period - in seconds
globalConstant.SERVICE_TIMEOUT = 150000;

globalConstant.IS_CLOSE_LOGGER = false;
//extend number obj insert leading zero
if (typeof Number.pad !== 'function') { 
	Number.prototype.pad = function() {
	      var s = String(this);
	      while (s.length < (3 || 2)) {s = '0' + s;}//NOSONAR
	      return s;
	};
}

//register global variable
window.globalConstant = globalConstant;

angular.module('kkapp.constant', [])
	.constant('kkconst', {
		
		success:'RIB-I-SCC000',
		failure:'RIB-E-CONN02',
		INTERNET_NOT_CONNECTED:'RIB-E-CONN01',
		invalidToken:'RIB-E-LOG007',
		tokenTimeOut:'RIB-E-LOG013',
		unknown:'RIB-E-UNK001',
		login:{normal:'normal',resetPin:'reset-pin'},
		pin:{create:'create',reset:'reset',login:'login',createnew:'createnew',invalidPin:'invalidPin', illegal: 'illegal', verifyBio: 'verifyBio'},
		amount:{limitMaxLength:12},
		page:{login:'login',pin:'pin', illegal: 'illegal'},
		bankcode:{kkbank:'069'},
		config:{datelimit:180},


		mainAdapter: 'iBankingCBSAdapter',
		notiAdapter: 'LongpollingCBSAdapter',
		UTILITY_ADAPTER: 'utilityAdapter',
		FUND_CONNEXT_ADAPTER: 'FundConnextCBSAdapter',
		broadcast:{RESET_PIN_VERIFY_USER:'resetPinVerifyUser-callback',loginChallengeResponse:'loginChallenge-callback'},
		
		LANGUAGE_TH:'TH',
		LANGUAGE_EN:'EN',
		LANGUAGE_th:'th',
		LANGUAGE_en:'en',

		DATE_FORMAT_ddMMyyyyHHmm:'dd/MM/yyyy HH:mm',
		DATE_FORMAT_dMMMyyyy:'d MMM yyyy',
		DATE_FORMAT_dMMMyyyyHHmm:'d MMM yyyy HH:mm',
		DATE_FORMAT_ddMMyyyy:'dd/MM/yyyy',
		DATE_FORMAT_TXN:'yyyyMMddhhmmss',
		DATE_FORMAT_HHmm:'HH:mm',
		
		CONTACT_US_MAILTO:'kkpcontactcenter@kkpfg.com',

		// SERVER_SSL_URL_PINNING : 'https://' + 'ebankingapi.kiatnakin.co.th/',

		//production finterprint
		SERVER_SSL_FINGERPRINT_PINNING	: [
			'81 A9 07 B0 2B DC D2 E7 03 C9 49 88 76 70 B4 63 64 41 23 6C 1B F6 76 83 5E 1C C6 82 49 70 D5 23',
			'78 61 29 B6 E1 FF AB 23 7F 13 EA 7D 89 C2 18 7A F4 05 B6 0B 73 A4 0C 6D 68 52 52 91 3D C6 8B CD' //*.kkpfg.com
		],

		CREATE_PIN: 'create_pin',
		RESET_PIN: 'reset_pin',
		VERIFY_SUBSCRIPTION: 'verify_subscription',

		//test fingerprint
		//SERVER_SSL_FINGERPRINT_PINNING	: ['58 C3 87 C0 D0 E1 6D 19 04 F3 FE D3 F8 D8 70 29 35 DB 31 B8 6A A0 88 18 25 10 46 60 3E 5B AA C8','9F 46 45 AF 49 27 D0 58 EE 58 58 A4 74 A6 13 71 88 F3 8E 72 CF 30 32 92 AE D9 42 3F B0 03 33 6E'],

		SENDER_ID: 614269815507,
		
		APP_VERSION :' : 1.1.0',
		//device IP
		DEVICE_IP:'127.0.0.1',
		isServerConnected : false,
		ALERT_WARNING_TITLE : 'alert.title',//value from translate

		DISABLE_APP: '1002',
		FORCE_UPDATE: '1003',
		
		bankDefaultColor :'#b2b2b2',
		SERVICE_TIMEOUT :120.0,
		IdleTime:{
			idle: 300,// 5*60, // time period when Idle state service will start counting as Idle time (in seconds)
			timeout: 60,//1*60, // once Idle state started then it will wait for this timeframe before fire the session event(in seconds)
			interval : 30 // time interval to check if Idle state is active or not
		},

        E_DONATE_CATEGORY_ID: 26,
		
		ANY_ID_TYPE:{
			ACCOUNT: 'ACCTNO',
			ID_CARD: 'NATID',
			MOBILE_NO:'MSISDN',
			E_WALLET: 'EWALLETID',
			EMAIL: 'EMAIL'
		},
		ANY_ID_TYPE_DATA_TYPE:{
			STRING: 'S',
			NUMBER: 'N'
		},		
		ANY_ID_SUCCESS: 'RIB-I-ANY001',

		TRANSFER_TIME: {
            IMMEDIATE: 'I',
			MORNING: 'M',
			EVENING: 'E'
		},
		
		ROUNTING:{
				MENU:{	
					STATE:'menu',
					URL:'/menu',
					TEMPLATE_URL:'templates/menu-index.html',
					CONTROLLER:''
					},
				CHANGE_PIN:{
					STATE:'app.changePIN',
					URL:'/changePIN',
					TEMPLATE_URL:'templates/Pin/pin-change.html',
					CONTROLLER:'changePinCtrl'
				},
				SETTING_MAIN_MENU:{
					STATE:'settingMainMenu',
					URL:'/settingMainMenu',
					TEMPLATE_URL:'templates/setting.html',
					CONTROLLER:''
				},
				SETTING:{
					STATE:'app.setting',
					URL:'/setting',
					TEMPLATE_URL:'templates/setting-lang.html',
					CONTROLLER:''
				},
				LOCATEUS:{
					STATE:'locateUs',
					URL:'/locateUs',
					TEMPLATE_URL:'templates/locateUs.html',
					CONTROLLER:'MapCtrl'
				},
				CONTACTUS:{
					STATE:'contactUs',
					URL:'/contactUs',
					TEMPLATE_URL:'templates/ContactUs.html',
					CONTROLLER:'contactUsCtrl'
				},
				FAQ:{
					STATE:'faq',
					URL:'/faq',
					TEMPLATE_URL:'templates/faq.html',
					CONTROLLER:'faqCtrl'
				},
				PRIVACYPOLICY:{
					STATE:'privacyPolicy',
					URL:'/privacyPolicy',
					TEMPLATE_URL:'templates/privacy-policy.html',
					CONTROLLER:'privacyPolicyCtrl'
				},
				FUNDTRANSFER:{
					STATE:'app.fundTransfer',
					URL:'/fundTransfer',
					TEMPLATE_URL:'templates/Fundtransfer/fundtransfer.html',
					CONTROLLER:'FundTransferCtrl'
				},
				FUNDTRANSFER_CONFIRM:{
					STATE:'app.fundConfirm',
					URL:'/fundConfirm',
					TEMPLATE_URL:'templates/Fundtransfer/fundtransfer-confirm.html',
					CONTROLLER:'FundTransferConfirmCtrl'
				},
				FUNDTRANSFER_COMPLETE:{
					STATE:'app.fundComplete',
					URL:'/fundComplete',
					TEMPLATE_URL:'templates/Fundtransfer/fundtransfer-complete.html',
					CONTROLLER:'FundTransferCompleteCtrl'
				},
				FUNDTRANSFER_SCHEDULE:{
					STATE:'app.scheduleFundTransfer',
					URL:'/scheduleFundTransfer',
					TEMPLATE_URL:'templates/Schedule/schedule.html',
					CONTROLLER:'ScheduleCtrl'
				},
				MY_ACCOUNT:{
					STATE:'app.myAccount',
					URL:'/myAccount',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/MyAccounts.html',
					CONTROLLER:'MyAccountCtrl'
				},
				OTHER_ACCOUNT:{
					STATE:'app.otherAccount',
					URL:'/otherAccount',
					TEMPLATE_URL:'templates/ManageAccounts/OtherAccounts/other-account.html',
					CONTROLLER:'OtherAccountCtrl'
				},
				MUTUAL_FUND_SUMMARY:{
					STATE:'app.mutualFund',
					URL:'/mutualFund',
					TEMPLATE_URL:'templates/MutualFund/MutualFund.html',
					CONTROLLER:'mutualFundCtrl'
				},
				MUTUAL_FUND_SUMMARY_DETAIL:{
					STATE:'app.mutualFundDetails',
					URL:'/mutualFundDetails',
					TEMPLATE_URL:'templates/MutualFund/mutualFundDetails.html',
					CONTROLLER:'mutualFundDetailCtrl'
				},
				SCHEDULE_FUNDTRANSFER_DETAIL:{
					STATE:'app.scheduleFundTransferDetail',
					URL:'/scheduleFundTransferDetail',
					TEMPLATE_URL:'templates/Schedule/schedule-fundtransfer-detail.html',
					CONTROLLER:'scheduleFundTransferDetailCtrl'
				},

				SCHEDULE_BILL_DETAIL:{
					STATE:'app.scheduleBillpaymentDetail',
					URL:'/scheduleBillpaymentDetail',
					TEMPLATE_URL:'templates/Schedule/schedule-billpayment-detail.html',
					CONTROLLER:'scheduleBillpaymentDetailCtrl'
				},
				
				MY_ACCOUNT_CASA_DETAILS:{
					STATE:'app.myAccountsCasaDetails',
					URL:'/myAccountsCasaDetails',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/MyAccountsCasaDetails.html',
					CONTROLLER:'CasaDetailCtrl'
				},
				MY_ACCOUNT_TD_DETAILS:{
					STATE:'app.myAccountsTdDetails',
					URL:'/myAccountsTdDetails',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/MyAccountsTdDetails.html',
					CONTROLLER:'TdDetailCtrl'
				},
				MY_ACCOUNT_ADD:{
					STATE:'app.addMyAccounts',
					URL:'/addMyAccounts',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/AddMyAccounts.html',
					CONTROLLER:'ManageAccountDetailCtrl'
				},
				MY_ACCOUNT_ADD_DETAIL:{
					STATE:'app.addMyAccountsDetail',
					URL:'/addMyAccountsDetail',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/AddMyAccountsDetail.html',
					CONTROLLER:'manageAccountConfirmCtrl'
				},
				MY_ACCOUNT_CASA_VIEW_STATEMENT:{
					STATE:'app.myAccountsCasaViewStatement',
					URL:'/myAccountsCasaViewStatement',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/MyAccountsCasaViewStatement.html',
					CONTROLLER:'CasaStatementCtrl'
				},
				MY_ACCOUNT_EDIT:{
					STATE:'app.editMyAccounts',
					URL:'/editMyAccounts',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/EditMyAccounts.html',
					CONTROLLER:'EditAccountCtrl'
				},
				MY_ACCOUNT_EDIT_DETAIL:{
					STATE:'app.editMyAccountsDetail',
					URL:'/editMyAccountsDetail',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/EditMyAccountsDetail.html',
					CONTROLLER:'manageAccountConfirmCtrl'
				},
				MY_ACCOUNT_CHANGE_TERM:{
					STATE:'app.myAccountsChangeTerm',
					URL:'/myAccountsChangeTerm',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/MyAccountsChangeTerm.html',
					CONTROLLER:'changeTermCtrl'
				},
				MY_ACCOUNT_CHANGE_TERM_CONDITION:{
					STATE:'app.myAccountsChangeTermCondition',
					URL:'/myAccountsChangeTermCondition',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/MyAccountsChangeTermCondition.html',
					CONTROLLER:'changeTermCtrl'
				},
				MY_ACCOUNT_CHANGE_TERM_CONFIRM:{
					STATE:'app.myAccountsChangeTermConfirm',
					URL:'/myAccountsChangeTermConfirm',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/MyAccountsChangeTermConfirm.html',
					CONTROLLER:'changeTermCtrl'
				},
				ANYID:{
					STATE:'app.anyID',
					URL:'/anyID',
					TEMPLATE_URL:'templates/AnyID/anyID.html',
					CONTROLLER:'AnyIDCtrl'
				},
				ANYID_RESULT:{
					STATE:'app.anyIDComplete',
					URL:'/anyIDComplete',
					TEMPLATE_URL:'templates/AnyID/anyID-complete.html',
					CONTROLLER:'AnyIDCompleteCtrl'
				},
				ANYID_CONFIRM:{
					STATE:'app.anyIDConfirm',
					URL:'/anyIDConfirm',
					TEMPLATE_URL:'templates/AnyID/anyID-confirm.html',
					CONTROLLER:'AnyIDConfirmCtrl'
				},
					BILLER_LIST_PROMPTPAY:{
  				    STATE:"app.billerListPromptPay",
					URL:"/manageBillerPromptPay",
					TEMPLATE_URL:"templates/BillPaymentPromptPay/billerList-promptpay.html",
					CONTROLLER:"ManageBillerPromptPayCtrl"
				},
		
				BILLER_DETAIL_PROMPTPAY:{
					    STATE:"app.billerDetailPromptPay",
					URL:"/BillerDetailPromptPay",
					TEMPLATE_URL:"templates/BillPaymentPromptPay/billerDetail-promptpay.html",
					CONTROLLER:"billerDetailPromptPayCtrl"
				},
				
				ADD_BILLER_PROMPTPAY:{
					STATE:"app.addBillerPromptPay",
					URL:"/addBillerPromptPay",
					TEMPLATE_URL:"templates/BillPaymentPromptPay/addBiller-promptpay.html",
					CONTROLLER:"AddBillerPromptPayCtrl"
				},
				ADD_BILLER_CONFIRM_PROMPTPAY:{
					STATE:"app.addBillerConfirmPromptPay",
					URL:"/addBillerConfirmPromptPay",
					TEMPLATE_URL:"templates/BillPaymentPromptPay/addBillerConfirm-promptpay.html",
					CONTROLLER:"AddBillerConfirmPromptPayCtrl"
				},
				EDIT_BILLER_PROMPTPAY:{
					STATE:"app.editBillerPromptPay",
					URL:"/editBillerPromptPay",
					TEMPLATE_URL:"templates/BillPaymentPromptPay/editBiller-promptpay.html",
					CONTROLLER:"EditBillerPromptPayCtrl"
				},
				EDIT_BILLER_CONFRIM_PROMPTPAY:{
					STATE:"app.editBillerConfirmPromptPay",
					URL:"/editBillerConfirmPromptPay",
					TEMPLATE_URL:"templates/BillPaymentPromptPay/editBillerConfirm-promptpay.html",
					CONTROLLER:"EditBillerConfirmPromptPayCtrl"
				},
				BILL_PAYMENT_PROMPTPAY:{
					STATE:"app.billPaymentPromptPay",
					URL:"/billPaymentPromptPay",
					TEMPLATE_URL:"templates/BillPaymentRTP/billPaymentRTP.html",
					CONTROLLER:"billPaymentRTPCtrl"
				},
				BILL_PAYMENT_PROMPTPAY_CONFIRM:{
					STATE:"app.billPaymentComfirmPromptPay",
					URL:"/billPaymentComfirmPromptPay",
					TEMPLATE_URL:"templates/BillPaymentRTP/billPaymentRTPConfirmOTP.html",
					CONTROLLER:"billPaymentRTPConfirmOTPCtrl"
				},
				BILL_PAYMENT_PROMPTPAY_RESULT:{
					STATE:"app.billPaymentResultPromptPay",
					URL:"/billPaymentResultPromptPay",
					TEMPLATE_URL:"templates/BillPaymentRTP/billPaymentRTP-Result.html",
					CONTROLLER:"BillPaymentRTPResultCtrl"
					},
				TRANSACTION_HISTORY_BILL_PAYMENT_DETAIL:{
					STATE:'app.historyBillPaymentRTPDetail',
					URL:'/historyBillPaymentRTPDetail',
					TEMPLATE_URL:'templates/HistoryRequestToPay/historyBillPaymentDetail.html',
					CONTROLLER:'HistoryBillPaymentDetailCtrl'
				},
				TRANSACTION_HISTORY_E_DONATION_DETAIL:{
					STATE:'app.historyEDonationDetail',
					URL:'/historyEDonationDetail',
					TEMPLATE_URL:'templates/HistoryRequestToPay/historyEDonationDetail.html',
					CONTROLLER:'HistoryBillPaymentDetailCtrl'
				},
				BILL_E_DONATION:{
					STATE:"app.eDonation",
					URL:"/eDonation",
					TEMPLATE_URL:"templates/eDonation/eDonation.html",
					CONTROLLER:"eDonationCtrl"
				},
				BILL_E_DONATION_CONFIRM:{
					STATE:"app.eDonationConfirm",
					URL:"/eDonationConfirm",
					TEMPLATE_URL:"templates/eDonation/eDonationConfirm.html",
					CONTROLLER:"eDonationConfirmCtrl"
				},
				BILL_E_DONATION_RESULT:{
					STATE:"app.eDonationResult",
					URL:"/eDonationResult",
					TEMPLATE_URL:"templates/eDonation/eDonationResult.html",
					CONTROLLER:"eDonationResultCtrl"
				},
				TRANSACTION_HISTORY_FUNDTRANSFER:{
					STATE:'app.historyFundtransferRTP',
					URL:'/historyFundtransferRTP',
					TEMPLATE_URL:'templates/HistoryRequestToPay/historyFundtransfer.html',
					CONTROLLER:'HistoryFuntransferCtrl'
				},
            	TRANSACTION_HISTORY_FUNDTRANSFER_DETAIL:{
					STATE:'app.historyFundTransferDetail',
					URL:'/historyFundTransferDetail',
					TEMPLATE_URL:'templates/HistoryRequestToPay/historyFundTransferDetail.html',
					CONTROLLER:'HistoryFundTransferDetailCtrl'
				},
				TRANSACTION_HISTORY_BILLPAYMENT:{
					STATE:'app.historyBillpaymentRTP',
					URL:'/historyBillpaymentRTP',
					TEMPLATE_URL:'templates/HistoryRequestToPay/historyBillpayment.html',
					CONTROLLER:'HistoryBillpaymentCtrl'
				},
				TRANSACTION_HISTORY_RTP:{
					STATE:'app.transactionHistoryRTP',
					URL:'/transactionHistoryRTP',
					TEMPLATE_URL:'templates/HistoryRequestToPay/historyRTP.html',
					CONTROLLER:'HistoryRTPCtrl'
				
				},
				REQUEST_TO_PAY_INCOMING_LIST:{
					STATE:'app.requestToPayList',
					URL:'/requestToPayList',
					TEMPLATE_URL:'templates/RequestToPayInComing/requestToPayList.html',
					CONTROLLER:'RequestToPayInComingCtrl'
				},
				REQUEST_TO_PAY_DETAIL:{
					STATE:'app.requestToPayDetail',
					URL:'/requestToPayDetail',
					TEMPLATE_URL:'templates/RequestToPayInComing/requestToPayDetail.html',
					CONTROLLER:'RequestToPayInComingDetailCtrl'
				},
				REQUEST_TO_PAY_OUTGOING_LIST:{
					STATE:'app.requestToPayOutList',
					URL:'/requestToPayOutList',
					TEMPLATE_URL:'templates/RequestToPayOutGoing/requestToPayOutGoing.html',
					CONTROLLER:'RequestToPayOutGoingCtrl'
				},
				REQUEST_TO_PAY_OUTGOING_DETAIL:{
					STATE:'app.requestToPayOutDetail',
					URL:'/requestToPayOutDetail',
					TEMPLATE_URL:'templates/RequestToPayOutGoing/requestToPayOutGoingDetail.html',
					CONTROLLER:'RequestToPayOutGoingDatailCtrl'
				},
				RTP_REQUEST:{
					STATE:'app.rtpRequest',
					URL:'/rtpRequest',
					TEMPLATE_URL:'templates/RTPRequest/rtpRequest.html',
					CONTROLLER: 'RTPRequestCtrl'
				},
				RTP_REQUEST_CONFIRM:{
					STATE:'app.rtpRequestConfirm',
					URL: '/rtpRequestConfirm',
					TEMPLATE_URL: 'templates/RTPRequest/rtprequest-confirmotp.html',
					CONTROLLER: 'rtpRequestConfirmOTPCtrl'
				},
				RTP_REQUEST_RESULT:{
					STATE:'app.rtpRequestResult',
					URL: '/rtpRequestResult',
					TEMPLATE_URL: 'templates/RTPRequest/rtprequest-result.html',
					CONTROLLER: 'rtprequestResultCtrl'
				},
				QR_CODE_SCANNER: {
					STATE:'app.QRScanner',
					URL:'/QRScanner',
					TEMPLATE_URL:'templates/QRScanner/QRScanner.html',
					CONTROLLER:'QRScannerCtrl'
				},
				QR_CODE_GENERATOR: {
					STATE:'app.QRGenerator',
					URL:'/QRGenerator',
					TEMPLATE_URL:'templates/QRGenerator/QRGenerator.html',
					CONTROLLER:'QRGeneratorCtrl'
				},
				QR_CODE_GENERATOR_COMPLETE: {
					STATE:'app.QRGeneratorComplete',
					URL:'/QRGeneratorComplete',
					TEMPLATE_URL:'templates/QRGenerator/QRGeneratorComplete.html',
					CONTROLLER:'QRGeneratorCompleteCtrl'
				},
				QR_VERIFY_FUND_TRANSFER_DETAIL: {
					STATE:'app.QRVerifyFundTransferDetail',
					URL:'/QRVerifyFundTransferDetail',
					TEMPLATE_URL:'templates/verifyQRDetail/QRVerifyFundTransferDetail.html',
					CONTROLLER:'QRVerifyDetailCtrl'
				},
				QR_VERIFY_BILL_PAYMENT_DETAIL: {
					STATE:'app.QRVerifyBillPaymentDetail',
					URL:'/QRVerifyBillPaymentDetail',
					TEMPLATE_URL:'templates/verifyQRDetail/QRVerifyBillPaymentDetail.html',
					CONTROLLER:'QRVerifyDetailCtrl'
				},
				CREATE_PIN_USING_USERNAME_STEP1: {
					STATE:'createPinUsingUsernameStep1',
					URL:'/createPinUsingUsernameStep1',
					TEMPLATE_URL:'templates/ManagePin/create/user/create-pin-using-user-step1.html',
					CONTROLLER:'createPinUsingUsernameStep1Ctrl'
				},
				CREATE_PIN_USING_USERNAME_STEP2: {
					STATE:'createPinUsingUsernameStep2',
					URL:'/createPinUsingUsernameStep2',
					TEMPLATE_URL:'templates/ManagePin/create/user/create-pin-using-user-step2.html',
					CONTROLLER:'createPinUsingUsernameStep2Ctrl'
				},
				CREATE_PIN_USING_USERNAME_STEP3: {
					STATE:'createPinUsingUsernameStep3',
					URL:'/createPinUsingUsernameStep3',
					TEMPLATE_URL:'templates/ManagePin/create/user/create-pin-using-user-step3.html',
					CONTROLLER:'createPinUsingUsernameStep3Ctrl'
				},
				CREATE_PIN_USING_USERNAME_STEP4: {
					STATE:'createPinUsingUsernameStep4',
					URL:'/createPinUsingUsernameStep4',
					TEMPLATE_URL:'templates/ManagePin/create/user/create-pin-using-user-step4.html',
					CONTROLLER:'createPinUsingUsernameStep4Ctrl'
				},
				CREATE_PIN_USING_DEBITCARD_STEP1: {
					STATE:'createPinUsingDebitcardStep1',
					URL:'/createPinUsingDebitcardStep1',
					TEMPLATE_URL:'templates/ManagePin/create/debitcard/create-pin-using-debitcard-step1.html',
					CONTROLLER:'createPinUsingDebitcardStep1Ctrl'
				},
				CREATE_PIN_USING_DEBITCARD_STEP2: {
					STATE:'createPinUsingDebitcardStep2',
					URL:'/createPinUsingDebitcardStep2',
					TEMPLATE_URL:'templates/ManagePin/create/debitcard/create-pin-using-debitcard-step2.html',
					CONTROLLER:'createPinUsingDebitcardStep2Ctrl'
				},
				CREATE_PIN_USING_DEBITCARD_STEP3: {
					STATE:'createPinUsingDebitcardStep3',
					URL:'/createPinUsingDebitcardStep3',
					TEMPLATE_URL:'templates/ManagePin/create/debitcard/create-pin-using-debitcard-step3.html',
					CONTROLLER:'createPinUsingDebitcardStep3Ctrl'
				},
				CREATE_PIN_USING_DEBITCARD_STEP4: {
					STATE:'createPinUsingDebitcardStep4',
					URL:'/createPinUsingDebitcardStep4',
					TEMPLATE_URL:'templates/ManagePin/create/debitcard/create-pin-using-debitcard-step4.html',
					CONTROLLER:'createPinUsingDebitcardStep4Ctrl'
				},
				CREATE_PIN_PORTAL: {
					STATE:'createPinPortal',
					URL:'/createPinPortal',
					TEMPLATE_URL:'templates/ManagePin/create/create-pin-portal.html',
					CONTROLLER:'createPinPortalCtrl'
				},
				CREATE_PIN_USING_PRODUCT_STEP1: {
					STATE:'createPinUsingProductStep1',
					URL:'/createPinUsingProductStep1',
					TEMPLATE_URL:'templates/ManagePin/create/product/create-pin-using-product-step1.html',
					CONTROLLER:'createPinUsingProductStep1Ctrl'
				},
				CREATE_PIN_USING_PRODUCT_STEP2: {
					STATE:'createPinUsingProductStep2',
					URL:'/createPinUsingProductStep2',
					TEMPLATE_URL:'templates/ManagePin/create/product/create-pin-using-product-step2.html',
					CONTROLLER:'createPinUsingProductStep2Ctrl'
				},
				CREATE_PIN_USING_PRODUCT_STEP3: {
					STATE:'createPinUsingProductStep3',
					URL:'/createPinUsingProductStep3',
					TEMPLATE_URL:'templates/ManagePin/create/product/create-pin-using-product-step3.html',
					CONTROLLER:'createPinUsingProductStep3Ctrl'
				},
				CREATE_PIN_USING_PRODUCT_STEP4: {
					STATE:'createPinUsingProductStep4',
					URL:'/createPinUsingProductStep4',
					TEMPLATE_URL:'templates/ManagePin/create/product/create-pin-using-product-step4.html',
					CONTROLLER:'createPinUsingProductStep4Ctrl'
				},
				RESET_PIN_PORTAL: {
					STATE:'resetPinPortal',
					URL:'/resetPinPortal',
					TEMPLATE_URL:'templates/ManagePin/reset/reset-pin-portal.html',
					CONTROLLER:'resetPinPortalCtrl'
				},
				RESET_PIN_USING_USERNAME_STEP1: {
					STATE:'resetPinUsingUsernameStep1',
					URL:'/resetPinUsingUsernameStep1',
					TEMPLATE_URL:'templates/ManagePin/reset/user/reset-pin-using-user-step1.html',
					CONTROLLER:'resetPinUsingUsernameStep1Ctrl'
				},
				RESET_PIN_USING_USERNAME_STEP2: {
					STATE:'resetPinUsingUsernameStep2',
					URL:'/resetPinUsingUsernameStep2',
					TEMPLATE_URL:'templates/ManagePin/reset/user/reset-pin-using-user-step2.html',
					CONTROLLER:'resetPinUsingUsernameStep2Ctrl'
				},
				RESET_PIN_USING_DEBITCARD_STEP1: {
					STATE:'resetPinUsingDebitcardStep1',
					URL:'/resetPinUsingDebitcardStep1',
					TEMPLATE_URL:'templates/ManagePin/reset/debitcard/reset-pin-using-debitcard-step1.html',
					CONTROLLER:'resetPinUsingDebitcardStep1Ctrl'
				},
				RESET_PIN_USING_DEBITCARD_STEP2: {
					STATE:'resetPinUsingDebitcardStep2',
					URL:'/resetPinUsingDebitcardStep2',
					TEMPLATE_URL:'templates/ManagePin/reset/debitcard/reset-pin-using-debitcard-step2.html',
					CONTROLLER:'resetPinUsingDebitcardStep2Ctrl'
				},
				RESET_PIN_USING_PRODUCT_STEP1: {
					STATE:'resetPinUsingProductStep1',
					URL:'/resetPinUsingProductStep1',
					TEMPLATE_URL:'templates/ManagePin/reset/product/reset-pin-using-product-step1.html',
					CONTROLLER:'resetPinUsingProductStep1Ctrl'
				},
				RESET_PIN_USING_PRODUCT_STEP2: {
					STATE:'resetPinUsingProductStep2',
					URL:'/resetPinUsingProductStep2',
					TEMPLATE_URL:'templates/ManagePin/reset/product/reset-pin-using-product-step2.html',
					CONTROLLER:'resetPinUsingProductStep2Ctrl'
				},
				RTP_BLOCKLIST: {
					STATE:'app.RequestToPayBlockList',
					URL:'/RequestToPayBlockList',
					TEMPLATE_URL:'templates/requestToPayBlocklist.html',
					CONTROLLER:'RequestToPayBlockListCtrl'
				
				},
				ANYID_DETAILS: {
					STATE:'app.AnyIdDetails',
					URL:'/AnyIdDetails',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/MyAccountAnyIdDetails.html',
					CONTROLLER:'AnyIdDetailsCtrl'
				},
				NOTIFICATION: {
					STATE:'app.notification',
					URL:'/notification',
					TEMPLATE_URL:'templates/Notification/Notification.html',
					CONTROLLER:'NotificationCtrl'
				},
				MY_ANYID_ACCOUNT:{
					STATE:'app.myAnyIDAccount',
					URL:'/myAnyIDAccount',
					TEMPLATE_URL:'templates/ManageAccounts/MyAccounts/MyAccounts.html',
					CONTROLLER:'MyAccountCtrl'
				},
				ANY_ID_EDIT:{
					STATE:'app.anyIdEdit',
					URL:'/anyIdEdit',
					TEMPLATE_URL:'templates/AnyIdEdit/anyIdEdit.html',
					CONTROLLER:'anyIdEditCtrl'
				},
				ANY_ID_EDIT_CONFIRM:{
					STATE:'app.anyIdEditConfirm',
					URL:'/anyIdEditConfirm',
					TEMPLATE_URL:'templates/AnyIdEdit/anyIdEditConfirm.html',
					CONTROLLER:'anyIdEditConfirmCtrl'
				},
				ANY_ID_EDIT_COMPLETE:{
					STATE:'app.anyIdEditComplete',
					URL:'/anyIdEditComplete',
					TEMPLATE_URL:'templates/AnyIdEdit/anyIdEditComplete.html',
					CONTROLLER:'anyIdEditCompleteCtrl'
				},
				SUITABILITY_LISK:{
					STATE:'app.suitabilityScore',
					URL:'/suitabilityScore',
					TEMPLATE_URL:'templates/MutualFund/SuitabilityScore.html',
					CONTROLLER:'SuitabilityScoreCtrl'
				},
					SUITABILITY_QUESTION:{
					STATE:'app.suitabilityQuestion',
					URL:'/suitabilityQuestion',
					TEMPLATE_URL:'templates/MutualFund/SuitabilityQuestion.html',
					CONTROLLER:'SuitabilityQuestionCtrl'
				},

				MUTUAL_FUND:{
					STATE:'app.mutualFund1',
					URL:'/mutualFund1',
					TEMPLATE_URL:'templates/MutualFund1/MutualFund1.html',
					CONTROLLER:'mutualFundCtrl1'
				},
				MY_MUTUAL_FUND_PURCHASE:{
					STATE:'app.mutualFundPurchase',
					URL:'/mutualFundPurchase',
					TEMPLATE_URL:'templates/MutualFund/Purchase/mutualFundPurchase.html',
					CONTROLLER:'mutualFundPurchaseCtrl'
				},
				MY_MUTUAL_FUND_PURCHASE_CONFIRM:{
					STATE:'app.mutualFundPurchaseConfirm',
					URL:'/mutualFundPurchaseConfirm',
					TEMPLATE_URL:'templates/MutualFund/Purchase/mutualFundPurchaseConfirm.html',
					CONTROLLER:'mutualFundPurchaseConfirmCtrl'
				},
					MY_MUTUAL_FUND_PURCHASE_RESULT:{
					STATE:'app.mutualFundPurchaseResult',
					URL:'/mutualFundPurchaseResult',
					TEMPLATE_URL:'templates/MutualFund/Purchase/mutualFundPurchaseResult.html',
					CONTROLLER:'mutualFundPurchaseResultCtrl'
				},
				MY_MUTUAL_FUND_REDEEM:{
					STATE:'app.mutualFundRedeem',
					URL:'/mutualFundRedeem',
					TEMPLATE_URL:'templates/MutualFund/Redeem/mutualFundRedeem.html',
					CONTROLLER:'mutualFundRedeemCtrl'
				},
				MY_MUTUAL_FUND_REDEEM_CONFIRM:{
					STATE:'app.mutualFundRedeemConfirm',
					URL:'/mutualFundRedeemConfirm',
					TEMPLATE_URL:'templates/MutualFund/Redeem/mutualFundRedeemConfirm.html',
					CONTROLLER:'mutualFundRedeemConfirmCtrl'
				},
				MY_MUTUAL_FUND_REDEEM_RESULT:{
					STATE:'app.mutualFundRedeemResult',
					URL:'/mutualFundRedeemResult',
					TEMPLATE_URL:'templates/MutualFund/Redeem/mutualFundRedeemResult.html',
					CONTROLLER:'mutualFundRedeemResultCtrl'
				},
				MY_MUTUAL_FUND_SWITCH:{
					STATE:'app.mutualFundSwitch',
					URL:'/mutualFundSwitch',
					TEMPLATE_URL:'templates/MutualFund/Switch/mutualFundSwitch.html',
					CONTROLLER:'mutualFundSwitchCtrl'
				},
				MY_MUTUAL_FUND_SWITCH_CONFIRM:{
					STATE:'app.mutualFundSwitchConfirm',
					URL:'/mutualFundSwitchConfirm',
					TEMPLATE_URL:'templates/MutualFund/Switch/mutualFundSwitchConfirm.html',
					CONTROLLER:'mutualFundSwitchConfirmCtrl'
				},
				MY_MUTUAL_FUND_SWITCH_RESULT:{
					STATE:'app.mutualFundSwitchResult',
					URL:'/mutualFundSwitchResult',
					TEMPLATE_URL:'templates/MutualFund/Switch/mutualFundSwitchResult.html',
					CONTROLLER:'mutualFundSwitchResultCtrl'
				},
				MY_MUTUAL_FUND_TRANSACTION_TODAY:{
					STATE:'app.mutualFundHistory',
					URL:'/mutualFundHistory',
					TEMPLATE_URL:'templates/MutualFund/MutualFund-history-list.html',
					CONTROLLER:'mutualFundHistoryCtrl'
				},
				MY_MUTUAL_FUND_TRANSACTION_DETAIL:{
					STATE:'app.mutualFundTransactionDetail',
					URL:'/mutualFundTransactionDetail',
					TEMPLATE_URL:'templates/MutualFund/MutualFund-transaction-detail.html',
					CONTROLLER:'mutualFundTransactionDetailCtrl'
				},
				MY_MUTUAL_FUND_SEARCH:{
					STATE:'app.mutualFundSearch',
					URL:'/mutualFundSearch',
					TEMPLATE_URL:'templates/MutualFund/MutualFund-search.html',
					CONTROLLER:'mutualFundSearchCtrl'
				},
			    MY_MUTUAL_FUND_DETAIL_SEARCH:{
					STATE:'app.mutualFundSearchDetail',
					URL:'/mutualFundSearchDetail',
					TEMPLATE_URL:'templates/MutualFund/MutualFund-search-datail.html',
					CONTROLLER:'mutualFundSearchDetailCtrl'
				},
				MY_MUTUAL_FUND_VIEW_STATEMENT:{
					STATE:'app.myMutualFundViewStatement',
					URL:'/myMutualFundViewStatement',
					TEMPLATE_URL:'templates/MutualFund/MutualFund-view-statement.html',
					CONTROLLER:'mutualFundViewStatementCtrl'
				},
				MANAGE_DEVICE: {
					STATE:'app.manageDevice',
					URL:'/manageDevice',
					TEMPLATE_URL:'templates/ManageDevice/Manage-Device.html',
					CONTROLLER:'manageDeviceCtrl'
				},
				LIST_AUTHEN_NDID: {
					STATE:'app.listAuthenNDID',
					URL:'/listAuthenNDID',
					TEMPLATE_URL:'templates/NDIDAuthen/ndid-authen-list.html',
					CONTROLLER:'NDIDAuthenListCtrl'
				},
				LIST_CREDIT_BUREAU: {
					STATE:'app.listCreditBureau',
					URL:'/listCreditBureau',
					TEMPLATE_URL:'templates/NCB/credit-bureau-list.html',
					CONTROLLER:'CreditBureauListCtrl'
				},
				REQUEST_BUREAU_MENU: {
					STATE:'app.requestBureauMenu',
					URL:'/requestBureauMenu',
					TEMPLATE_URL:'templates/NCB/request-bureau-menu.html',
					CONTROLLER:'RequestBureauMenuCtrl'
				},
				CONFIRM_NCB_REQUEST: {
					STATE:'app.confirmNCBRequest',
					URL:'/confirmNCBRequest',
					TEMPLATE_URL:'templates/NCB/confirm-NCB-request.html',
					CONTROLLER:'ConfirmNCBRequestCtrl'
				},
				
				CONFIRM_AUTHEN_NDID: {
					STATE:'app.confirmAuthenNDID',
					URL:'/confirmAuthenNDID',
					CONTROLLER:'NDIDAuthenConfirmCtrl',
					TEMPLATE_URL:'templates/NDIDAuthen/ndid-authen-confirm.html',
				},
				VERIFY_FACE_AUTHEN_NDID: {
					STATE:'app.verifyFaceAuthenNDID',
					URL:'/verifyFaceAuthenNDID',
					TEMPLATE_URL:'templates/NDIDAuthen/ndid-authen-verify-face.html',
					CONTROLLER:'NDIDAuthenFaceDetectCtrl'
				},
				RESULT_AUTHEN_NDID: {
					STATE:'app.resultAuthenNDID',
					URL:'/resultAuthenNDID',
					TEMPLATE_URL:'templates/NDIDAuthen/ndid-authen-result.html',
					CONTROLLER:'NDIDAuthenResultCtrl'
				},
				NEW_USER_AUTHEN_STEP1: {
					STATE:'newUserAuthenStep1',
					URL:'/newUserAuthenStep1',
					TEMPLATE_URL:'templates/ManagePin/newuser/new-user-authen-step1.html',
					CONTROLLER:'newUserAuthenticationStep1Ctrl'
				},
				NEW_USER_AUTHEN_STEP2: {
					STATE:'newUserAuthenStep2',
					URL:'/newUserAuthenStep2',
					TEMPLATE_URL:'templates/ManagePin/newuser/new-user-authen-step2.html',
					CONTROLLER:'newUserAuthenticationStep2Ctrl'
				},
				NEW_USER_AUTHEN_STEP3: {
					STATE:'newUserAuthenStep3',
					URL:'/newUserAuthenStep3',
					TEMPLATE_URL:'templates/ManagePin/newuser/new-user-authen-step3.html',
					CONTROLLER:'newUserAuthenticationStep3Ctrl'
				},
				LOGINSETTING:{
					STATE:'app.loginSetting',
					URL:'/loginSetting',
					TEMPLATE_URL:'templates/loginSetting.html',
					CONTROLLER:'LoginSettingCtrl'
				},
				TRANSACTION_HISTORY_NDID_AUTHEN:{
					STATE:'app.transactionHistoryNDIDAuthen',
					URL:'/transactionHistoryNDIDAuthen',
					TEMPLATE_URL:'templates/HistoryRequestToPay/historyNDIDAuthen.html',
					CONTROLLER:'HistoryNDIDAuthenCtrl'
				
				},
				TRANSACTION_HISTORY_NDID_AUTHEN_DETAIL:{
					STATE:'app.transactionHistoryNDIDAuthenDetail',
					URL:'/transactionHistoryNDIDAuthenDetail',
					TEMPLATE_URL:'templates/HistoryRequestToPay/historyNDIDAuthenDetail.html',
					CONTROLLER:'HistoryNDIDAuthenDetailCtrl'
				}
			},
			IS_ILLEGAL_TRUE:'TRUE',
			IS_ILLEGAL_FALSE:'FALSE',
			SPINNER:'<ion-spinner icon="circles"></ion-spinner>',
			PROMOTION_URL: 'http://' + 'www.kiatnakin.co.th/',
			//PROD
	//		SSL_CHECKER_FILE:'ebankingkiatnakincoth.der',//dev = pmfps.der //ebankingkiatnakincoth.der,
			BILLER_ICON_URL: 'https://'+'ebanking.kkpfg.com/ebanking/assets/images/biller_icons/',
			
			//UAT
			// SSL_CHECKER_FILE:'pmfps.der',//dev = pmfps.der //ebankingkiatnakincoth.der,
			// BILLER_ICON_URL: 'https://'+'mfpu.kiatnakin.co.th/ribweb/assets/images/biller_icons/',


			// BILLER_ICON_URL: 'http://10.3.112.200:9099/ribweb/biller_icons/',

			DEFAULT_BILLER_ICON: 'images/biller.png',
			DEFAULT_E_DONATION_ICON: 'images/eDonation.png',
			E_DONATION_CITIZEN: 'I',
        	E_DONATION_PASSPORT: 'P',
        	ACTION_CODE_BILL_PAYMENT: 'bill_payment',
			ACTION_CODE_E_DONATION: 'bill_payment_edonation',
			NDID_TRANSACTION_TYPE: {
				RIBMOBILE_LOGINPIN: 'RIBMOBILE_LOGINPIN',
				RIBMOBILE_LOGINPIN_OTP: 'RIBMOBILE_LOGINPIN_OTP',
				RIBMOBILE_LOGINPIN_OTP_FACE: 'RIBMOBILE_LOGINPIN_OTP_FACE',
				RIBMOBILE_LOGINPIN_PIN: 'RIBMOBILE_LOGINPIN_PIN',
				RIBMOBILE_LOGINPIN_PIN_FACE: 'RIBMOBILE_LOGINPIN_PIN_FACE',
			},
			FACE_RECOG_ERROR: {
				CANRETRY: 'RIB-E-FAC001',
				CANNOTRETRY: 'RIB-E-FAC002'
			},
			BUILD_NUM: '30',
			PREFIX_SIT_URL: '10.208',
			PREFIX_UAT_URL: 'mfpuapi'
	})
	.constant('whiteList', {
		//whitelist for certificate pinning
		SSL_CHECKER :{
			checkDeviceUUIDProcedure : true,
			loginByUsernameAndPasswordProcedure : true,
			resetPINVerifyUserProcedure : true,
			submitPinLogin : true,
			submitVerifyResetPIN : true,
			fundTransferProcedure : true,
			fundTransferTDProcedure : true,
			prepareFundTransferProcedure : true,
			prepareFundTransferTDProcedure :true,
			confirmBillPaymentProcedure : true,
			confirmEditBillPaymentProcedure : true
		}
	});
