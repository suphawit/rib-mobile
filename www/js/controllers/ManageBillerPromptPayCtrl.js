angular.module('ctrl.manageBillerPromptPayCtrl', [])
.controller('ManageBillerPromptPayCtrl', function($scope,$ionicHistory,$ionicScrollDelegate,$ionicModal,$state,invokeService,billPaymentService,BankCodesImgService,popupService ,kkconst,mainSession,manageBillerPromptPayService,$translate,$ionicListDelegate,downloadAndStoreFile,$timeout) {
		$scope.cataegorySelected = {};
		$scope.accountCategoryList = {};
		$scope.billerListInfo = {};
		$scope.billerListInfoDetail = {};
		$scope.isNotDataShow = false;
		$scope.selection = null; 
		// $scope.lang = {};
		$scope.lang  =  $translate.use();
		var lang =  $translate.use();
		var fovoriteList = []; 
		var billerResult = [];
		var catagoryList = [];
		var catagorySort;
		var favoriteFact;

		$scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
		
		var getBillerListInfoIcon = function(){
			for(var j = 0; j < $scope.billerListInfo.length; j++) {
				iconName = downloadAndStoreFile.getBillerIconName($scope.billerListInfo[j]);
				iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
				// get logo
				(function(k) {
					downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
						$scope.billerListInfo[k]['logoCompany'] = data;
					});
				})(j);
			}
		};

		$scope.showDetails = function() {
				$state.go(kkconst.ROUNTING.BILLER_DETAIL_PROMPTPAY.STATE);
		};
      
		$scope.addBiller = function() {
				$state.go(kkconst.ROUNTING.ADD_BILLER_PROMPTPAY.STATE);
		};

		$scope.navigateToManageBillPay = function() {
				$state.go(kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE);
		};


	$scope.deleteBillPayment = function(biller){
			
			manageBillerPromptPayService.setBillerEditConfirm(biller);							 
			popupService.showConfirmPopupMessageCallback('label.confirmDeleteBiller','label.deleteBiller.warning',function(ok){
			if(ok){
					manageBillerPromptPayService.deleteBillpayment(function(resultPaydelete){
					var respStatus = resultPaydelete.result.responseStatus;
					if (respStatus.responseCode === kkconst.success) {
						$scope.bpBillerListDelete = resultPaydelete.result.value;
						$ionicListDelegate.closeOptionButtons(); 
						popupService.showErrorPopupMessage('label.success','label.DeleteBiller.warning.success');
						$scope.getBillerlist();
					} 
					else {
						popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
						$ionicListDelegate.closeOptionButtons();
					}
				});
			}else
				{$ionicListDelegate.closeOptionButtons();}
			});	
		};
		


		$scope.getBillerlist = function(){
				$scope.billerListInfo = '';
				$scope.selection = "default";
				$scope.previousIndex = null;
				catagorySort = [];
				manageBillerPromptPayService.getBillerlistInfo(function(resultbillerListInfo){
				var respStatus = resultbillerListInfo.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
						billerResult = resultbillerListInfo.result.value;
						if( (billerResult.length !== 0) ){
							for(var i = 0; i < billerResult.length; i++)
							{
								for(var j = 0; j < catagorySort.length; j++)
								{
									if(billerResult[i].categoryId == catagorySort[j].categoryId) 
											break;
								}
								if(j == catagorySort.length){
										catagorySort.push(billerResult[i]);
								}
							}
								isFavorite();

						}else{
								$scope.isNotDataShow = true;
								
						}
				}else {
						popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
				}

			});
		}
	    
	

		function isFavorite(){
			fovoriteList.length = 0;
			for(var j = 0; j< billerResult.length ; j++ ){
				if(billerResult[j].isFavourite == "Y"){
					fovoriteList.push(billerResult[j]);
				}	
			}
			getCatagory();
				
		}

		
		function getCatagory(){

				var catagoryFormat  = [];
				$scope.billerListInfo = '';
			    $scope.accountCategoryList  = '';
				catagoryList.length = 0;
				
				if((fovoriteList == '') || (fovoriteList == undefined)){
						$scope.accountCategoryList = getCatagoryList();
						$scope.cataegorySelected = 	$scope.accountCategoryList[0];
						$scope.showDataCategory(  $scope.cataegorySelected.categoryId,$scope.cataegorySelected.categoryName);
				}else{
						catagoryList.push({"categoryId": "000","categoryName":  window.translationsLabel[mainSession.lang]['label.favourite']}) 
						$scope.accountCategoryList  =  getCatagoryList();
						$scope.cataegorySelected = $scope.accountCategoryList[0];
						$scope.showDataCategory(  $scope.cataegorySelected.categoryId,$scope.cataegorySelected.categoryName);
				}	
				
		}
		
	
	
		function getCatagoryList() {

				for(var i = 0; i< catagorySort.length; i++){
						lang == 'th' ?	 catagoryFormat = {"categoryId": catagorySort[i].categoryId,"categoryName": catagorySort[i].categoryTh} : catagoryFormat = {"categoryId": catagorySort[i].categoryId,"categoryName": catagorySort[i].categoryEn};
						catagoryList.push(catagoryFormat);
				}
				return catagoryList	
				
		};



		$scope.showDataCategory = function(categoryID, category) { 
			var catagoryResult = [];
			$scope.billerListInfo = '';
			$scope.cataegorySelected = { categoryId: categoryID,categoryName: category};	
			if(categoryID === "000"){
			
				for(var j = 0; j< billerResult.length ; j++){
					if((billerResult[j].isFavourite == "Y")){
						catagoryResult.push(billerResult[j]);
					}
				}
				$scope.billerListInfo = catagoryResult;
			}else{
				for(var j = 0; j< billerResult.length ; j++){
					if((billerResult[j].categoryId == categoryID)){
						catagoryResult.push(billerResult[j]);
					}
				}
					$scope.billerListInfo = catagoryResult;
			}

			// add biller icon
			getBillerListInfoIcon();
			$ionicScrollDelegate.scrollTop();
		};
	
	$scope.getBillerlist();
		
	
	$scope.nevigateToEdit = function(bpBiller) {
			manageBillerPromptPayService.setBillerDetail(bpBiller);
			$state.go(kkconst.ROUNTING.EDIT_BILLER_PROMPTPAY.STATE);
	};


	$scope.showDetailPage = function(bpBiller) {
		
		manageBillerPromptPayService.setBillerDetail(bpBiller);
		$state.go(kkconst.ROUNTING.BILLER_DETAIL_PROMPTPAY.STATE);
	
	};

    $scope.getDefaultBillerImage = function(biller) {
        if(biller.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
            return kkconst.DEFAULT_E_DONATION_ICON;
        }else {
            return $scope.defaultBillerLogo;
        }
    };
})


