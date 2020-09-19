angular.module('ctrl.notification', [])
	.controller('NotificationCtrl', function ($scope, displayUIService, $translate, $ionicModal, requestToPayInComingService,
		kkconst, $state, notificationService, popupService,notificationSetDetailService, mainSession,historyRTPService ,$sce) {
		$scope.notificationData = [];
		var isMore = false;
		var notificationDataTmp = [];

		$ionicModal.fromTemplateUrl('templates/Notification/notificationModal.html', {
			scope: $scope,
			animation: $scope.modalAnimate
		}).then(function (modal) {
			$scope.viewNotificationModal = modal;
		});

		$ionicModal.fromTemplateUrl('templates/Notification/notificationBillPayDetailModal.html', {
			scope: $scope,
			animation: $scope.modalAnimate
		}).then(function (modal) {
			$scope.viewBillPayDetailModal = modal;
		});

		$ionicModal.fromTemplateUrl('templates/Notification/notificationEDonateDetailModal.html', {
			scope: $scope,
			animation: $scope.modalAnimate
		}).then(function (modal) {
			$scope.viewEDonateDetailModal = modal;
		});

		$ionicModal.fromTemplateUrl('templates/Notification/notificationTransferDetailModal.html', {
			scope: $scope,
			animation: $scope.modalAnimate
		}).then(function (modal) {
			$scope.viewTransferDetailModal = modal;
		});

		$ionicModal.fromTemplateUrl('templates/Notification/notificationRTPModal.html', {
			scope: $scope,
			animation: $scope.modalAnimate
		}).then(function (modal) {
			$scope.viewRTPDetailModal = modal;
		});



		$scope.$on('new-noti', function (event, value) {
			// alert(JSON.stringify(value.value));
			prepareData(value.value);
		});

		var init = function () {
			var params = {
				'currentPage': 0,
				'pageSize': 10
			};

			var NotificationCtrl = this;
			notificationService.getAllNotification(params).then(function (response) {
				resp = response[0];
				maxItems = response[1];
				if (resp !== null && resp.length > 0) {
					$scope.notificationData = resp;
					MapNotiIcon();
					if (resp.length >= params.pageSize) {
						isMore = true;
					}

				} else {
					$scope.notificationData = null;
				}
				checkNotificationBg();
			}, function (error) {

				// popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
		};

		var MapNotiIcon = function () {
			var notificationDataMapIcon = [];
			angular.forEach($scope.notificationData, function (value, key) {
				switch (value.actionType) {
					case 'notification_info':
						$scope.notificationData[key].icon = 'icon-book-open';
						break;
					case 'transfer_result':
						$scope.notificationData[key].icon = 'icon-fund-transfer';
						break;

					case 'payment_result':
						$scope.notificationData[key].icon = 'icon-bill-payment';
						break;
				
					case 'transfer_schedule':
						$scope.notificationData[key].icon = 'icon-schedule';
						break;

					case 'payment_schedule':
						$scope.notificationData[key].icon = 'icon-schedule';
						break;
					case 'rtp_incoming':
						$scope.notificationData[key].icon = 'icon-request-to-pay';
						break;
					case 'notification_detail_by_user':
						$scope.notificationData[key].icon = 'icon-faq';
						break;
					case 'ndid_authen_request':
						$scope.notificationData[key].icon = 'icon-digital-allten';
						break;
					case 'ndid_ial_insufficien':
						$scope.notificationData[key].icon = 'icon-noti_ndid';
						break;
					case 'ndid_not_register':
						$scope.notificationData[key].icon = 'icon-noti_ndid';
						break;
					default:
				}
			});
		}


		var checkNotificationBg = function () {
			if (notificationService.getBackgroundData() != false) {

				backgroundTrigger(notificationService.getBackgroundData().notificationId);
				notificationdecision(notificationService.getBackgroundData());
				notificationService.clearBackgroundData();
			}
		};

		var backgroundTrigger = function (notificationId) {
			var params = {
				'notificationId': notificationId
			};

			if ($scope.notificationData != null && $scope.notificationData.length > 0) {
				angular.forEach($scope.notificationData, function (value, key) {
					if (value.notificationId === notificationId) {
						if ($scope.notificationData[key].isRead !== true) {
							$scope.notificationData[key].isRead = true;

							notificationService.triggerNotification(params).then(function (resp) {

							}, function (error) {
								popupService.showErrorPopupMessage('lable.error', error.errorMessage);
							});

						}
					}
				});
			}
		};

		$scope.curlang = $translate.use().toLowerCase();

		$scope.loadMoreNotification = function () {
			var params = {
				'currentPage': null,
				'pageSize': 10
			};
			isMore = false;

			notificationService.getAllNotification(params).then(function (response) {
	
				resp = response[0];
				if (resp !== null && resp.length > 0) {
					prepareData(resp);
				}

			}, function (error) {
		
				// popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
		};

		$scope.clickNotification = function (id, notiItem) {
		
			if ($scope.notificationData[id].isRead !== true) {
				$scope.notificationData[id].isRead = true;
				var params = {
					'notificationId': $scope.notificationData[id].notificationId
				};
				notificationService.triggerNotification(params).then(function (resp) {
				}, function (error) {
				
					popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
				});
			}
			notificationdecision(notiItem);
		};

		//close all modal
		$scope.selectClose = function () {
			$scope.viewNotificationModal.hide();
			$scope.viewBillPayDetailModal.hide();
			$scope.viewEDonateDetailModal.hide();
			$scope.viewTransferDetailModal.hide();
			$scope.viewRTPDetailModal.hide();
		};

		var notificationdecision = function (notiItem) {

			switch (notiItem.actionType) {
				case 'notification_info':
					notificationInfoDetail(notiItem);
					break;
				case 'transfer_result':

					notificationTransferDetail(notiItem);
					break;

				case 'payment_result':
					notificationBillPayDetail(notiItem);
					break;
			
				case 'transfer_schedule':
					notificationTransferScheduleDetail(notiItem);
					break;

				case 'payment_schedule':
					notificationBillpayScheduleDetail(notiItem);
					break;
				case 'rtp_incoming':
					notificationRTPIncomingInfoDetail(notiItem);
					break;
				case 'notification_detail_by_user':
					notificationInfoDetailByUser(notiItem);
					break;
				case 'ndid_authen_request':
					notificationNDIDAuthen(notiItem);
					break;
				case 'ndid_ial_insufficien':
					notificationNDIDAuthen(notiItem);
					break;
				case 'ndid_not_register':
					notificationNDIDAuthen(notiItem);
					break;
				default:

			}
		};

	var prepareBillPaymentObj = function(data){
		var requestToPayDetail = data;
        var dataRequestPayInfo = {
            promptPayBillerId: requestToPayDetail.requesterIdValue,
            billReference1: requestToPayDetail.billReference1,
            billReference2: requestToPayDetail.billReference2,
        }
        requestToPayInComingService.inquiryPayInfo(dataRequestPayInfo,
            function (response) {
				var respStatus = response.result.responseStatus;
                if (respStatus.responseCode === kkconst.success) {
                    var value = response.result.value;
                    // var refInfos = [
                    //     {
                    //         textEn: window.translationsLabel['en']['label.referenece1'],
                    //         textTh: window.translationsLabel['th']['label.referenece1'],
                    //         value: requestToPayDetail.billReference1
                    //     },
                    //     {
                    //         textEn: window.translationsLabel['en']['label.referenece2'],
                    //         textTh: window.translationsLabel['th']['label.referenece2'],
                    //         value: requestToPayDetail.billReference2
                    //     },
                    // ]
					var refInfos = [];
					for( var i = 0;i < value.refInfos.length; i++){
						var refValue = '';
						var refNo = '';
						switch (i) {
							case 0:
								refValue = requestToPayDetail.billReference1;
								refNo = 1;
								break;
							case 1:
								refValue = requestToPayDetail.billReference2;
								refNo = 2;
								break;
						}
						var currentRef = value.refInfos[i];
						var foRef = {
							"no": refNo,
							"value": refValue ,
							"showRef": currentRef.showRef ,
							"textEn":currentRef.textEn,
							"textTh":currentRef.textTh
						};
						refInfos.push(foRef);
					}
                    $scope.payinfo = {
                        promptPayBillerId : value.promptPayBillerId,
                        profileCode : value.profileCode,
                        billerId : value.promptPayBillerId,
                        companyEn : value.companyEn,
                        companyTh : value.companyTh,
                        subServiceEn : value.subServiceEn,
                        subServiceTh : value.subServiceTh,
                        aliasName : requestToPayDetail.requesterAccountName,
                        refInfos : refInfos,
                        rtpreference : requestToPayDetail.rtpreference,
                        amount:  requestToPayDetail.amount,
						companyCode: value.companyCode || '',
                        serviceCode: value.serviceCode || ''
                    };
                    requestToPayInComingService.setRequestToPayInfo($scope.payinfo);
                    $scope.gotoBillRTP();
                } else {
                    popupService.showErrorPopupMessage('label.warning', respStatus.responseCode);
                }
            }
        )
    };




		var notificationInfoDetail = function(notiItem){
			var params = {
				'actionType': notiItem.actionType,
				'txnId': notiItem.dataType.txnId
			};

			notificationService.getNotiDetail(params).then(function (resp) {
				//deviceUUID found in database
				var respStatus = resp.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var infoMobile = {
						"EN": resp.value.detail.infoMobileEN,
						"TH": resp.value.detail.infoMobileTH
					}
					$scope.termAndCondText = infoMobile[mainSession.lang.toUpperCase()];
					$scope.titleLabel = '';
					$scope.viewNotificationModal.show();

				} else {
					popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
				}

			}, function (error) {
				popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
		};

		var notificationInfoDetailByUser = function(notiItem){
			var params = {
				notificationId : notiItem.dataType.txnId 
			};

			notificationService.getNotificationInfoByUser(params).then(function (response) {
				//deviceUUID found in database
				var respStatus = response.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var infoMobile = {
						"EN": response.data.infoMobileEn,
						"TH": response.data.infoMobileTh
					}
					var titleLabel = {
						"EN": response.data.titleEn,
						"TH": response.data.titleTh
					}
					$scope.termAndCondText = $sce.trustAsHtml(infoMobile[mainSession.lang.toUpperCase()]);
					$scope.titleLabel = titleLabel[mainSession.lang.toUpperCase()];
					$scope.viewNotificationModal.show();

				} else {
					popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
				}

			}, function (error) {
				popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
		};


		var notificationBillpayScheduleDetail = function(notiItem){
			var params = {
				'actionType': notiItem.actionType,
				'txnId': notiItem.dataType.txnId
			};

			notificationService.getNotiDetail(params).then(function (resp) {
				//deviceUUID found in database
				var respStatus = resp.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					notificationSetDetailService.setPaymentScheduleDetail(resp.value.detail);
					$state.go('app.scheduleBillpaymentDetail');		
				} 
				// else {
				// 	popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
				// }

			}, function (error) {
				popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
		};


		var notificationTransferScheduleDetail = function(notiItem){
			

			var params = {
				'actionType': notiItem.actionType,
				'txnId': notiItem.dataType.txnId
			};

			notificationService.getNotiDetail(params).then(function (resp) {
				//deviceUUID found in database
				var respStatus = resp.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					
					notificationSetDetailService.setTransferScheduleDetail(resp.value.detail);
		
					$state.go(kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.STATE);


				} 
				// else {
				// 	popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
				// }

			}, function (error) {
				popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
		
		};


		var notificationBillPayDetail = function (notiItem) {

			var params = {
				'actionType': notiItem.actionType,
				'txnId': notiItem.dataType.txnId
			};

			notificationService.getNotiDetail(params).then(function (resp) {
				//deviceUUID found in database
				var respStatus = resp.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var billPayDetail = resp.value.detail;

					billPayDetail.transactionDate = displayUIService.convertDateTimeForUI(billPayDetail.transactionDate);
					billPayDetail.paymentDate = displayUIService.convertDateNoTimeForUI(billPayDetail.paymentDate);
					$scope.transaction = billPayDetail;
					console.log($scope.transaction)
					if ($scope.transaction.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
                        $scope.viewEDonateDetailModal.show();
					}else {
                        $scope.viewBillPayDetailModal.show();
					}

				} else {
					popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
				}

			}, function (error) {
				popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
		};


		var notificationTransferDetail = function (notiItem) {

			var params = {
				'actionType': notiItem.actionType,
				'txnId': notiItem.dataType.txnId
			};

			notificationService.getNotiDetail(params).then(function (resp) {
				//deviceUUID found in database
				var respStatus = resp.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var transferDetail = resp.value.detail;

					
					transferDetail.transactionDate = displayUIService.convertDateTimeForUI(transferDetail.transactionDate);
					transferDetail.paymentDate = displayUIService.convertDateNoTimeForUI(transferDetail.paymentDate);
					transferDetail.creditDate = displayUIService.convertDateNoTimeForUI(transferDetail.creditDate);
					transferDetail.debitDate = displayUIService.convertDateNoTimeForUI(transferDetail.debitDate);
		
					$scope.transaction = transferDetail;
					$scope.viewTransferDetailModal.show();
				} else {
					popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
				}

			}, function (error) {
				popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
		};

		var notificationRTPIncomingInfoDetail = function(notiItem){
			notificationService.getRTPIncomingNotiDetail(notiItem).then(function (resp) {
				var respStatus = resp.responseStatus;
				
				if (respStatus.responseCode === kkconst.success) {
					verifyRTPIncomingObj(resp);
				} else {
					popupService.showErrorPopupMessage('lable.error', respStatus.errorMessage);
				}

			}, function (error) {
				popupService.showErrorPopupMessage('lable.error', error.errorMessage);
			});
		};

		$scope.moreDataCanBeLoaded = function () {
			return isMore;
		};

		var verifyRTPIncomingObj = function (resp) {
			var RTPIncomingData = resp.value.rtpInfoDetailList[0];
			if(RTPIncomingData.status === 'UNPAID'){	
				switch (RTPIncomingData.requesterIdType) {
					case "BILLERID":
						prepareBillPaymentObj(RTPIncomingData);
						break;
					default: 
						requestToPayInComingService.setRequestToPayDetail(RTPIncomingData);
						$scope.gotoFund();
						break;
				}
			}else{
				
				RTPIncomingData[0] = historyRTPService.setTime(resp.value.rtpInfoDetailList);
				
				$scope.transaction = RTPIncomingData;
				$scope.viewRTPDetailModal.show();
			}
		}

		var prepareData = function (resp) {

			notificationDataTmp = [];
			$scope.notificationData = [];

			angular.forEach(resp, function (value, key) {

				if (angular.isUndefined(notificationDataTmp[value.notificationId])) {
					value.icon = {};
					value.icon.bg = getNotificationIcons(value.typeIcon).bg;
					value.icon.icons = getNotificationIcons(value.typeIcon).icons;



					$scope.notificationData.push(value);
					notificationDataTmp[value.notificationId] = value;


					//$scope.$apply();
					// 	$scope.$apply(function() {
					// });
				}

			});
			isMore = true;
			MapNotiIcon();
		};


		var getNotificationIcons = function (type_icon) {

			var iconsList = {
				"upcoming": {
					'bg': "label label-sm label-icon label-info",
					'icons': "fa fa-calendar-o"
				},
				"fail": {
					'bg': "label label-sm label-icon label-danger",
					'icons': "fa fa-close"
				},
				"success": {
					'bg': "label label-sm label-icon label-success",
					'icons': "fa fa-check"
				},
				"notice": {
					'bg': "label label-sm label-icon label-warning",
					'icons': "fa fa-bullhorn"
				},
				"default": {
					'bg': "label label-sm label-icon label-success",
					'icons': "fa fa-check"
				}
			};

			if (iconsList[type_icon] === undefined) {
				return iconsList["default"];

			}

			return iconsList[type_icon];
		};

		function getDefaultLabel(index) {
			switch (index) {
				case '1':
					return window.translationsLabel[$translate.use()]['label.history.bill.ref1'];
					break;
				case '2':
					return window.translationsLabel[$translate.use()]['label.history.bill.ref2'];
					break;
				case '3':
					return window.translationsLabel[$translate.use()]['label.history.bill.ref3'];
					break;
			}
		}

		$scope.displayRefName = function (ref) {
			var billRef = ref;
			if (billRef.no == 2  && $scope.transaction.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
				return window.translationsLabel[$translate.use()]['label.history.edonation.ref2'];
			}
			var label = (mainSession.lang === 'en') ? billRef.textEn : billRef.textTh;
			return (label) ? label : getDefaultLabel(billRef.no);
		};

		var notificationNDIDAuthen = function(notiItem){
			$scope.gotoNDIDAuthenPage();
		};

		init();
	});
