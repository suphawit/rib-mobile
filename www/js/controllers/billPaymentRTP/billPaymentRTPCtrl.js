
angular.module('ctrl.billPaymentRTPCtrl', [])
	.controller('billPaymentRTPCtrl', function ($scope, $ionicHistory, $ionicModal, $state, generalService, $filter, popupService, scheduleBillpaymentService, $translate, generalValueDateService, mainSession, dateService, myAccountService, displayUIService, $ionicScrollDelegate, kkconst, billPaymentRTPService, requestToPayInComingService, manageBillerPromptPayService, cordovadevice, downloadAndStoreFile, $ionicPlatform,qrcodeBarcodeInfoService, eDonationService) {
		// binding data with template billpayment.html
		$scope.isShowBack = false;
		$scope.isShowNext = true;
		$scope.isShowSelectAccount = true;
		$scope.isShowNoBiller = false;
		$scope.isShowRecurringButton = true;
		$scope.isRecurringEnabled = false;
		$scope.isEnableTodayBtn = true;
		$scope.isEnableFurtureBtn = false;
		$scope.isRTPPayment = false;
		$scope.memo = {
			txt: ''
		};
		$scope.TodayBtnClass = 'selectedBtnBGColor';
		$scope.FurtureBtnClass = 'unSelectedBtnBGColor';
		$scope.placeholderAmount = '0.00';
		$scope.selectedScheduleType;
		$scope.scheduleTypeList = [];
		$scope.selectedRecurringTime;
		$scope.recurringTimeList = [];
		$scope.editScheduleBill = false;
		$scope.account = null;
		$scope.biller = null;
		$scope.serverDate = null;
		$scope.paymentDate = null;
		$scope.amountModel = {
			amount: ''
		};
		$scope.datePickerShow = undefined;
		$scope.accountlists = [];

		var billerlists = [];
		$scope.billerlistsFilter = [];
		$scope.chromeview = false;
		$scope.billerCategoryList = [];
		$scope.selectedCategory = {};
		$scope.isFromQRScannerPage = false;
		$scope.scanBillerData = {
			barcodeType: '',
			barcodeInfo: ''
		};

		$scope.bpBillerListInfo = [];
		$scope.noResult = false;
		$scope.allCategories = [];
		var watchlistener;
		$scope.txtval = {biller: ''};
		$scope.isNewBiller = false;
		$scope.isScanBiller = false;
		$scope.lang = $translate.use();

		createVirtualKeyboardAmount();
		createModal();
		viewInitial();

		$scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;

		function viewInitial() {
			recurringListInit();
			setEnableTodayBtn(true);
			setEnableFurtureBtn(false);
			getServerDate();
			historyPageInit();
			// preview select for chrome browser
			if (cordovadevice.properties('platform') === 'preview') {
				$scope.chromeview = true;
			}
		}

		function getServerDate() {
			dateService.today().then(function (result) {
				setServerDate(result);
				var serverdate_ui = $scope.serverDate.ui;

				if ($scope.editScheduleBill == false) {
					$scope.paymentDate = {
						strDate: $scope.serverDate.strDate,
						ui: {
							day_label: serverdate_ui.day_label,
							date: serverdate_ui.date,
							month_label: serverdate_ui.month_label,
							year: serverdate_ui.year,
						}
					};
				}
			});
		}

		function historyPageInit() {
			//check state from page
			var history = $ionicHistory.viewHistory();
			if (history.backView != null) {
				console.log('historyPageInit', history.backView.stateName);
				switch (history.backView.stateName) {
					case kkconst.ROUNTING.MY_ACCOUNT_CASA_DETAILS.STATE:
						fromAccountPage();
						break;
					case kkconst.ROUNTING.BILLER_DETAIL_PROMPTPAY.STATE:
						fromEditBillerDetailPage();
						break;
					// SCHEDULE_BILL_DETAIL
					case kkconst.ROUNTING.SCHEDULE_BILL_DETAIL.STATE:
						fromScheduleBillPaymentPage();
						break;
					// REQUEST_TO_PAY_DETAIL
					case kkconst.ROUNTING.REQUEST_TO_PAY_DETAIL.STATE:
						fromRTPPage();
						break;
					case kkconst.ROUNTING.QR_CODE_SCANNER.STATE:
						fromQRCodeScannerPage();
						break;
					case kkconst.ROUNTING.NOTIFICATION.STATE:
						fromRTPPage();
						break;
					case kkconst.ROUNTING.MY_ACCOUNT.STATE: 
						fromRTPPage();
					break;
					default:
						break;
				}
				$scope.isShowBack = true;

				if(history.backView == kkconst.ROUNTING.BILL_E_DONATION ||
					history.backView == kkconst.ROUNTING.BILL_E_DONATION_CONFIRM) {
					$scope.isShowBack = false;
				}
			}
		}

		function fromQRCodeScannerPage(){
			var BillerData = manageBillerPromptPayService.getDataBillerDefault();
			console.log('fromQRCodeScannerPage:BillerData', BillerData);
			$scope.biller = BillerData;
			$scope.amountModel.amount = BillerData.amount==null || parseFloat(BillerData.amount) == 0 ? '': generalService.formatNumber(parseFloat(BillerData.amount));
			$scope.scanBillerData.barcodeType = BillerData.barcodeType;

            $scope.virtualKeyboardAmount.option.isKeyboardActive = BillerData.flagAmountFix === 'N';
			//$scope.virtualKeyboardAmount.option.isKeyboardActive = BillerData.amount==null || parseFloat(BillerData.amount) == 0 ? true:false;
			$scope.isFromQRScannerPage = true;
			console.log('fromQRCodeScannerPage', BillerData)
			//inquiryPayInfoOnlineForBarScan(BillerData);
		}

		function fromRTPPage() {
			$scope.isRTPPayment = true;
			setEnableTodayBtn(true);
			setEnableFurtureBtn(false);
			$scope.isShowRecurringButton = false;
			$scope.isRecurringEnabled = false;
			$scope.virtualKeyboardAmount.option.isKeyboardActive = true;
			var rtpPayInfo = requestToPayInComingService.getRequestToPayInfo();
			$scope.biller = rtpPayInfo;

			$scope.amountModel.amount = generalService.formatNumber(parseFloat(rtpPayInfo.amount));

			getBillerInfoIcon($scope.biller);

			inquiryPayInfoOnline($scope.biller);
		}
		function fromAccountPage() {
			var account = JSON.parse(JSON.stringify(myAccountService.accountDetail));
			// new account number support
			account.myAccountNumber = account.myAccountNumber ? account.myAccountNumber.substring(0,10) : account.myAccountNumber;
			$scope.account = account;
		}

		function fromScheduleBillPaymentPage() {
			$scope.editScheduleBill = true;
			setEnableTodayBtn(false);
			setEnableFurtureBtn(true);

			var dataFromScheduleEdit = scheduleBillpaymentService.scheduleBillDataDetail;
			myAccountService.inquiryMyAccountBalanceAvailable(
				dataFromScheduleEdit.fromAccountNumber,
				function (resultCode, resultObj) {
					if (kkconst.success === resultCode) {
						$scope.account.myAvailableBalance = resultObj.value;
					} else {
						popupService.showErrorPopupMessage('lable.error', resultCode);
					}
				}
			);
			$scope.account = {
				myAccountAliasName: dataFromScheduleEdit.fromAliasName,
				interestReceivingAccount: dataFromScheduleEdit.fromAccountNumber,
			};
			$scope.account.myAccountAliasName = dataFromScheduleEdit.fromAliasName;
			$scope.account.interestReceivingAccount = dataFromScheduleEdit.fromAccountNumber;
			$scope.account.myAccountNumber = dataFromScheduleEdit.fromAccountNumber;

			$scope.amountModel.amount = generalService.formatNumber(parseFloat(dataFromScheduleEdit.payAmount));

			$scope.memo.txt = dataFromScheduleEdit.memo;

			var date_ui = displayUIService.convertForShowWeekDayDate(dataFromScheduleEdit.paymentDate1);
			$scope.paymentDate = {
				strDate: dataFromScheduleEdit.paymentDate1,
				ui: {
					day_label: date_ui.dayOfWeek,
					date: date_ui.date,
					month_label: date_ui.month,
					year: date_ui.year
				}
			};

			// set datepicker show
			$scope.datePickerShow = date_ui.dateTime;

			if(dataFromScheduleEdit.addNewBillerFlag){
				getAddNewBiller(dataFromScheduleEdit);
			}else{
				getBillerById(dataFromScheduleEdit.billerID);	
			}

			if (scheduleBillpaymentService.recurringIsOneTime) {
				$scope.isShowRecurringButton = false;
				$scope.isRecurringEnabled = false;
			} else {
				$scope.isShowRecurringButton = true;
				$scope.isRecurringEnabled = true;
				var recurringType = $filter('filter')($scope.scheduleTypeList, dataFromScheduleEdit.recurringType);
				$scope.selectedScheduleType = recurringType[0];
				var recurringTimes = $filter('filter')($scope.recurringTimeList, dataFromScheduleEdit.recurringTimes);
				$scope.selectedRecurringTime = recurringTimes[0];
			}
		}

		function fromEditBillerDetailPage() {
			var data_editbill = manageBillerPromptPayService.getDataBillerDefault();
			$scope.biller = JSON.parse(JSON.stringify(data_editbill));

			inquiryPayInfoOnline($scope.biller);
		}

		function getBillerById(billerId) {
			billPaymentRTPService.getBillersList(function (resultPaybill) {
				var respStatus = resultPaybill.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var billers = resultPaybill.result.value;
					for (var index = 0; index < billers.length; index++) {
						var biller = billers[index];
						if (biller.billerId == billerId) {
							$scope.biller = biller;
							getBillerInfoIcon($scope.biller);
							return;
						}
					}
				} else {
					popupService.showErrorPopupMessage('label.warning', respStatus.responseCode);
				}
			});
		}

		function getAddNewBiller(dataFromScheduleEdit) {
			$scope.biller = dataFromScheduleEdit;

			$scope.biller.billerNameEn = dataFromScheduleEdit.billerName;
			$scope.biller.billerNameTh = dataFromScheduleEdit.billerName;
			getBillerInfoIcon($scope.biller);
			inquiryPayInfoOnline($scope.biller);//inquiryPayInfoOnlineForEditSchedule($scope.biller);
		}

		$scope.closeAccountListModal = function () {
			$scope.isShowNext = true;
			$scope.accListModal.hide();
		};

		$scope.setRecurringEnabled = function (state) {
			$scope.isRecurringEnabled = state;
			$ionicScrollDelegate.scrollBottom(true);
		};

		$scope.setSelectedScheduleType = function (type) {
			$scope.selectedScheduleType = type;
		};

		$scope.setSelectedRecurringTime = function (time) {
			$scope.selectedRecurringTime = time;
		};

		$scope.selectTodayScheduleDate = function () {
			setEnableTodayBtn(true);
			setEnableFurtureBtn(false);
			$scope.datePickerShow = undefined;
			var serverdate_ui = $scope.serverDate.ui;
			$scope.paymentDate = {
				strDate: $scope.serverDate.strDate,
				ui: {
					day_label: serverdate_ui.day_label,
					date: serverdate_ui.date,
					month_label: serverdate_ui.month_label,
					year: serverdate_ui.year
				}
			};
			$translate.use(mainSession.lang); // update translate template
		};

		$scope.selectFutureScheduleDate = function () {
			// come from rtppage can not pay in future
			if ($scope.isRTPPayment) {
				return;
			}
			
			dateService.selectFutureScheduleDate($scope.datePickerShow, function (dateObj, strDate, defultStr) {
				if (dateObj !== null) {
					setEnableTodayBtn(false);
					setEnableFurtureBtn(true);

					$scope.$apply(function () {
						$scope.datePickerShow = defultStr;
						$scope.paymentDate = {
							strDate: strDate,
							ui: {
								day_label: dateObj.weekDayArray,
								date: dateObj.date,
								month_label: dateObj.monthFullArray,
								year: dateObj.year,
							}
						};
						$translate.use(mainSession.lang); // update translate template
					});
				}
			});
		};

		$scope.goNextPage = function () {
			if (!validatePayment()) {
				return;
			}

			if ($scope.editScheduleBill) {
				verifyEditScheduleBillPayment();
			} else {
				verifyBillPayment();
			}

		};
		$scope.displayBillerName = function (biller) {
			var billername = (mainSession.lang === 'en') ? biller.billerNameEn : biller.billerNameTh;
			return billername;
		};

		$scope.displayRefName = function (ref) {
			var refname = (mainSession.lang === 'en') ? ref.textEn : ref.textTh;
			return refname;
		};

		function setServerDate(serverDate) {
			var date = serverDate.date;
			var day = serverDate.day;
			var month = serverDate.month;
			var year = serverDate.year;
			var dateStr = date;
			var monthStr = month + 1;
			if (date < 10) {
				dateStr = '0' + date;
			}
			if (month < 10) {
				monthStr = '0' + (month + 1);
			}
			$scope.serverDate = serverDate;
			$scope.serverDate.strDate = dateStr + '/' + monthStr + '/' + year;
			$scope.serverDate.ui = {
				day_label: generalValueDateService.weekDayNamesArray[day],
				date: date,
				month_label: generalValueDateService.monthsFullNameArray[month],
				year: year,
			};
		}

		function getImmediateType() {
			if ($scope.isEnableTodayBtn) {
				return 'T';
			} else {
				return 'L';
			}
		}

		function getRecurringType() {
			if ($scope.isRecurringEnabled) {
				return 'Y';
			} else {
				return 'N';
			}
		}

		function getRecurringTime() {
			if (getRecurringType() == 'N') {
				return 0;
			} else {
				return $scope.selectedRecurringTime.value;
			}
		}

		function getScheduleType() {
			if (getRecurringType() == 'N') {
				return 0;
			} else {
				return $scope.selectedScheduleType.value;
			}
		}

		function setEnableTodayBtn(value) {
			$scope.isEnableTodayBtn = value;
			if (value) {
				$scope.TodayBtnClass = 'selectedBtnBGColor';
			} else {
				$scope.TodayBtnClass = 'unSelectedBtnBGColor';
			}
		}

		function setEnableFurtureBtn(value) {
			$scope.isEnableFurtureBtn = value;
			if (value) {
				$scope.FurtureBtnClass = 'selectedBtnBGColor';
			} else {
				$scope.FurtureBtnClass = 'unSelectedBtnBGColor';
			}
		}

		function verifyBillPayment() {
			var custName = mainSession.getSession().firstNameEN + ' ' + mainSession.getSession().lastNameEN;
			var data_verify_billpayment = {
				fromAccountNumber: $scope.account.myAccountNumber,	//old service
				billerId: $scope.biller.billerId,
				billerProfileId: $scope.biller.billerProfileId,
				promptpayBillerId: $scope.biller.promptPayBillerId,
				categoryId: $scope.biller.categoryId ? $scope.biller.categoryId : '',
				payAmount: parseFloat(generalService.parseNumber($scope.amountModel.amount) || '0.00'),
				effectiveDate: $scope.paymentDate.strDate,
				paymentDate: $scope.paymentDate.strDate,
				msgLanguage: mainSession.lang.toLowerCase(),
				immediateType: getImmediateType(),
				memo: $scope.memo.txt,
				recurringType: getRecurringType(),
				recurringTimes: getRecurringTime(),
				scheduleType: getScheduleType(),
				rtpReferenceNo: ($scope.isRTPPayment) ? $scope.biller.rtpreference : undefined,
				reference1: getReferenceValue($scope.biller.refInfos[0]),
				reference2: ($scope.biller.refInfos[1] != null && $scope.biller.refInfos[1].no == '2')?getReferenceValue($scope.biller.refInfos[1]):null,
				reference3: ($scope.biller.refInfos[1] != null && $scope.biller.refInfos[1].no == '3')?getReferenceValue($scope.biller.refInfos[1]):getReferenceValue($scope.biller.refInfos[2]),
				profileCode: $scope.biller.profileCode,
				custName: custName,
				barcodeType: ($scope.isScanBiller || $scope.isFromQRScannerPage)?$scope.scanBillerData.barcodeType || '' : '',
				companyCode: $scope.biller.companyCode,
				serviceCode: $scope.biller.serviceCode
			};
			console.log('$scope.biller.refInfos', $scope.biller)
			billPaymentRTPService.verifyBillPayment(data_verify_billpayment, function (resultPaybill) {
				var respStatus = resultPaybill.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var data_confirmOTP = {
						resultVerifyBill: resultPaybill.result.value,
						account: $scope.account,
						biller: $scope.biller,
						memo: $scope.memo.txt,
						editScheduleBill: $scope.editScheduleBill,
						recurringType: getRecurringType(),
						recurringTimes: getRecurringTime(),
						scheduleType: getScheduleType(),
						rtpReferenceNo: ($scope.isRTPPayment) ? $scope.biller.rtpreference : undefined,
					};
					billPaymentRTPService.setDataBillpaymentConfirmOTP(data_confirmOTP);
					console.log('test===> 111',data_confirmOTP)
					$state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_CONFIRM.STATE);
				} else {
                    popupService.showErrorPopupMessage('alert.title',respStatus.errorMessage);
				}
			});
		}

		function verifyEditScheduleBillPayment() {
			var custName = mainSession.getSession().firstNameEN + ' ' + mainSession.getSession().lastNameEN;
			var dataFromScheduleEdit = scheduleBillpaymentService.scheduleBillDataDetail;
			var data = {
				fromAccountNumber: $scope.account.myAccountNumber,
				billerId: $scope.biller.billerId,
				promptpayBillerId: $scope.biller.promptPayBillerId,
				categoryId: $scope.biller.categoryId ? $scope.biller.categoryId : '',
				payAmount: parseFloat(generalService.parseNumber($scope.amountModel.amount) || '0.00'),
				effectiveDate: $scope.paymentDate.strDate,
				paymentDate: $scope.paymentDate.strDate,
				msgLanguage: mainSession.lang.toLowerCase(),
				immediateType: getImmediateType(),
				memo: $scope.memo.txt,
				recurringType: getRecurringType(),
				recurringTimes: getRecurringTime(),
				scheduleType: getScheduleType(),
				rtpReferenceNo: undefined,
				reference1: getReferenceValue($scope.biller.refInfos[0]),
				reference2: ($scope.biller.refInfos[1] != null && $scope.biller.refInfos[1].no == '2')?getReferenceValue($scope.biller.refInfos[1]):null,
				reference3: ($scope.biller.refInfos[1] != null && $scope.biller.refInfos[1].no == '3')?getReferenceValue($scope.biller.refInfos[1]):getReferenceValue($scope.biller.refInfos[2]),
				profileCode: $scope.biller.profileCode,
				custName: custName,
				transactionId: dataFromScheduleEdit.transactionID,
				masterTransactionId: dataFromScheduleEdit.masterTransactionID,
				editType: scheduleBillpaymentService.recurringIsOneTime ? '0' : '1',
				barcodeType: ($scope.isScanBiller || $scope.isFromQRScannerPage )?$scope.scanBillerData.barcodeType || '' : '',
				companyCode: $scope.biller.companyCode,
				serviceCode: $scope.biller.serviceCode
			};
			billPaymentRTPService.verifyEditScheduleBillPayment(
				data, function (resultCode, resultObj) {
					if (resultCode === kkconst.success) {
						var data_confirmOTP = {
							resultVerifyBill: resultObj.value,
							account: $scope.account,
							biller: $scope.biller,
							memo: $scope.memo.txt,
							editScheduleBill: $scope.editScheduleBill,
							recurringType: getRecurringType(),
							recurringTimes: getRecurringTime(),
							scheduleType: getScheduleType(),
						};
						billPaymentRTPService.setDataBillpaymentConfirmOTP(data_confirmOTP);
						console.log('test===>',data_confirmOTP)
						$state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_CONFIRM.STATE);
					} else {
						popupService.showErrorPopupMessage('Warning', resultCode);
					}
				}
			);
		}

		$scope.openAccountList = function () {
			$scope.isShowNext = false;
			getAccountsList();
		};

		$scope.openBillerList = function (status) {
			if ($scope.isRTPPayment == false) {
				$scope.isShowNext = false;

				if($scope.isScanBiller){
				} else if($scope.isNewBiller && status === 'reopen'){
					$scope.openSearchBillerModal();
				}else{
					// $scope.isNewBiller;
					getBillersList();
				}
			}
		};

		$scope.selectBiller = function (biller) {
			$scope.biller = biller;
			$scope.isNewBiller = false;
			$scope.selectBillerModal.hide();

            if($scope.biller.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
                checkGoToDonationPage();
            }else {
                inquiryPayInfoOnline($scope.biller);
			}
		};

		$scope.closeBillerListModel = function () {
			$scope.isShowNext = true;
			$scope.selectBillerModal.hide();
		};

		$scope.closeBiller = function () {
			$scope.biller = null;
			$scope.isScanBiller = false;
			$scope.amountModel.amount = '0.00';
			$scope.virtualKeyboardAmount.option.isKeyboardActive = true;
			$scope.isShowNext = true;
		};

		$scope.selectedAccount = function (account) {
			$scope.account = account;
			$scope.accListModal.hide();
		};

		function getReferenceValue(ref) {
			return (ref == undefined) ? undefined : ref.value;
		}

		function recurringListInit() {
			var lang = mainSession.lang.toLowerCase();
			if (lang === kkconst.LANGUAGE_th) {
				$scope.scheduleTypeList = dateService.recurringTypesLangs.th;
				$scope.recurringTimeList = dateService.timeOfRecurringTypesLangs.th;
			} else {
				$scope.scheduleTypeList = dateService.recurringTypesLangs.en;
				$scope.recurringTimeList = dateService.timeOfRecurringTypesLangs.en;
			}
			$scope.selectedScheduleType = $scope.scheduleTypeList[0];
			$scope.selectedRecurringTime = $scope.recurringTimeList[0];
		}

		function getAccountsList() {
			// if ($scope.accountlists.length == 0) {
			myAccountService.inquiryMyAccountCASASummary(function (responseCode, ownAccountGroups) {
				if (responseCode === kkconst.success) {
					$scope.accountlists = sortingAccount(ownAccountGroups);
					$scope.accListModal.show();
				} else {
					popupService.showErrorPopupMessage('alert.title', responseCode);
				}
			});
			// }
		}

		function sortingAccount(request) {
			request.sort(function (a, b) {
				var nameA = a.myAccountAliasName && a.myAccountAliasName.toLowerCase() || '';
				var nameB = b.myAccountAliasName && b.myAccountAliasName.toLowerCase() || '';
				//sort string ascending
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0; //default return value (no sorting)
			});
			return request;
		}
		function searchCategory(categoryList, categoryId) {
            for (var i = 0; i < categoryList.length; i++) {
                if (categoryList[i].categoryId === categoryId) {
                    return true;
                }
            }
            return false;
        }
        function getCategory(accountList) {
            var categoryList = [];
			var isFavourite = false;
			for (var key = 0; key < accountList.length; key++) {
                var account = accountList[key];
                if ((isFavourite == false) && (account.isFavourite === 'Y')) {
                    categoryList.splice(0, 0, { categoryName: window.translationsLabel[mainSession.lang]['label.favourite'] });
                    isFavourite = true;
				}
                // var newCategory = !searchCategory(categoryList, account.categoryId);
                // if (newCategory) {
                //     categoryList.push({
				// 		categoryId: account.categoryId, 
				// 		categoryName: $translate.use() ==='th'? account.categoryTh : account.categoryEn 
				// 	});
                // }
			}
			categoryList.push({
				categoryId: 'id', 
				categoryName: window.translationsLabel[mainSession.lang]['label.header.nameHeaderManagebill']
			});
            return categoryList;
		}
		
		function getBillerListByCategory(category) {
            if (category.categoryName === window.translationsLabel[mainSession.lang]['label.favourite']) {
                return billerlists.filter(function (account) {
                    if (account.isFavourite === 'Y') {
                        return account;
                    }
                });
            } else {
				return billerlists;
                // return billerlists.filter(function (account) {
                //     if (account.categoryId === category.categoryId) {
                //         return account;
                //     }
                // })
            }
		}
		
		var getBillerListInfoIcon = function(){
			for(var j = 0; j < $scope.billerlistsFilter.length; j++) {
				var iconName = downloadAndStoreFile.getBillerIconName(billerlists[j]);
				var iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
				// get logo
				(function(k) {
					downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
						$scope.billerlistsFilter[k]['logoCompany'] = data;
					});
				})(j);
			}
		};

		$scope.onChangeCategory = function (category) {
			$scope.selectedCategory = category;
			$scope.billerlistsFilter = getBillerListByCategory(category);
			getBillerListInfoIcon();
			$ionicScrollDelegate.scrollTop();
        };

		function getBillersList() {
			billPaymentRTPService.getBillersList(function (resultPaybill) {
				var respStatus = resultPaybill.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					billerlists = resultPaybill.result.value;
					if (billerlists.length <= 0) {
						$scope.isShowNoBiller = true;
					}else{
						$scope.billerCategoryList = getCategory(billerlists);
						$scope.selectedCategory = $scope.billerCategoryList[0];
						$scope.billerlistsFilter = getBillerListByCategory($scope.billerCategoryList[0]);
						getBillerListInfoIcon();
					}
					$scope.selectBillerModal.show();
				} else {
					popupService.showErrorPopupMessage('label.warning', respStatus.responseCode);
				}
			});
		}
		function createModal() {
			createAccountListModal();
			createBillerListModal();
			createBillerSearchModal();
			$scope.$on('modal.hidden', function () {
				$scope.isShowNext = true;
			});
		}
		function createAccountListModal() {
			var templateURL = 'templates/BillPaymentRTP/billPaymentRTP-Account-list-modal.html';
			$ionicModal.fromTemplateUrl(templateURL, {
				scope: $scope,
				animation: $scope.modalAnimate
			}).then(function (modal) {
				$scope.accListModal = modal;
			});
		}

		function createBillerListModal() {
			$ionicModal.fromTemplateUrl('templates/BillPaymentRTP/billPaymentRTP-Biller-list-modal.html', {
				scope: $scope,
				animation: $scope.modalAnimate
			}).then(function (modal) {
				$scope.selectBillerModal = modal;
			});
		}

		function createVirtualKeyboardAmount() {
			$scope.virtualKeyboardAmount = {
				option: {
					disableDotButton: false,
					isKeyboardActive: true,
					maxlength: 12,
					IsEditModel: true
				},
				onblur: function () {
					$scope.placeholderAmount = '0.00';
					$scope.amountModel.amount = generalService.onBlurFormatCurrency($scope.amountModel.amount);
				},
				onkeyup: function () {

				},
				onfocus: function () {
					$scope.amountModel.amount = generalService.onFocusClearAmount($scope.amountModel.amount);
					$scope.placeholderAmount = '';
				}
			};
		}

		function validatePayment() {
			if (!$scope.account) {
				popupService.showErrorPopupMessage('label.warning', ' validate.input.selectAccount');
				return false;
			}
			if (isEmpty($scope.amountModel.amount)) {
				popupService.showErrorPopupMessage('label.warning', 'validate.input.enterAmount');
				return false;
			}
			if (isEmpty($scope.amountModel.amount) ||
				($scope.amountModel.amount === 0) ||
				($scope.amountModel.amount === '0') ||
				($scope.amountModel.amount === '0.00')) {
				popupService.showErrorPopupMessage('label.warning', 'validate.input.enterAmount');
				return false;
			}
			if (!$scope.biller) {
				popupService.showErrorPopupMessage('label.warning', 'validate.input.selectBiller');
				return false;
			}

			if($scope.isNewBiller&&isRefInfoEmpty($scope.biller.refInfos)){
				popupService.showErrorPopupMessage('label.warning', 'validate.input.reference');
				return false;
			}

			return true;
		}

		function isRefInfoEmpty(refinfo){
			for (var index = 0; index < refinfo.length; index++) {
				if(refinfo[index].isHideRef) {
					//if hide reference then skip validate
					continue;
				}
				if(isEmpty(refinfo[index].value)){
					return true;
				}
			}

			return false;
		}

		function isEmpty(str) {
			return (!str || 0 === str.length);
		}

		function getBillerInfoIcon(billerInfo){
			var iconName = downloadAndStoreFile.getBillerIconName(billerInfo);
			var iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
			downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
				billerInfo.logoCompany = data;
			});
		}

		function createBillerSearchModal() {
			$ionicModal.fromTemplateUrl('templates/BillPaymentPromptPay/manage-biller-add-search-modal.html', {
				scope: $scope,
				animation: $scope.modalAnimate
			}).then(function (modal) {
				$scope.BillerSearchModal = modal;
			});
		}


		$scope.openSearchBillerModal = function(){
			$scope.isShowNext = false;
			categoriesInit();
			$scope.BillerSearchModal.show();
			watchlistener = $scope.$watch('txtval.biller', function (newval, oldval) {
				if (newval !== oldval && newval !== null && newval !== undefined && newval !== '') {
					$scope.noResult = false;
					getBillerByToken(newval);
				}else if(newval === ''){
					$scope.noResult = false;
					$scope.bpBillerListInfo = createEmptyBillerListByCategory($scope.allCategories);
				}
			});
		};
	
		function getBillerByToken(token){
			manageBillerPromptPayService
				.inquiryBillerByToken(token)
				.then(function(resp){
					var respStatus = resp.result.responseStatus;
					if (respStatus.responseCode === kkconst.success) {
						var result =  resp.result.value.map(function (value){
							var billerNameEn = value.billerNameEn;
							var billerNameTh = value.billerNameTh;
							var qname = ($translate.use() === 'th') ?  billerNameTh: billerNameEn;
							value.qname = qname;
							return value;
						});
						$scope.bpBillerListInfo = mapBillerList(result);
						$scope.noResult = ($scope.bpBillerListInfo.length === 0);
						// getBillerListIcon()
					}
					
				});
		}
	
		function mapBillerList(billerList) {
			if (!billerList) {
				billerList = [];
			}
			var result = billerList
				.reduce(function(prev, item) {
					var find = prev.filter( function (value) {
						return (value.categoryId === item.categoryId);
					});
					if (find.length === 0) {
						var categoryId = item.categoryId;
						var categoryTh = item.categoryTh;
						var categoryEn = item.categoryEn;
						var categoryName = $translate.use() === 'en' ? categoryEn : categoryTh;
						prev.push({ categoryId:categoryId, categoryName:categoryName, expanded: true });
					}
					return prev;
				}, [])
				.map(function (category) {
					return {
						category:category,
						items: billerList.filter( function (value){
							return value.categoryId === category.categoryId;
						})
					};
				});
			return result;
		}
		function toggleCategoryWhenSearchEmpty(categoryId){
			var expand = false;
			//find category for expand/collapse
			for (var index = 0; index < $scope.bpBillerListInfo.length; index++) {
				var value = $scope.bpBillerListInfo[index];
				if((value.category.categoryId === categoryId)&&(value.category.expanded === true)){
					value.category.expanded = !value.category.expanded;
					expand = true;
					break;
				}
			}
			if(expand){
				return;
			}
	
			var category = [];
			category.push(categoryId);
			manageBillerPromptPayService
				.inquiryBillerByTokenAndCategories('',category)
				.then(function(resp){
					var respStatus = resp.result.responseStatus;
					if (respStatus.responseCode === kkconst.success) {
						var items =  resp.result.value;
						
						$scope.bpBillerListInfo = createEmptyBillerListByCategory($scope.allCategories).map(function(item){
							if (item.category.categoryId === categoryId) {
								item.items = items;
								item.category.expanded = true;
							}
							return item;
						});
					}
				});
		}
	
		function toggleCategoryWhenSearchFilled(categoryId){
			//find category for expand/collapse
			for (var index = 0; index < $scope.bpBillerListInfo.length; index++) {
				var value = $scope.bpBillerListInfo[index];
				if(value.category.categoryId === categoryId){
					value.category.expanded = !value.category.expanded;
					break;
				}
			}
		}
		$scope.toggleCategory = function(categoryId){
			if ($scope.txtval.biller === '') {
				toggleCategoryWhenSearchEmpty(categoryId);
			} else {
				toggleCategoryWhenSearchFilled(categoryId);
			}
		};
	
		function createEmptyBillerListByCategory(categories) {
			var emptyBiller = categories.map(function(value) {
				var categoryTh = value.categoryTh;
				var categoryEn = value.categoryEn;
				var categoryName = $translate.use() === 'en' ? categoryEn : categoryTh;
				value.categoryName = categoryName;
				value.expanded = false;
				return {
					category: value,
					items: []
				};
			});
	
			return emptyBiller;
		}
	
		function categoriesInit() {
			$scope.txtval = {biller: ''};
			manageBillerPromptPayService
				.inquiryCategories()
				.then(function(resp){
					var respStatus = resp.result.responseStatus;
					if (respStatus.responseCode === kkconst.success) {
						var result =  resp.result.value.map(function (value){
							value.categoryId = value.categoryCode;
							return value;
						});
						$scope.allCategories = result;
						$scope.bpBillerListInfo = createEmptyBillerListByCategory($scope.allCategories);
					}
				});
		}
		
		$scope.onSelectBillerProfile = function(selectBillerProfile){
			$scope.BillerSearchModal.hide();  
			$scope.billerPayInfo = selectBillerProfile;
			$scope.refInfos = selectBillerProfile.refInfos;
			$scope.txtval = {biller: ''};
			// getBillerPayInfoIcon();
			watchlistener();
			$scope.biller = selectBillerProfile;
			$scope.isNewBiller = true;
            checkGoToDonationPage();
		};
	
		$scope.selectClose = function(){
			$scope.bpBillerListInfo  = [];
			$scope.txtval = {biller: ''};
			$scope.BillerSearchModal.hide();
			watchlistener();
		};

		function inquiryQrcodeBarCodeInfo(data) {
			qrcodeBarcodeInfoService.inquiryDataQrcodeBarCode(data, function(responseStatus, resultObj){
				if(responseStatus.responseCode === kkconst.success){
					$scope.biller = resultObj.value;
					if (resultObj && resultObj.value && resultObj.value.dataFormatType) {
						$scope.biller.barcodeType = resultObj.value.dataFormatType;
						$scope.scanBillerData.barcodeType = resultObj.value.dataFormatType;
					}
					getBillerInfoIcon($scope.biller);
					$scope.amountModel.amount = resultObj.value.amount == null || parseFloat(resultObj.value.amount) == 0 ? '': generalService.formatNumber(parseFloat(resultObj.value.amount));
					// $scope.virtualKeyboardAmount.option.isKeyboardActive = (resultObj.value.amount == null || parseFloat(resultObj.value.amount) == 0) ? true:false;
					$scope.virtualKeyboardAmount.option.isKeyboardActive = resultObj.value.flagAmountFix === 'N';

					$scope.isNewBiller = true;
					$scope.isScanBiller = true;

					//create default ref2
					var ref2None = {
						no: '2',
						value: '',
						textEn: window.translationsLabel['en']['label.referenece2'],
						textTh: window.translationsLabel['th']['label.referenece2'],
						isHideRef: true // for hiding ref2 if null
					};
					//check refInfos length greater than 2 and verify array 1 is ref2 if not add it.
					if ($scope.biller.refInfos.length >= 2) {
						if($scope.biller.refInfos[1].no != '2'){
							$scope.biller.refInfos.splice( 1, 0, ref2None );
						}
					}
					for( var i = 0; i < $scope.biller.refInfos.length ; i++){
						if($scope.biller.refInfos[i].no === '3'){
							$scope.biller.refInfos[i].isHideRef = true;
						}
					}
					checkGoToDonationPage();
				}else {
					popupService.showErrorPopupMessage('label.warning', responseStatus.errorMessage);
				}
			});
		}

		$scope.scanBiller = function(){
			qrcodeBarcodeInfoService.scanBill("QR_CODE,CODE_128").then(function(result){
				$scope.scanBillerData = {
					barcodeType: result.format,
					barcodeInfo: result.text,
					actionCode: 'BILL_PAYMENT'
				};
				inquiryQrcodeBarCodeInfo($scope.scanBillerData);
			});
		};

		function parsePaymentInfoOnline(biller){
			var returnObj = {};
			returnObj.companyCode = biller.companyCode || '';
			returnObj.serviceCode = biller.serviceCode || '';
			returnObj.promptPayBillerId = biller.promptPayBillerId;
			var refInfos = biller.refInfos;
			for(var i=0; i<refInfos.length; i++){
				returnObj['ref'+(i+1)] = refInfos[i].value;	
			}
			return returnObj;
		}

		function inquiryPayInfoOnline(biller) {
			var billerReq = parsePaymentInfoOnline(biller);
			billPaymentRTPService.inquiryPayInfoOnline(billerReq).then(function(resultObj){
				if(resultObj.responseStatus.responseCode === kkconst.success){
					// if(resultObj.value.billAmount <= 0){
					// 	$scope.virtualKeyboardAmount.option.isKeyboardActive = true;
					// } else {
					// 	$scope.virtualKeyboardAmount.option.isKeyboardActive = resultObj.value.flagAmountFix === 'N';
					// }
					//
					// $scope.amountModel.amount = generalService.formatNumber(parseFloat(resultObj.value.billAmount));

					var billAmount = $scope.amountModel.amount;

					if(resultObj.value.billAmount > 0) {
						billAmount = generalService.formatNumber(parseFloat(resultObj.value.billAmount));
					}

					$scope.virtualKeyboardAmount.option.isKeyboardActive = resultObj.value.flagAmountFix === 'N';
					$scope.amountModel.amount = billAmount;

					$scope.biller.companyCode = resultObj.value.companyCode || "";
					$scope.biller.serviceCode = resultObj.value.serviceCode || "";	
				}else {
					popupService.showErrorPopupMessage('label.warning', resultObj.responseStatus.errorMessage);
				}
			});
		}

		// function inquiryPayInfoOnlineForEditSchedule(biller) {
		// 	var billerReq = parsePaymentInfoOnline(biller);
		// 	billPaymentRTPService.inquiryPayInfoOnline(billerReq).then(function(resultObj){
		// 		if(resultObj.responseStatus.responseCode === kkconst.success){
		// 			$scope.virtualKeyboardAmount.option.isKeyboardActive = resultObj.value.flagAmountFix === 'N';
		// 			if(resultObj.value.billAmount != null){
		// 				$scope.amountModel.amount = generalService.formatNumber(parseFloat(resultObj.value.billAmount));
		// 			}
		// 			$scope.biller.companyCode = resultObj.value.companyCode || "";
		// 			$scope.biller.serviceCode = resultObj.value.serviceCode || "";
		// 		}else {
		// 			popupService.showErrorPopupMessage('label.warning', resultObj.responseStatus.errorMessage);
		// 		}
		// 	});
		// }

		function inquiryPayInfoOnlineForBarScan(biller) {
			var billerReq = parsePaymentInfoOnline(biller);
			billPaymentRTPService.inquiryPayInfoOnline(billerReq).then(function(resultObj){
				if(resultObj.responseStatus.responseCode === kkconst.success){
					// var billAmount = resultObj.value.billAmount || 0;
					// var isKeyboardActive = resultObj.value.flagAmountFix ? resultObj.value.flagAmountFix === 'N' : true;

					// if(biller.amount == 0 && resultObj.value.billAmount <= 0){
					// 	isKeyboardActive = true;
					// 	billAmount = 0;
					// } else if (biller.amount > 0 && resultObj.value.billAmount <= 0){
					// 	if(biller.barcodeType == 'Q'){
					// 		isKeyboardActive = false;
					// 	}

					// 	billAmount = biller.amount;
					// }

					// $scope.amountModel.amount = generalService.formatNumber(parseFloat(billAmount));
					// $scope.virtualKeyboardAmount.option.isKeyboardActive = isKeyboardActive;
					
					var billData = scanBillLogic(resultObj, biller);

					$scope.amountModel.amount = generalService.formatNumber(parseFloat(billData.billAmount));
					$scope.virtualKeyboardAmount.option.isKeyboardActive = billData.isKeyboardActive;

// 					// replace biller from qr code to biller object from payinfo
// 					var tempBill = resultObj.value;
// 					tempBill.barcodeType = biller.barcodeType
// 					$scope.biller = tempBill;
// console.log('$scope.biller', $scope.biller)
					$scope.biller.companyCode = resultObj.value.companyCode || "";
					$scope.biller.serviceCode = resultObj.value.serviceCode || "";	
				}else {
					popupService.showErrorPopupMessage('label.warning', resultObj.responseStatus.errorMessage);
				}
			});
		}
		function scanBillLogic(billerOnline, billerScan){
			var billAmount = billerOnline.value.billAmount || 0;
			var isKeyboardActive = billerOnline.value.flagAmountFix ? billerOnline.value.flagAmountFix === 'N' : true;

			if(billerScan.amount == 0 && billerOnline.value.billAmount <= 0){
				isKeyboardActive = true;
				billAmount = 0;
			} else if (billerScan.amount > 0 && billerOnline.value.billAmount <= 0){
				if(billerScan.barcodeType == 'QR_CODE'){
					isKeyboardActive = false;
				}

				billAmount = billerScan.amount;
			} 

			return {
				billAmount: billAmount,
				isKeyboardActive: isKeyboardActive
			};
		}

		function checkGoToDonationPage() {
			console.log('checkGoToDonationPage',$scope.biller);
			//check that service send showRef to front if not set shoRef = true
			for(var i = 0; i <  $scope.biller.refInfos.length; i++) {
				if (typeof $scope.biller.refInfos[i].showRef === 'undefined') {
					$scope.biller.refInfos[i].showRef = true;
				}
			}
            if($scope.biller.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
                eDonationService.setCurrentAmount($scope.amountModel);
                eDonationService.setCurrentAccount($scope.account);
                eDonationService.setIsNewBiller($scope.isNewBiller);
                eDonationService.setIsScanBill($scope.isScanBiller);
                eDonationService.setMemo($scope.memo);
                var billerListDataDatail =  JSON.parse(JSON.stringify($scope.biller));
                manageBillerPromptPayService.setDataBillerDefault(billerListDataDatail);
                $scope.gotoEDonation();
            }
        }

        $scope.getDefaultBillerImage = function(biller) {
            if(biller.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
            	return kkconst.DEFAULT_E_DONATION_ICON;
            }else {
                return $scope.defaultBillerLogo;
			}
		};
	});