.controller('billerDetailPromptPayCtrl', function($scope,$translate,$ionicHistory,$ionicModal,$state,invokeService,billPaymentService,BankCodesImgService,popupService ,kkconst,manageBillerPromptPayService, downloadAndStoreFile) {
	 var getBillerListDetailIcon = function(){
		var iconName = downloadAndStoreFile.getBillerIconName($scope.billerListDetail);
		var iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
		// get logo
		downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
			$scope.billerListDetail['logoCompany'] = data;
		
		});
	};
	 
	 $scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
	 $scope.lang = $translate.use();
     // $scope.billerListDetail = {};
	 $scope.billerListDetail =  manageBillerPromptPayService.getBillerDetail();
	 $scope.refInfos = $scope.billerListDetail.refInfos;
	 if ($scope.billerListDetail.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
         $scope.refInfos = [$scope.billerListDetail.refInfos[0]]; // if e-donation show only ref 1
	 }
	 getBillerListDetailIcon();

	 $scope.editBiller = function() {
		 $state.go(kkconst.ROUNTING.EDIT_BILLER_PROMPTPAY.STATE);

    };

	 $scope.showSchduleButton = function() {
         return $scope.billerListDetail.categoryId != kkconst.E_DONATE_CATEGORY_ID
	 };


	$scope.navigateToManageBillPay = function() {
		$state.go(kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE);
	};


	$scope.gotoBillpayment = function() {
		$ionicHistory.clearCache().then(function () {
            var billerListDataDatail =  JSON.parse(JSON.stringify($scope.billerListDetail));
            manageBillerPromptPayService.setDataBillerDefault(billerListDataDatail);
			if (billerListDataDatail.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
                $state.go(kkconst.ROUNTING.BILL_E_DONATION.STATE);
			} else {
                $state.go(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE);
			}
		});
	};

	$scope.gotoSchedule = function() {
			$scope.changeScheduleTabShow("billPayment");
			$state.go(kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.STATE);
	};


	$scope.manageFavourite = function(){
		
			if($scope.billerListDetail.isFavourite === 'Y') {
					$scope.billerListDetail.isFavourite = 'N';
			} else {
					$scope.billerListDetail.isFavourite = 'Y';
			}
			manageBillerPromptPayService.updateFavoriteAccount($scope.billerListDetail, function(resultObj){
				var respStatus = resultObj.result.responseStatus;
					if (respStatus.responseCode === kkconst.success) {
						favoriteFact = true;
					}else {
						popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
					}
				
			});
	};

	
	$scope.isFavouriteStyleClass = function(isFav) {		
		
			return isFav === 'Y' ? 'blackTextColor' : 'whiteTextColor';
	};
	$scope.isEDonationCategory = function() {
			return $scope.billerListDetail.categoryId == kkconst.E_DONATE_CATEGORY_ID;
	};

    $scope.getDefaultBillerImage = function(biller) {
        if(biller.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
            return kkconst.DEFAULT_E_DONATION_ICON;
        }else {
            return $scope.defaultBillerLogo;
        }
    };
	
})


.controller('AddBillerPromptPayCtrl', function($scope,$ionicHistory,$ionicModal,$state,invokeService,billPaymentRTPService,billPaymentService,BankCodesImgService,popupService ,kkconst,$timeout,manageBillerPromptPayService, $translate, downloadAndStoreFile, qrcodeBarcodeInfoService) {

	$scope.isSearch  = false;
	$scope.checked   = true;
	$scope.checkedBack   = false;
	$scope.showBillerButton = true;
	// $scope.lang = {};
	$scope.txtval = {biller: ''};
	$scope.billerRefNum  = {};
	$scope.billerPayInfo  = {};
	$scope.billerPayInfoVerify  = {};
	$scope.billerPayInfotoConfirm = {};
	$scope.billerCatagory  = [];
	$scope.refInfos = {};
  	$scope.lang = $translate.use();
	var factIsBack =  false;
	factIsBack = manageBillerPromptPayService.getFactIsBack();
	$scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
	$scope.bpBillerListInfo = [];
	$scope.noResult = false;
	$scope.allCategories = [];
	var watchlistener;
	$scope.searchplaceholder = window.translationsLabel[$translate.use()]['label.searchplaceholder'];
	$scope.isBillerScan = false;
	$scope.isFromAddNewAfterPayBill = false;
	viewInitial();

	function viewInitial() {
		historyPageInit();
	}
	
	function historyPageInit() {
		//check state from page
		var history = $ionicHistory.viewHistory();
		if (history.backView != null) {
			switch (history.backView.stateName) {
				case kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_RESULT.STATE:
					fromBillpaymentResultPage()
					break;
				case kkconst.ROUNTING.BILL_E_DONATION_RESULT.STATE:
					fromBillpaymentResultPage()
					break;
				default:
					break;
			}
		}
	}

	function fromBillpaymentResultPage(){
		var dataBillConfirmOTP = billPaymentRTPService.getDataBillpaymentConfirmOTP();
		var biller = dataBillConfirmOTP.biller;
		console.log('fromBillpaymentResultPage',billPaymentRTPService.getDataBillpaymentConfirmOTP())
		var ref = {};	
		$scope.showBillerButton = false;
		$scope.checked = false;
		$scope.billerPayInfo = biller;
		$scope.isRequireOtp = dataBillConfirmOTP.resultVerifyBill.requireOTP;
		console.log('dataBillConfirmOTP fromBillpaymentResultPage', dataBillConfirmOTP);
		console.log('$scope.isRequireOtp fromBillpaymentResultPage', dataBillConfirmOTP.resultVerifyBill.requireOTP);
		manageBillerPromptPayService.setFactIsBack(false);
	    $scope.billerPayInfoVerify.billerAliasName = '';
		$scope.refInfos = $scope.billerPayInfo.refInfos;
		//show only ref 1 if category type == 26
		for( var i = 0; i < $scope.refInfos.length ; i++){
			$scope.billerRefNum[i] = $scope.refInfos[i].value;
			if(isEDonationCategory()) {
                switch (i) {
                    case 0:
                        $scope.refInfos[i].isHideRef = false;
                        break;
                    case 1:
                        $scope.refInfos[i].isHideRef = true;
                        $scope.refInfos[i].value = '0';
                        $scope.billerRefNum[i] = '0';
                        break;
                    default:
                        $scope.refInfos[i].isHideRef = true;
                }
			}else {
                $scope.refInfos[i].isHideRef = false;
			}
		}

		$scope.isFromAddNewAfterPayBill = $scope.isRequireOtp != false;
	}

	var getBillerListIcon = function(){
		var iconUrl;
		var iconName;
		for (var i = 0; i < $scope.bpBillerListInfo.length; i++) {
			var categories = $scope.bpBillerListInfo[i];
			for(var j=0; j< categories.items.length; j++){
				$scope.bpBillerListInfo[i].items[j]['logoCompany'] = '';

				// mock data
				iconName = downloadAndStoreFile.getBillerIconName($scope.bpBillerListInfo[i].items[j]);
				iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
				// get logo
				(function(k,l) {
					downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
						$scope.bpBillerListInfo[k].items[l]['logoCompany'] = data;
					});
				})(i,j);
			}
		}
	};
	var getBillerPayInfoIcon = function(){
		var iconName = downloadAndStoreFile.getBillerIconName($scope.billerPayInfo);
		var iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
		// get logo
		downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
			$scope.billerPayInfo['logoCompany'] = data;
			
		});
	};

	function isEmpty(str) {
		return (!str || 0 === str.length);
	}
	
	$scope.showIsSearch = function() {
		$scope.isSearch  = true;
	};

	$scope.navigateToManageBillPay = function() {
		
		$state.go(kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE);
	};
	
	$scope.gotoBillPayList = function() {
		$state.go(kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE);
	};


	if( factIsBack == true){
		
		var ref = {};	
		$scope.showBillerButton = false;
		$scope.checked = false;
		$scope.billerPayInfo = manageBillerPromptPayService.getBillerPayInfoVerify();
		manageBillerPromptPayService.setFactIsBack(false);
	    $scope.billerPayInfoVerify.billerAliasName = $scope.billerPayInfo.billerAliasName;
		$scope.refInfos = $scope.billerPayInfo.refInfos
		for( var i = 0; i < $scope.refInfos.length ; i++){
			$scope.billerRefNum[i] = $scope.refInfos[i].value;
            if(isEDonationCategory()) {
                switch (i) {
                    case 0:
                        $scope.refInfos[i].isHideRef = false;
                        break;
                    case 1:
                        $scope.refInfos[i].isHideRef = true;
                        $scope.refInfos[i].value = '0';
                        $scope.billerRefNum[i] = '0';
                        break;
                    default:
                        $scope.refInfos[i].isHideRef = true;
                }
            }else {
                $scope.refInfos[i].isHideRef = false;
            }
		}
	}

	$ionicModal.fromTemplateUrl('templates/BillPaymentPromptPay/manage-biller-add-search-modal.html', {
		scope: $scope,
		animation: $scope.modalAnimate
	}).then(function(modal) {
		$scope.billerListModal = modal;
	});
	$scope.$on('modal.hidden', function() {
		$scope.checkedBack = false;
		$scope.checked = false;
	});
	
		    
	$scope.searchBiller = function(){
		$scope.checkedBack = true;
		categoriesInit();
		$scope.billerListModal.show();
		watchlistener = $scope.$watch('txtval.biller', function (newval, oldval) {
			if (newval !== oldval && newval !== null && newval !== undefined && newval !== '') {
				$scope.noResult = false;
				getBillerByToken(newval)
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
						const billerNameEn = value.billerNameEn;
						const billerNameTh = value.billerNameTh;
						const qname = ($translate.use() === 'th') ?  billerNameTh: billerNameEn;
						value.qname = qname;
						return value
					})
					$scope.bpBillerListInfo = mapBillerList(result);
					$scope.noResult = ($scope.bpBillerListInfo.length === 0);
					// getBillerListIcon()
				}
				
			})
	}

	function mapBillerList(billerList) {
        if (!billerList) {
            billerList = [];
        }
        var result = billerList
            .reduce(function(prev, item) {
                var find = prev.filter( function (value) {
					return (value.categoryId === item.categoryId);
				})
                if (find.length === 0) {
					var categoryId = item.categoryId;
					var categoryTh = item.categoryTh;
					var categoryEn = item.categoryEn;
                    var categoryName = $translate.use() === 'en' ? categoryEn : categoryTh;
                    prev.push({ categoryId:categoryId, categoryName:categoryName, expanded: true })
                }
                return prev;
            }, [])
            .map(function (category) {
                return {
                    category:category,
                    items: billerList.filter( function (value){
                        return value.categoryId === category.categoryId;
                    })
                }
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
			})
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
	}

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
            }
        })

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
						return value
					})
					$scope.allCategories = result;
					$scope.bpBillerListInfo = createEmptyBillerListByCategory($scope.allCategories)
				}
			})
	}

	$scope.onSelectBillerProfile = function(selectBillerProfile){
		$scope.billerListModal.hide();  
		$scope.showBillerButton = false;
		$scope.billerPayInfo = selectBillerProfile;
		$scope.refInfos = selectBillerProfile.refInfos;

        for( var i = 0; i < $scope.refInfos.length ; i++){
            if(isEDonationCategory()) {
                switch (i) {
                    case 0:
                        $scope.refInfos[i].isHideRef = false;
                        break;
                    case 1:
                        $scope.refInfos[i].isHideRef = true;
                        $scope.refInfos[i].value = '0';
                        $scope.billerRefNum[i] = '0';
                        break;
                    default:
                        $scope.refInfos[i].isHideRef = true;
                }
            }else {
                $scope.refInfos[i].isHideRef = false;
            }
        }
		$scope.checkedBack = false;
		$scope.txtval = {biller: ''};
		getBillerPayInfoIcon();
		watchlistener();
	}

    function isEDonationCategory() {
        return $scope.billerPayInfo.categoryId == kkconst.E_DONATE_CATEGORY_ID;
    }

	$scope.selectClose = function(){
		$scope.checkedBack = false;
		$scope.bpBillerListInfo  = [];
		$scope.txtval = {biller: ''};
		$scope.billerListModal.hide();
		watchlistener();
		
	};


	$scope.selectBillerPayInfoAdd = function(biller){
		
			$scope.billerListModal.hide();  
			$scope.showBillerButton = false;
			manageBillerPromptPayService.setbillerListPayInfo(biller);
			manageBillerPromptPayService.getBillerPayInfoProfileDetail(function(resultPaybillInfo){
				var respStatus = resultPaybillInfo.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					$scope.billerPayInfo = resultPaybillInfo.result.value;
					$scope.refInfos = $scope.billerPayInfo.refInfos;

                    for( var i = 0; i < $scope.refInfos.length ; i++){
                        if(isEDonationCategory()) {
                            switch (i) {
                                case 0:
                                    $scope.refInfos[i].isHideRef = false;
                                    break;
                                case 1:
                                    $scope.refInfos[i].isHideRef = true;
                                    $scope.refInfos[i].value = '0';
                                    $scope.billerRefNum[i] = '0';
                                    break;
                                default:
                                    $scope.refInfos[i].isHideRef = true;
                            }
                        }else {
                            $scope.refInfos[i].isHideRef = false;
                        }
                    }
					$scope.checked = false;
					
					getBillerPayInfoIcon();
				}else {
					
					popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
					$scope.showBillerButton = true;
				}
					$scope.checkedBack = false;
		});

	}

		
	$scope.submitVerifyPayInfo = function() {
		
		var ref = {};
		var ref = $scope.refInfos 
		var refInfoList;
		refInfoList = $scope.billerRefNum;
				
		if(isEmpty($scope.billerPayInfoVerify.billerAliasName)){
			popupService.showErrorPopupMessage('label.warning','validate.input.aliasName');
		}else if( typeof  refInfoList != 'undefined'){
						 
			if( refInfoList !== '' ||  refInfoList != undefined){
				for( var i = 0; i< ref.length ; i++ ){
					var lang = $translate.use();
					if((refInfoList[i] == null || refInfoList[i] == '' ||  refInfoList[i] == undefined) && !ref[i].isHideRef){
						var textAlert =  window.translationsLabel[lang]['validate.input'];
						lang == 'th' ?	 textAlert  =  textAlert + ref[i].textTh :  textAlert  =  textAlert + ref[i].textEn;
						popupService.showErrorPopupMessage('label.warning',textAlert);
					}
				}
				var count = 0;
				for(refIndex in  refInfoList){
					if(!isEmpty(refInfoList[refIndex]) ){
						count = count +1;
					}
				}
				if( ref.length == count){
					$scope.billerPayInfo.billerAliasName = $scope.billerPayInfoVerify.billerAliasName;
                    if(isEDonationCategory()) {
                        $scope.billerRefNum[1] = 0; //set default to ref2 if e-donation type
					}
					$scope.billerPayInfo.ref = $scope.billerRefNum;	   
					manageBillerPromptPayService.setBillerPayInfoVerify($scope.billerPayInfo);
					manageBillerPromptPayService.verifyBillerPayInfo(function(resultPayInfoConfirm){
          
						var respStatus = resultPayInfoConfirm.result.responseStatus;
						if (respStatus.responseCode === kkconst.success) {
								var resultVerifyAddBiller = resultPayInfoConfirm.result.value;
								resultVerifyAddBiller.billerAliasName = $scope.billerPayInfoVerify.billerAliasName;
								resultVerifyAddBiller.ref = $scope.billerRefNum;
								resultVerifyAddBiller.isRequireOtp = $scope.isRequireOtp;
								resultVerifyAddBiller.isFromAddNewAfterPayBill = $scope.isFromAddNewAfterPayBill;
								// if ($scope.isRequireOtp == false) {
								// 	resultVerifyAddBiller.isFromAddNewAfterPayBill = false;
								// }
console.log('$scope.isRequireOtp', $scope.isRequireOtp);
console.log('$scope.isFromAddNewAfterPayBill', $scope.isFromAddNewAfterPayBill);
console.log('resultVerifyAddBiller', resultVerifyAddBiller);
								$state.go(kkconst.ROUNTING.ADD_BILLER_CONFIRM_PROMPTPAY.STATE);
								manageBillerPromptPayService.setBillerPayInfoVerify(resultVerifyAddBiller);
						}else {
								popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
						}
					});
				} 		
			 }
		}else if( (refInfoList == null) || (refInfoList == '')){
			var lang = $translate.use();
			var textAlert =  window.translationsLabel[lang]['validate.input'];
			lang == 'th' ?	 textAlert  =  textAlert + ref[i].textTh :  textAlert  =  textAlert + ref[i].textEn;
			popupService.showErrorPopupMessage('label.warning',textAlert);
		}
	};
		
	$scope.virtualKeyboardRefer = {
		option: {
			disableDotButton: true,
			isKeyboardActive: true,
			maxlength: 20
		}
	};
	
	function inquiryQrcodeBarCodeInfo(data) {
		qrcodeBarcodeInfoService.inquiryQrcodeBarCodeInfoForAdd(data, function(responseStatus, resultObj){
			if(responseStatus.responseCode === kkconst.success){
				$scope.showBillerButton = false;
				$scope.billerPayInfo = resultObj.value;
				$scope.refInfos = resultObj.value.refInfos;
				$scope.checkedBack = false;
				$scope.txtval = {biller: ''};
				$scope.checked = false;
				$scope.isBillerScan = true;
				getBillerPayInfoIcon();

                for( var i = 0; i < $scope.refInfos.length ; i++){
                    $scope.billerRefNum[i] = $scope.refInfos[i].value;
                    if(isEDonationCategory()) {
                        switch (i) {
                            case 0:
                                $scope.refInfos[i].isHideRef = false;
                                break;
                            case 1:
                                $scope.refInfos[i].isHideRef = true;
                                $scope.refInfos[i].value = '0';
                                $scope.billerRefNum[i] = '0';
                                break;
                            default:
                                $scope.refInfos[i].isHideRef = true;
                        }
                    }else {
                        $scope.refInfos[i].isHideRef = false;
                    }
                }
			}else {
				popupService.showErrorPopupMessage('label.warning', responseStatus.errorMessage);
			}
		})
	}

	$scope.scanBiller = function(){
		qrcodeBarcodeInfoService.scanBill("QR_CODE,CODE_128").then(function(scanText){
			data = {
				barcodeType: scanText.format,
				barcodeInfo: scanText.text
			} 
			inquiryQrcodeBarCodeInfo(data);
		});
	};

	$scope.closeBiller = function() {
		$scope.showBillerButton = true;
		$scope.checked = true;
		$scope.isBillerScan = false;

        for( var i = 0; i < $scope.refInfos.length ; i++){
            $scope.billerRefNum[i] = '';
            if(isEDonationCategory()) {
                switch (i) {
                    case 0:
                        $scope.refInfos[i].isHideRef = false;
                        break;
                    case 1:
                        $scope.refInfos[i].isHideRef = true;
                        $scope.refInfos[i].value = '0';
                        $scope.billerRefNum[i] = '0';
                        break;
                    default:
                        $scope.refInfos[i].isHideRef = true;
                }
            }else {
                $scope.refInfos[i].isHideRef = false;
            }
        }
	}

    $scope.getDefaultBillerImage = function(biller) {
        if(biller.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
            return kkconst.DEFAULT_E_DONATION_ICON;
        }else {
            return $scope.defaultBillerLogo;
        }
    };
})



 .controller('AddBillerConfirmPromptPayCtrl', function($scope,invokeService,billPaymentService, $state,popupService, kkconst,$ionicHistory,manageBillerPromptPayService, $translate, downloadAndStoreFile,$timeout) {
	 var getPayInfoModelConfirmIcon = function(){
		var iconName = downloadAndStoreFile.getBillerIconName($scope.billerPayInfoConfirm);
		var iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
		// get logo
		downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
			$scope.payInfoModelConfirm['logoCompany'] = data;
		
		});
	};

	$scope.checked = true;
	$scope.lang = $translate.use();
	// $scope.billerPayInfoConfirm = {};
	$scope.payInfoModelConfirm = {};
	$scope.resultOTP = {};
	$scope.refInfos = {};
	
	$scope.billerPayInfoConfirm =  manageBillerPromptPayService.getBillerPayInfoVerify();
	console.log('$scope.billerPayInfoConfirm AddBillerConfirmPromptPayCtrl', $scope.billerPayInfoConfirm );
	$scope.isRequireOtp = $scope.billerPayInfoConfirm.isRequireOtp || true;
	$scope.payInfoModelConfirm.billerAliasName = $scope.billerPayInfoConfirm.aliasName;
	$scope.payInfoModelConfirm.refInfos = $scope.billerPayInfoConfirm.refInfos;
	$scope.refInfos = $scope.billerPayInfoConfirm.refInfos;

     for( var i = 0; i < $scope.refInfos.length ; i++){
         if(isEDonationCategory()) {
             switch (i) {
                 case 0:
                     $scope.refInfos[i].isHideRef = false;
                     break;
                 case 1:
                     $scope.refInfos[i].isHideRef = true;
                     $scope.refInfos[i].value = '0';
                     break;
                 default:
                     $scope.refInfos[i].isHideRef = true;
             }
         }else {
             $scope.refInfos[i].isHideRef = false;
         }
     }
	$scope.payInfoModelConfirm.companyTh = $scope.billerPayInfoConfirm.companyTh;
	$scope.payInfoModelConfirm.companyEn = $scope.billerPayInfoConfirm.companyEn;
	$scope.payInfoModelConfirm.subServiceEn = $scope.billerPayInfoConfirm.subServiceEn;
	$scope.payInfoModelConfirm.subServiceTh = $scope.billerPayInfoConfirm.subServiceTh;
	$scope.payInfoModelConfirm.categoryEn =$scope.billerPayInfoConfirm.categoryEn;
	$scope.payInfoModelConfirm.categoryTh =$scope.billerPayInfoConfirm.categoryTh;
	$scope.payInfoModelConfirm.billerNameTh = $scope.billerPayInfoConfirm.billerNameTh;
	$scope.payInfoModelConfirm.billerNameEn = $scope.billerPayInfoConfirm.billerNameEn;
	$scope.payInfoModelConfirm.isFromAddNewAfterPayBill = $scope.billerPayInfoConfirm.isFromAddNewAfterPayBill;

	$scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;

	getPayInfoModelConfirmIcon();

	function isEmpty(str) {
		return (!str || 0 === str.length);
	}	


	$scope.requestOTP = function(){
			$scope.resultOTP.otp = null;
			manageBillerPromptPayService.addBillerGetRequestOTP(function(resultPaybill){
				var respStatus = resultPaybill.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
	            	$scope.resultOTP = resultPaybill.result.value;
	            	$scope.resultOTP.referenceNo = resultPaybill.result.value.referenceNo;
	            	$scope.resultOTP.tokenOTPForCAA = resultPaybill.result.value.tokenOTPForCAA;
	            	$scope.resultOTP.mobileNumber = resultPaybill.result.value.mobileNo;
	            	$scope.isReqOTP	= true;
					$scope.isDisableBtn = true;

					manageBillerPromptPayService.setAddBillerOTP($scope.resultOTP);
					$scope.virtualKeyboardOTP.option.isKeyboardActive = true;
					$scope.virtualKeyboardOTP.option.setOption($scope.virtualKeyboardOTP.option);
					 $scope.checked = false;
	            } 
	            else {
	            	$scope.isReqOTP = false;
					$scope.isDisableBtn = false;
					if(respStatus.responseCode === "RIB-E-OTP006"){
						$scope.isReqOTP = true;
						$scope.isDisableBtn = true;
					}
	            	popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
	            }
				$timeout.cancel(promise);
				var promise = $timeout(function() {
					$scope.isDisableBtn = false;
				}, 15000);
			});
		};
	 if($scope.payInfoModelConfirm.isFromAddNewAfterPayBill !== true) {
		 $scope.requestOTP();
	 }
	
	$scope.virtualKeyboardOTP = {
		option: {
			disableDotButton: true,
			isKeyboardActive: false,
			maxlength: 6,
			IsEditModel: true
		}
	};

		$scope.submitConfirmAddBiller = function(){
		
			if($scope.payInfoModelConfirm.isFromAddNewAfterPayBill === true){
				manageBillerPromptPayService.confirmAddBillerProfileDetailWithOutOTP(function(resultConfirmPaybillWithOutOTP){
					var respStatus = resultConfirmPaybillWithOutOTP.result.responseStatus;
					if (respStatus.responseCode === kkconst.success) {
						popupService.showErrorPopupMessage('label.success','label.AddBiller.warning.success');
						$state.go(kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE);
						var result = resultConfirmPaybillWithOutOTP.result.value;

					}else {
						popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
					}
				});
			}else{
				if(isEmpty($scope.resultOTP.otp)){
						popupService.showErrorPopupMessage('label.warning','label.input.otp');
					
				}else{	manageBillerPromptPayService.confirmAddBillerProfileDetail(function(resultConfirmPaybill){
							var respStatus = resultConfirmPaybill.result.responseStatus;
						if (respStatus.responseCode === kkconst.success) {
							popupService.showErrorPopupMessage('label.success','label.AddBiller.warning.success');
							$state.go(kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE);
							var result = resultConfirmPaybill.result.value;

						}else {
							popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
						}

					});
				}
			}
		};	


		$scope.backToAddbillerDetail = function(){
				manageBillerPromptPayService.setFactIsBack(true);
				$state.go(kkconst.ROUNTING.ADD_BILLER_PROMPTPAY.STATE);
		};

     function isEDonationCategory() {
         return $scope.billerPayInfoConfirm.categoryId == kkconst.E_DONATE_CATEGORY_ID;
     }

     $scope.getDefaultBillerImage = function(biller) {
         if(biller.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
             return kkconst.DEFAULT_E_DONATION_ICON;
         }else {
             return $scope.defaultBillerLogo;
         }
     };
		
})

.controller('EditBillerPromptPayCtrl', function($scope,$translate, invokeService,manageBillerPromptPayService, $state,popupService, kkconst,$ionicHistory, downloadAndStoreFile) {
	var getBillerDetailIcon = function(){
		var iconName = downloadAndStoreFile.getBillerIconName($scope.from_edit_data);
		var iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
		// get logo
		downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
			$scope.from_edit_data['logoCompany'] = data;
		});
	};

	$scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
	// $scope.from_edit_data = {};
	$scope.lang = $translate.use();
	$scope.from_edit_data =  manageBillerPromptPayService.getBillerDetail();
	getBillerDetailIcon();

	for (var i = 0; i < $scope.from_edit_data.refInfos.length ; i++) {
        $scope.from_edit_data.refInfos[i].isHideRef = false;
        if($scope.from_edit_data.categoryId == kkconst.E_DONATE_CATEGORY_ID && i == 1) {
            $scope.from_edit_data.refInfos[i].isHideRef = true;
        }
	}
	function isEmpty(str) {
		return (!str || 0 === str.length);
	}


	var alias = $scope.from_edit_data.aliasName;

	$scope.goToBillerConfirm = function() {

		 		if(isEmpty($scope.from_edit_data.aliasName)){
					 	 popupService.showErrorPopupMessage('label.warning','validate.input.aliasName');
				}else{
						if( alias !== $scope.from_edit_data.aliasName){
							manageBillerPromptPayService.setBillerDetail($scope.from_edit_data);
						}
						manageBillerPromptPayService.verifyEditBillerProfileDetail(function(resultVerifyEditBiller){
							var respStatus = resultVerifyEditBiller.result.responseStatus;
							if (respStatus.responseCode === kkconst.success) {
								var result= resultVerifyEditBiller.result.value;
								manageBillerPromptPayService.setBillerEditConfirm(result);
								$state.go(kkconst.ROUNTING.EDIT_BILLER_CONFRIM_PROMPTPAY.STATE);
							}else {
									popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
							}

					});
				}
		};

		$scope.backeditBillerDetail = function(){
				$state.go(kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE);
		};


    $scope.getDefaultBillerImage = function(biller) {
        if(biller.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
            return kkconst.DEFAULT_E_DONATION_ICON;
        }else {
            return $scope.defaultBillerLogo;
        }
    };
})


.controller('EditBillerConfirmPromptPayCtrl', function($scope, $translate,invokeService,manageBillerPromptPayService, $state,popupService, kkconst,$ionicHistory, downloadAndStoreFile) {
	var getBillerDetailIcon = function(){
		var iconName = downloadAndStoreFile.getBillerIconName($scope.edit_confirm_data);
		var iconUrl = kkconst.BILLER_ICON_URL + iconName + '.png';
		// get logo
		downloadAndStoreFile.getFromImageUrl(iconUrl).then(function(data){
			$scope.edit_confirm_data['logoCompany'] = data;
		
		});
	};

	$scope.defaultBillerLogo = kkconst.DEFAULT_BILLER_ICON;
	$scope.lang = $translate.use();
	// $scope.edit_confirm_data = {};
	$scope.edit_confirm_data =  manageBillerPromptPayService.getBillerEditConfirm();
	getBillerDetailIcon();

    for (var i = 0; i < $scope.edit_confirm_data.refInfos.length ; i++) {
        $scope.edit_confirm_data.refInfos[i].isHideRef = false;
        if($scope.edit_confirm_data.categoryId == kkconst.E_DONATE_CATEGORY_ID && i == 1) {
            $scope.edit_confirm_data.refInfos[i].isHideRef = true;
        }
    }

	 $scope.submitConfirmEditBiller = function() {
		 
		manageBillerPromptPayService.confirmEditBillerProfile(function(resultConfirmEditBiller){
				var respStatus = resultConfirmEditBiller.result.responseStatus;
				if (respStatus.responseCode === kkconst.success) {
					var result= resultConfirmEditBiller.result.value;
					$state.go(kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE);
				
				}else {
						popupService.showErrorPopupMessage('label.warning',respStatus.responseCode);
				}

		});
		
       };

	   
		$scope.backEditBiller = function(){
			$state.go(kkconst.ROUNTING.EDIT_BILLER_PROMPTPAY.STATE);

		};

    $scope.getDefaultBillerImage = function(biller) {
        if(biller.categoryId == kkconst.E_DONATE_CATEGORY_ID) {
            return kkconst.DEFAULT_E_DONATION_ICON;
        }else {
            return $scope.defaultBillerLogo;
        }
    };
});
