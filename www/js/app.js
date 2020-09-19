// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('kkapp', ['ionic', 'kkapp.controllers','kkapp.services','kkapp.directives'
												,'kkapp.constant','pascalprecht.translate','ngDropdowns'
												,'ui.unique','ksSwiper','ion-affix','angularMoment'])

.run(function($ionicPlatform,$rootScope,$state,$location,$ionicHistory,
							$ionicPopup,popupService,kkconst,dataShareService,deviceService,
							mainSession,cordovadevice, notificationService,amMoment,$translate, subscriptionService) {
								amMoment.changeLocale($translate.use().toLowerCase());

						
  $ionicPlatform.ready(function() {
							//var networkState = navigator.connection.type;
							
	  if(window.cordova && window.cordova.plugins.Keyboard) {
	    	window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
	    	window.cordova.plugins.Keyboard.disableScroll(true);
			}
			
			
		// deviceService.jailRootDetect();
  });

	var isMainCheck = function(){

		var mainPage = [kkconst.ROUNTING.MENU.STATE,
	                  kkconst.ROUNTING.MY_ACCOUNT.STATE,
	                  kkconst.ROUNTING.CHANGE_PIN.STATE,
	                  kkconst.ROUNTING.FUNDTRANSFER.STATE,
	                  // kkconst.ROUNTING.BILL_PAYMENT.STATE,
	                  kkconst.ROUNTING.OTHER_ACCOUNT.STATE,
	                  // kkconst.ROUNTING.MANAGE_BILLER.STATE,
	                  kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.STATE,
	                  kkconst.ROUNTING.MUTUAL_FUND_SUMMARY.STATE,
	                  kkconst.ROUNTING.ANYID.STATE,
										kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE,
	                  // kkconst.ROUNTING.TRANSACTION_HISTORY.STATE,
										kkconst.ROUNTING.QR_CODE_GENERATOR.STATE,
										kkconst.ROUNTING.QR_CODE_SCANNER.STATE,
										kkconst.ROUNTING.MY_ANYID_ACCOUNT];

		var isMain = false;
	  
	  for(var i=0;i< mainPage.length;i++){
		  if($state.is(mainPage[i])){
			  isMain = true;
		  }
	  }
		var notMainPage = [kkconst.ROUNTING.OTHER_ACCOUNT.STATE,
											kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.STATE,
											kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.STATE,
											kkconst.ROUNTING.SCHEDULE_BILL_DETAIL.STATE,
											kkconst.ROUNTING.MY_ACCOUNT_CASA_DETAILS.STATE,
											kkconst.ROUNTING.RTP_REQUEST_RESULT.STATE];
		if(($ionicHistory.viewHistory().backView !== null && $ionicHistory.viewHistory().backView.stateName !== null) && (notMainPage.indexOf($ionicHistory.viewHistory().backView.stateName) > -1)){
				isMain = false;
		}

		return isMain;
	};

  //Handle android native back button
  $ionicPlatform.registerBackButtonAction(function (event) {
	  if(dataShareService.isVirtualKeyBoardActive === true) {
		  event.preventDefault();
		  return false;
	  }
	  
      if (isMainCheck()){
    	  popupService.showConfirmPopupMessageCallback("label.confirm", "button.logout", function(ok){
    		  if(ok){
            // loginChallengeHandler.logout();
                  subscriptionService.logout();
            navigator.app.exitApp();
       
    		  }
    	  });
      }else if($state.is(kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.STATE) || $state.is('app.billPaymentConfirmComplete') || $state.is('app.editScheduleBillPaymentComplete') || $state.is(kkconst.ROUNTING.ANYID_RESULT.STATE)) {
    	  
    	  event.preventDefault();
	  
      } else {
    	  $ionicHistory.goBack();    	   
      }
  }, 101);
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider,$ionicConfigProvider, $compileProvider,kkconst,$provide) {

	for(var langErr in window.translationsError){
		if(langErr !== null){
			$translateProvider.translations(langErr, window.translationsError[langErr]);
		}
	}
	for(var langLabel in window.translationsLabel){
		if(langLabel !== null){
			$translateProvider.translations(langLabel, window.translationsLabel[langLabel]);
		}
	}
	  $provide.decorator('$locale', ['$delegate', function($delegate) {
          if($delegate.id === 'en-us') {
            $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
            $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
          }
          return $delegate;
        }]);
	//to set the TABs bar at the bottom
	$ionicConfigProvider.tabs.position('bottom'); // other values: top
	
	//to disable swipe to change views
	$ionicConfigProvider.views.swipeBackEnabled(false);
	
	//set prefered default language
	$translateProvider.preferredLanguage(kkconst.LANGUAGE_en);
	
	//disable debug for Production
	$compileProvider.debugInfoEnabled(false); 
	
	$ionicConfigProvider.platform.android.views.transition('none');
	
$stateProvider
   .state(kkconst.ROUNTING.MENU.STATE, {
	    url: kkconst.ROUNTING.MENU.URL,
	    templateUrl: kkconst.ROUNTING.MENU.TEMPLATE_URL
	})	  
  
  .state('app', {  	
	abstract: true,
    templateUrl: "templates/menu-left.html",
	cache : false
  })  
  .state(kkconst.ROUNTING.CHANGE_PIN.STATE, {
		url: kkconst.ROUNTING.CHANGE_PIN.URL,
		views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.CHANGE_PIN.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CHANGE_PIN.CONTROLLER
			}
		},
	    cache : false
	}) 	
	.state(kkconst.ROUNTING.SETTING_MAIN_MENU.STATE, {
	    url: kkconst.ROUNTING.SETTING_MAIN_MENU.URL,
	    templateUrl: kkconst.ROUNTING.SETTING_MAIN_MENU.TEMPLATE_URL
	})	
	
	.state(kkconst.ROUNTING.SETTING.STATE, {
		url: kkconst.ROUNTING.SETTING.URL,
		views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.SETTING.TEMPLATE_URL 
			}
		}
	}) 
    
  .state(kkconst.ROUNTING.CONTACTUS.STATE, {
    url: kkconst.ROUNTING.CONTACTUS.URL,
    templateUrl: kkconst.ROUNTING.CONTACTUS.TEMPLATE_URL,
    controller: kkconst.ROUNTING.CONTACTUS.CONTROLLER
      
  })
  .state(kkconst.ROUNTING.FUNDTRANSFER.STATE, {
    url: kkconst.ROUNTING.FUNDTRANSFER.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.FUNDTRANSFER.TEMPLATE_URL,
        controller: kkconst.ROUNTING.FUNDTRANSFER.CONTROLLER
      }
    },
    cache : true
  }) 
   
  .state(kkconst.ROUNTING.FUNDTRANSFER_CONFIRM.STATE, {
    url: kkconst.ROUNTING.FUNDTRANSFER_CONFIRM.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.FUNDTRANSFER_CONFIRM.TEMPLATE_URL,
        controller: kkconst.ROUNTING.FUNDTRANSFER_CONFIRM.CONTROLLER
      }
    },
    cache : false
  }) 
  .state(kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.STATE, {
    url: kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.TEMPLATE_URL,
        controller: kkconst.ROUNTING.FUNDTRANSFER_COMPLETE.CONTROLLER
      }
    },
    cache : false
  }) 
  
  .state(kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.STATE, {
    url: kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.TEMPLATE_URL,
        controller: kkconst.ROUNTING.FUNDTRANSFER_SCHEDULE.CONTROLLER
      }
    },
    cache: false
  })
  
  .state(kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.STATE, {
	    url: kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.URL,
	    views: {
	      'appContainerView': {
	        templateUrl: kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.TEMPLATE_URL,
	        controller: kkconst.ROUNTING.SCHEDULE_FUNDTRANSFER_DETAIL.CONTROLLER
	      }
	    },
	    cache : false
	  }) 

  .state(kkconst.ROUNTING.MY_ACCOUNT.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT.CONTROLLER
      }
    },
    cache: false
  })
  .state(kkconst.ROUNTING.MY_ACCOUNT_CASA_DETAILS.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_CASA_DETAILS.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_CASA_DETAILS.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_CASA_DETAILS.CONTROLLER
      }
    },
    cache: false
  })
  .state(kkconst.ROUNTING.MY_ACCOUNT_TD_DETAILS.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_TD_DETAILS.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_TD_DETAILS.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_TD_DETAILS.CONTROLLER
      }
    },
    cache: false
  })  
  .state(kkconst.ROUNTING.MY_ACCOUNT_ADD.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_ADD.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_ADD.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_ADD.CONTROLLER
      }
    },
    cache: false
  })
  .state(kkconst.ROUNTING.MY_ACCOUNT_ADD_DETAIL.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_ADD_DETAIL.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_ADD_DETAIL.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_ADD_DETAIL.CONTROLLER
      }
    },
    cache: false
  })  
  .state(kkconst.ROUNTING.MY_ACCOUNT_CASA_VIEW_STATEMENT.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_CASA_VIEW_STATEMENT.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_CASA_VIEW_STATEMENT.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_CASA_VIEW_STATEMENT.CONTROLLER
      }
    },
    cache: false
  })
  .state(kkconst.ROUNTING.MY_ACCOUNT_EDIT.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_EDIT.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_EDIT.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_EDIT.CONTROLLER
      }
    },
    cache: false
  })
  .state(kkconst.ROUNTING.MY_ACCOUNT_EDIT_DETAIL.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_EDIT_DETAIL.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_EDIT_DETAIL.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_EDIT_DETAIL.CONTROLLER
      }
    },
    cache: false
  })
  
  .state(kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM.CONTROLLER
      }
    },
    cache: false
  })
  .state(kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM_CONDITION.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM_CONDITION.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM_CONDITION.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM_CONDITION.CONTROLLER
      }
    },
    cache: false
  })
  
  .state(kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM_CONFIRM.STATE, {
    url: kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM_CONFIRM.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM_CONFIRM.TEMPLATE_URL,
        controller: kkconst.ROUNTING.MY_ACCOUNT_CHANGE_TERM_CONFIRM.CONTROLLER
      }
    },
    cache: false
  })
  .state(kkconst.ROUNTING.OTHER_ACCOUNT.STATE, {
    url: kkconst.ROUNTING.OTHER_ACCOUNT.URL,
    views: {
      'appContainerView': {
        templateUrl: kkconst.ROUNTING.OTHER_ACCOUNT.TEMPLATE_URL,
        controller: kkconst.ROUNTING.OTHER_ACCOUNT.CONTROLLER
      }
    }
  })
   .state('app.addOtherAccount', {
    url: "/addOtherAccount",
    views: {
      'appContainerView': {
        templateUrl: "templates/ManageAccounts/OtherAccounts/add-other-account.html",
        controller: 'AddOtherAccountCtrl'
      }
    }
  })
  .state('app.addOtherAccountDetail', {
    url: "/addOtherAccountDetail",
    views: {
      'appContainerView': {
        templateUrl: "templates/ManageAccounts/OtherAccounts/add-other-account-detail.html",
        controller: 'AddOtherAccountDetailCtrl'
      }
    },
  	cache : false
  })
  
  .state('app.editOtherAccount', {
    url: "/editOtherAccount",
    views: {
      'appContainerView': {
        templateUrl: "templates/ManageAccounts/OtherAccounts/edit-other-account.html",
        controller: 'EditOtherAccountCtrl'
      }
    }
  })
 .state('app.editOtherAccountDetail', {
    url: "/editOtherAccountDetail",
    views: {
      'appContainerView': {
        templateUrl: "templates/ManageAccounts/OtherAccounts/edit-other-account-detail.html",
        controller: 'EditOtherAccountDetailCtrl'
      }
    },
    cache : false
  })
	     .state(kkconst.ROUNTING.SCHEDULE_BILL_DETAIL.STATE, {
	    url: kkconst.ROUNTING.SCHEDULE_BILL_DETAIL.URL,
	    views: {
	      'appContainerView': {
	        templateUrl: kkconst.ROUNTING.SCHEDULE_BILL_DETAIL.TEMPLATE_URL,
	        controller: kkconst.ROUNTING.SCHEDULE_BILL_DETAIL.CONTROLLER
	      }
	    },
	    cache : false
			})
			.state(kkconst.ROUNTING.MUTUAL_FUND.STATE, {
		    url: kkconst.ROUNTING.MUTUAL_FUND.URL,
		    views: {
		      'appContainerView': {
		        templateUrl: kkconst.ROUNTING.MUTUAL_FUND.TEMPLATE_URL,
		        controller: kkconst.ROUNTING.MUTUAL_FUND.CONTROLLER
		      }
		    },
		    cache : false
       })
       .state(kkconst.ROUNTING.MUTUAL_FUND_SUMMARY.STATE, {
		    url: kkconst.ROUNTING.MUTUAL_FUND_SUMMARY.URL,
		    views: {
		      'appContainerView': {
		        templateUrl: kkconst.ROUNTING.MUTUAL_FUND_SUMMARY.TEMPLATE_URL,
		        controller: kkconst.ROUNTING.MUTUAL_FUND_SUMMARY.CONTROLLER
		      }
		    },
		    cache : false
			 })
       .state('app.mutualFundDetails', {
          url: "/mutualFundDetails",
          views: {
          'appContainerView': {
           templateUrl: "templates/MutualFund/MutualFundDetails.html",
           controller: 'mutualFundDetailCtrl'
          }
        },
      cache: false
			 })
		
			 .state('app.mutualFundDetails1', {
          url: "/mutualFundDetails1",
          views: {
          'appContainerView': {
           templateUrl: "templates/MutualFund1/MutualFundDetails1.html",
           controller: 'mutualFundDetailCtrl1'
          }
        },
      cache: false
       })
			  .state('app.myMutualFundViewStatement', {
          url: "/myMutualFundViewStatement",
          views: {
          'appContainerView': {
           templateUrl: "templates/MutualFund/MutualFund-view-statement.html",
           controller: 'mutualFundViewStatementCtrl'
          }
        },
      cache: false
			 })
			 .state('app.manageDevice', {
          url: "/manageDevice",
          views: {
          'appContainerView': {
           templateUrl: "templates/ManageDevice/Manage-Device.html",
           controller: 'manageDeviceCtrl'
          }
        },
      cache: false
			 })
			  .state('app.mutualFundNews', {
          url: "/mutualFundNews",
          views: {
          'appContainerView': {
           templateUrl: "templates/MutualFund/MutualFund-news.html",
           controller: 'mutualFundNewsCtrl'
          }
        },
      cache: false
			 })
	  .state('locateUs', {
	    url: "/locateUs",
        templateUrl: "templates/locateUs.html",
        controller: 'MapCtrl'
	  })

	  .state('app.promotions', {
	    url: "/promotions",
	    views: {
	      'appContainerView': {
	        templateUrl: "templates/promotions.html",
	        controller: 'promotionCtrl'
	      }
	    },
	    cache : false
	  })
    .state('faq', {
        url: "/faq",
        templateUrl: "templates/faq.html",
        controller: 'faqCtrl'
    })
    .state('privacyPolicy', {
        url: "/privacyPolicy",
        templateUrl: "templates/privacy-policy.html",
        controller: 'privacyPolicyCtrl',
        cache : false
    })
   	.state(kkconst.ROUNTING.ANYID.STATE, {
	    url: kkconst.ROUNTING.ANYID.URL,
	    views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.ANYID.TEMPLATE_URL,
				controller: kkconst.ROUNTING.ANYID.CONTROLLER
			}
	    }
	  })
	  .state(kkconst.ROUNTING.ANYID_CONFIRM.STATE, {
	    url: kkconst.ROUNTING.ANYID_CONFIRM.URL,
	    views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.ANYID_CONFIRM.TEMPLATE_URL,
				controller: kkconst.ROUNTING.ANYID_CONFIRM.CONTROLLER
			}
	    }
	  })
	  .state(kkconst.ROUNTING.ANYID_RESULT.STATE, {
	    url: kkconst.ROUNTING.ANYID_RESULT.URL,
	    views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.ANYID_RESULT.TEMPLATE_URL,
				controller: kkconst.ROUNTING.ANYID_RESULT.CONTROLLER
			}
	    }
	  })
    
     .state(kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.STATE, {
	    url: kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.URL,
	    views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.TEMPLATE_URL,
				controller: kkconst.ROUNTING.BILLER_LIST_PROMPTPAY.CONTROLLER
						}
	    	},
			  	cache : false
	  }) 
	   .state(kkconst.ROUNTING.BILLER_DETAIL_PROMPTPAY.STATE, {
	    url: kkconst.ROUNTING.BILLER_DETAIL_PROMPTPAY.URL,
	    views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.BILLER_DETAIL_PROMPTPAY.TEMPLATE_URL,
				controller: kkconst.ROUNTING.BILLER_DETAIL_PROMPTPAY.CONTROLLER
					}
	    },
				cache : false
	  }) 
	  .state(kkconst.ROUNTING.ADD_BILLER_PROMPTPAY.STATE, {
	    url: kkconst.ROUNTING.ADD_BILLER_PROMPTPAY.URL,
	    views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.ADD_BILLER_PROMPTPAY.TEMPLATE_URL,
				controller: kkconst.ROUNTING.ADD_BILLER_PROMPTPAY.CONTROLLER
						}
	    },
			 cache : false
			
	  }) 
		
		.state(kkconst.ROUNTING.ADD_BILLER_CONFIRM_PROMPTPAY.STATE, {
		    url: kkconst.ROUNTING.ADD_BILLER_CONFIRM_PROMPTPAY.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.ADD_BILLER_CONFIRM_PROMPTPAY.TEMPLATE_URL,
					controller: kkconst.ROUNTING.ADD_BILLER_CONFIRM_PROMPTPAY.CONTROLLER
						}
		    },
				 cache : false				
		}) 
		 .state(kkconst.ROUNTING.EDIT_BILLER_PROMPTPAY.STATE, {
		    url: kkconst.ROUNTING.EDIT_BILLER_PROMPTPAY.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.EDIT_BILLER_PROMPTPAY.TEMPLATE_URL,
					controller: kkconst.ROUNTING.EDIT_BILLER_PROMPTPAY.CONTROLLER
						}
				 },
				cache : false
		})
		 .state(kkconst.ROUNTING.EDIT_BILLER_CONFRIM_PROMPTPAY.STATE, {
		    url: kkconst.ROUNTING.EDIT_BILLER_CONFRIM_PROMPTPAY.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.EDIT_BILLER_CONFRIM_PROMPTPAY.TEMPLATE_URL,
					controller: kkconst.ROUNTING.EDIT_BILLER_CONFRIM_PROMPTPAY.CONTROLLER
					}
			 },
			 	cache : false
		})
		.state(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.STATE, {
		    url: kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.TEMPLATE_URL,
					controller: kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY.CONTROLLER
				}
		    }
		})
		.state(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_CONFIRM.STATE, {
		    url: kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_CONFIRM.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_CONFIRM.TEMPLATE_URL,
					controller: kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_CONFIRM.CONTROLLER
				}
				},
				cache: false
		})
		.state(kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_RESULT.STATE, {
		    url: kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_RESULT.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_RESULT.TEMPLATE_URL,
					controller: kkconst.ROUNTING.BILL_PAYMENT_PROMPTPAY_RESULT.CONTROLLER
				}
				},
				cache: false
		})
		.state(kkconst.ROUNTING.BILL_E_DONATION.STATE, {
			url: kkconst.ROUNTING.BILL_E_DONATION.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.BILL_E_DONATION.TEMPLATE_URL,
					controller: kkconst.ROUNTING.BILL_E_DONATION.CONTROLLER
				}
			}
		})
		.state(kkconst.ROUNTING.BILL_E_DONATION_CONFIRM.STATE, {
			url: kkconst.ROUNTING.BILL_E_DONATION_CONFIRM.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.BILL_E_DONATION_CONFIRM.TEMPLATE_URL,
					controller: kkconst.ROUNTING.BILL_E_DONATION_CONFIRM.CONTROLLER
				}
			},
			cache: false
		})
		.state(kkconst.ROUNTING.BILL_E_DONATION_RESULT.STATE, {
			url: kkconst.ROUNTING.BILL_E_DONATION_RESULT.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.BILL_E_DONATION_RESULT.TEMPLATE_URL,
					controller: kkconst.ROUNTING.BILL_E_DONATION_RESULT.CONTROLLER
				}
			},
			cache: false
		})
			.state(kkconst.ROUNTING.TRANSACTION_HISTORY_FUNDTRANSFER.STATE, {
		    url: kkconst.ROUNTING.TRANSACTION_HISTORY_FUNDTRANSFER.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.TRANSACTION_HISTORY_FUNDTRANSFER.TEMPLATE_URL,
					controller: kkconst.ROUNTING.TRANSACTION_HISTORY_FUNDTRANSFER.CONTROLLER
				}
		    },
				 cache : false
		})
		.state(kkconst.ROUNTING.TRANSACTION_HISTORY_FUNDTRANSFER_DETAIL.STATE, {
			url: kkconst.ROUNTING.TRANSACTION_HISTORY_FUNDTRANSFER_DETAIL.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.TRANSACTION_HISTORY_FUNDTRANSFER_DETAIL.TEMPLATE_URL,
					controller: kkconst.ROUNTING.TRANSACTION_HISTORY_FUNDTRANSFER_DETAIL.CONTROLLER
				}
			}
		})
		.state(kkconst.ROUNTING.TRANSACTION_HISTORY_BILLPAYMENT.STATE, {
		    url: kkconst.ROUNTING.TRANSACTION_HISTORY_BILLPAYMENT.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.TRANSACTION_HISTORY_BILLPAYMENT.TEMPLATE_URL,
					controller: kkconst.ROUNTING.TRANSACTION_HISTORY_BILLPAYMENT.CONTROLLER
				}
		    },
				 cache : false
		})
		.state(kkconst.ROUNTING.TRANSACTION_HISTORY_BILL_PAYMENT_DETAIL.STATE, {
		    url: kkconst.ROUNTING.TRANSACTION_HISTORY_BILL_PAYMENT_DETAIL.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.TRANSACTION_HISTORY_BILL_PAYMENT_DETAIL.TEMPLATE_URL,
					controller: kkconst.ROUNTING.TRANSACTION_HISTORY_BILL_PAYMENT_DETAIL.CONTROLLER
				}
		    },
				 cache : false
		})
		.state(kkconst.ROUNTING.TRANSACTION_HISTORY_E_DONATION_DETAIL.STATE, {
		    url: kkconst.ROUNTING.TRANSACTION_HISTORY_E_DONATION_DETAIL.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.TRANSACTION_HISTORY_E_DONATION_DETAIL.TEMPLATE_URL,
					controller: kkconst.ROUNTING.TRANSACTION_HISTORY_E_DONATION_DETAIL.CONTROLLER
				}
		    },
				 cache : false
		})
			.state(kkconst.ROUNTING.TRANSACTION_HISTORY_RTP.STATE, {
		    url: kkconst.ROUNTING.TRANSACTION_HISTORY_RTP.URL,
		    views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.TRANSACTION_HISTORY_RTP.TEMPLATE_URL,
					controller: kkconst.ROUNTING.TRANSACTION_HISTORY_RTP.CONTROLLER
				}
		    }
		})
		.state(kkconst.ROUNTING.REQUEST_TO_PAY_INCOMING_LIST.STATE, {
		    url: kkconst.ROUNTING.REQUEST_TO_PAY_INCOMING_LIST.URL,
		    views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.REQUEST_TO_PAY_INCOMING_LIST.TEMPLATE_URL,
						controller: kkconst.ROUNTING.REQUEST_TO_PAY_INCOMING_LIST.CONTROLLER
					},
		    },
				cache : false
		})
		.state(kkconst.ROUNTING.REQUEST_TO_PAY_DETAIL.STATE, {
		    url: kkconst.ROUNTING.REQUEST_TO_PAY_DETAIL.URL,
		    views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.REQUEST_TO_PAY_DETAIL.TEMPLATE_URL,
						controller: kkconst.ROUNTING.REQUEST_TO_PAY_DETAIL.CONTROLLER
					}
		    },
				cache : false

		})
		.state(kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_LIST.STATE, {
		    url: kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_LIST.URL,
		    views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_LIST.TEMPLATE_URL,
						controller: kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_LIST.CONTROLLER
					}
		    },
				cache : false
		})
			.state(kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_DETAIL.STATE, {
		    url: kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_DETAIL.URL,
		    views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_DETAIL.TEMPLATE_URL,
						controller: kkconst.ROUNTING.REQUEST_TO_PAY_OUTGOING_DETAIL.CONTROLLER
					}
		    },
				cache : false
		})
		.state(kkconst.ROUNTING.RTP_REQUEST.STATE, {
		    url: kkconst.ROUNTING.RTP_REQUEST.URL,
		    views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.RTP_REQUEST.TEMPLATE_URL,
						controller: kkconst.ROUNTING.RTP_REQUEST.CONTROLLER
					},
		    },
		})
		.state(kkconst.ROUNTING.RTP_REQUEST_CONFIRM.STATE, {
		    url: kkconst.ROUNTING.RTP_REQUEST_CONFIRM.URL,
		    views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.RTP_REQUEST_CONFIRM.TEMPLATE_URL,
						controller: kkconst.ROUNTING.RTP_REQUEST_CONFIRM.CONTROLLER
					},
		    },
		})

		
		.state(kkconst.ROUNTING.RTP_REQUEST_RESULT.STATE, {
		    url: kkconst.ROUNTING.RTP_REQUEST_RESULT.URL,
		    views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.RTP_REQUEST_RESULT.TEMPLATE_URL,
						controller: kkconst.ROUNTING.RTP_REQUEST_RESULT.CONTROLLER
					},
		    },
				cache : false
		})

		.state(kkconst.ROUNTING.NOTIFICATION.STATE, {
			url: kkconst.ROUNTING.NOTIFICATION.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.NOTIFICATION.TEMPLATE_URL,
					controller: kkconst.ROUNTING.NOTIFICATION.CONTROLLER
				},
			},
	})
		
		.state(kkconst.ROUNTING.QR_CODE_SCANNER.STATE, {
		    url: kkconst.ROUNTING.QR_CODE_SCANNER.URL,
		    views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.QR_CODE_SCANNER.TEMPLATE_URL,
						controller: kkconst.ROUNTING.QR_CODE_SCANNER.CONTROLLER
					}
		    },
				cache : false
		}).state(kkconst.ROUNTING.QR_CODE_GENERATOR.STATE, {
		    url: kkconst.ROUNTING.QR_CODE_GENERATOR.URL,
		    views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.QR_CODE_GENERATOR.TEMPLATE_URL,
						controller: kkconst.ROUNTING.QR_CODE_GENERATOR.CONTROLLER
					}
		    },
				cache : true
		}).state(kkconst.ROUNTING.QR_CODE_GENERATOR_COMPLETE.STATE, {
				url: kkconst.ROUNTING.QR_CODE_GENERATOR_COMPLETE.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.QR_CODE_GENERATOR_COMPLETE.TEMPLATE_URL,
						controller: kkconst.ROUNTING.QR_CODE_GENERATOR_COMPLETE.CONTROLLER
					}
				},
				cache : false
  	}).state(kkconst.ROUNTING.QR_VERIFY_FUND_TRANSFER_DETAIL.STATE, {
				url: kkconst.ROUNTING.QR_VERIFY_FUND_TRANSFER_DETAIL.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.QR_VERIFY_FUND_TRANSFER_DETAIL.TEMPLATE_URL,
						controller: kkconst.ROUNTING.QR_VERIFY_FUND_TRANSFER_DETAIL.CONTROLLER
					}
				},
				cache : false
  	}).state(kkconst.ROUNTING.QR_VERIFY_BILL_PAYMENT_DETAIL.STATE, {
				url: kkconst.ROUNTING.QR_VERIFY_BILL_PAYMENT_DETAIL.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.QR_VERIFY_BILL_PAYMENT_DETAIL.TEMPLATE_URL,
						controller: kkconst.ROUNTING.QR_VERIFY_BILL_PAYMENT_DETAIL.CONTROLLER
					}
				},
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP1.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP1.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP1.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP1.CONTROLLER,
				cache : true
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP2.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP2.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP2.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP2.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP3.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP3.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP3.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP3.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP4.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP4.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP4.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_USERNAME_STEP4.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP1.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP1.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP1.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP1.CONTROLLER,
				cache : true
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP2.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP2.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP2.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP2.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP3.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP3.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP3.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP3.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP4.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP4.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP4.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_DEBITCARD_STEP4.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_PORTAL.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_PORTAL.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_PORTAL.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_PORTAL.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP1.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP1.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP1.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP1.CONTROLLER,
				cache : true
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP2.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP2.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP2.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP2.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP3.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP3.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP3.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP3.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP4.STATE, {
				url: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP4.URL,
				templateUrl: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP4.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CREATE_PIN_USING_PRODUCT_STEP4.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.RESET_PIN_PORTAL.STATE, {
				url: kkconst.ROUNTING.RESET_PIN_PORTAL.URL,
				templateUrl: kkconst.ROUNTING.RESET_PIN_PORTAL.TEMPLATE_URL,
				controller: kkconst.ROUNTING.RESET_PIN_PORTAL.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP1.STATE, {
				url: kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP1.URL,
				templateUrl: kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP1.TEMPLATE_URL,
				controller: kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP1.CONTROLLER,
				cache : true
  	}).state(kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP2.STATE, {
				url: kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP2.URL,
				templateUrl: kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP2.TEMPLATE_URL,
				controller: kkconst.ROUNTING.RESET_PIN_USING_USERNAME_STEP2.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP1.STATE, {
				url: kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP1.URL,
				templateUrl: kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP1.TEMPLATE_URL,
				controller: kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP1.CONTROLLER,
				cache : true
  	}).state(kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP2.STATE, {
				url: kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP2.URL,
				templateUrl: kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP2.TEMPLATE_URL,
				controller: kkconst.ROUNTING.RESET_PIN_USING_DEBITCARD_STEP2.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP1.STATE, {
				url: kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP1.URL,
				templateUrl: kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP1.TEMPLATE_URL,
				controller: kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP1.CONTROLLER,
				cache : true
  	}).state(kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP2.STATE, {
				url: kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP2.URL,
				templateUrl: kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP2.TEMPLATE_URL,
				controller: kkconst.ROUNTING.RESET_PIN_USING_PRODUCT_STEP2.CONTROLLER,
				cache : false
  	}).state(kkconst.ROUNTING.RTP_BLOCKLIST.STATE, {
				url: kkconst.ROUNTING.RTP_BLOCKLIST.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.RTP_BLOCKLIST.TEMPLATE_URL,
						controller: kkconst.ROUNTING.RTP_BLOCKLIST.CONTROLLER
					}
				},
				cache : false
  	}).state(kkconst.ROUNTING.ANYID_DETAILS.STATE, {
				url: kkconst.ROUNTING.ANYID_DETAILS.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.ANYID_DETAILS.TEMPLATE_URL,
						controller: kkconst.ROUNTING.ANYID_DETAILS.CONTROLLER
					}
				},
				cache : false
  	}).state(kkconst.ROUNTING.MY_ANYID_ACCOUNT.STATE, {
				url: kkconst.ROUNTING.MY_ANYID_ACCOUNT.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_ANYID_ACCOUNT.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_ANYID_ACCOUNT.CONTROLLER
					}
				},
				cache: false
		}).state(kkconst.ROUNTING.ANY_ID_EDIT.STATE, {
				url: kkconst.ROUNTING.ANY_ID_EDIT.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.ANY_ID_EDIT.TEMPLATE_URL,
						controller: kkconst.ROUNTING.ANY_ID_EDIT.CONTROLLER
					}
				},
		}).state(kkconst.ROUNTING.ANY_ID_EDIT_CONFIRM.STATE, {
			url: kkconst.ROUNTING.ANY_ID_EDIT_CONFIRM.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.ANY_ID_EDIT_CONFIRM.TEMPLATE_URL,
					controller: kkconst.ROUNTING.ANY_ID_EDIT_CONFIRM.CONTROLLER
				}
			},
			cache : false				
	}).state(kkconst.ROUNTING.ANY_ID_EDIT_COMPLETE.STATE, {
			url: kkconst.ROUNTING.ANY_ID_EDIT_COMPLETE.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.ANY_ID_EDIT_COMPLETE.TEMPLATE_URL,
					controller: kkconst.ROUNTING.ANY_ID_EDIT_COMPLETE.CONTROLLER
				}
			},
			cache : false				
	}).state(kkconst.ROUNTING.SUITABILITY_LISK.STATE, {
				url: kkconst.ROUNTING.SUITABILITY_LISK.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.SUITABILITY_LISK.TEMPLATE_URL,
						controller: kkconst.ROUNTING.SUITABILITY_LISK.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.SUITABILITY_QUESTION.STATE, {
				url: kkconst.ROUNTING.SUITABILITY_QUESTION.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.SUITABILITY_QUESTION.TEMPLATE_URL,
						controller: kkconst.ROUNTING.SUITABILITY_QUESTION.CONTROLLER
					}
				},
			cache: false
		// }).state(kkconst.ROUNTING.MY_MUTUAL_FUND.STATE, {
		// 		url: kkconst.ROUNTING.MY_MUTUAL_FUND.URL,
		// 		views: {
		// 			'appContainerView': {
		// 				templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND.TEMPLATE_URL,
		// 				controller: kkconst.ROUNTING.MY_MUTUAL_FUND.CONTROLLER
		// 			}
		// 		},
		// 	cache: false
		// }).state(kkconst.ROUNTING.MY_MUTUAL_FUND_MODAL.STATE, {
		// 		url: kkconst.ROUNTING.MY_MUTUAL_FUND_MODAL.URL,
		// 		views: {
		// 			'appContainerView': {
		// 				templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_MODAL.TEMPLATE_URL,
		// 				controller: kkconst.ROUNTING.MY_MUTUAL_FUND_MODAL.CONTROLLER
		// 			}
		// 		},
		// 	cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE.CONTROLLER
					}
				},
			cache: true
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_CONFIRM.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_CONFIRM.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_CONFIRM.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_CONFIRM.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_RESULT.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_RESULT.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_RESULT.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_PURCHASE_RESULT.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM.CONTROLLER
					}
				},
			cache: true
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_CONFIRM.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_CONFIRM.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_CONFIRM.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_CONFIRM.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_RESULT.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_RESULT.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_RESULT.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_REDEEM_RESULT.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH.CONTROLLER
					}
				},
			cache: true
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_CONFIRM.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_CONFIRM.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_CONFIRM.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_CONFIRM.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_RESULT.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_RESULT.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_RESULT.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_SWITCH_RESULT.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_TRANSACTION_TODAY.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_TRANSACTION_TODAY.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_TRANSACTION_TODAY.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_TRANSACTION_TODAY.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_TRANSACTION_DETAIL.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_TRANSACTION_DETAIL.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_TRANSACTION_DETAIL.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_TRANSACTION_DETAIL.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_SEARCH.STATE, {
				url: kkconst.ROUNTING.MY_MUTUAL_FUND_SEARCH.URL,
				views: {
					'appContainerView': {
						templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_SEARCH.TEMPLATE_URL,
						controller: kkconst.ROUNTING.MY_MUTUAL_FUND_SEARCH.CONTROLLER
					}
				},
			cache: false
		}).state(kkconst.ROUNTING.MY_MUTUAL_FUND_DETAIL_SEARCH.STATE, {
			url: kkconst.ROUNTING.MY_MUTUAL_FUND_DETAIL_SEARCH.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.MY_MUTUAL_FUND_DETAIL_SEARCH.TEMPLATE_URL,
					controller: kkconst.ROUNTING.MY_MUTUAL_FUND_DETAIL_SEARCH.CONTROLLER
				}
			},
			cache: false
		}).state(kkconst.ROUNTING.LIST_AUTHEN_NDID.STATE, {
			url: kkconst.ROUNTING.LIST_AUTHEN_NDID.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.LIST_AUTHEN_NDID.TEMPLATE_URL,
					controller: kkconst.ROUNTING.LIST_AUTHEN_NDID.CONTROLLER
				}
			},
		cache: true
		}).state(kkconst.ROUNTING.LIST_CREDIT_BUREAU.STATE, {
			url: kkconst.ROUNTING.LIST_CREDIT_BUREAU.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.LIST_CREDIT_BUREAU.TEMPLATE_URL,
					controller: kkconst.ROUNTING.LIST_CREDIT_BUREAU.CONTROLLER
				}
			},
		cache: true
		}).state(kkconst.ROUNTING.REQUEST_BUREAU_MENU.STATE, {
			url: kkconst.ROUNTING.REQUEST_BUREAU_MENU.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.REQUEST_BUREAU_MENU.TEMPLATE_URL,
					controller: kkconst.ROUNTING.REQUEST_BUREAU_MENU.CONTROLLER
				}
			},
		cache: true
		}).state(kkconst.ROUNTING.CONFIRM_NCB_REQUEST.STATE, {
			url: kkconst.ROUNTING.CONFIRM_NCB_REQUEST.URL,
			views: {
				'appContainerView': {
					templateUrl: kkconst.ROUNTING.CONFIRM_NCB_REQUEST.TEMPLATE_URL,
					controller: kkconst.ROUNTING.CONFIRM_NCB_REQUEST.CONTROLLER
				}
			},
		cache: true
	}).state(kkconst.ROUNTING.CONFIRM_AUTHEN_NDID.STATE, {
		url: kkconst.ROUNTING.CONFIRM_AUTHEN_NDID.URL,
		views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.CONFIRM_AUTHEN_NDID.TEMPLATE_URL,
				controller: kkconst.ROUNTING.CONFIRM_AUTHEN_NDID.CONTROLLER
			}
		},
		cache: false
	}).state(kkconst.ROUNTING.RESULT_AUTHEN_NDID.STATE, {
		url: kkconst.ROUNTING.RESULT_AUTHEN_NDID.URL,
		views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.RESULT_AUTHEN_NDID.TEMPLATE_URL,
				controller: kkconst.ROUNTING.RESULT_AUTHEN_NDID.CONTROLLER
			}
		},
		cache: false
	}).state(kkconst.ROUNTING.VERIFY_FACE_AUTHEN_NDID.STATE, {
		url: kkconst.ROUNTING.VERIFY_FACE_AUTHEN_NDID.URL,
		views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.VERIFY_FACE_AUTHEN_NDID.TEMPLATE_URL,
				controller: kkconst.ROUNTING.VERIFY_FACE_AUTHEN_NDID.CONTROLLER
			}
		},
		cache: false
	}).state(kkconst.ROUNTING.NEW_USER_AUTHEN_STEP1.STATE, {
		url: kkconst.ROUNTING.NEW_USER_AUTHEN_STEP1.URL,
		templateUrl: kkconst.ROUNTING.NEW_USER_AUTHEN_STEP1.TEMPLATE_URL,
		controller: kkconst.ROUNTING.NEW_USER_AUTHEN_STEP1.CONTROLLER,
		cache : false
	}).state(kkconst.ROUNTING.NEW_USER_AUTHEN_STEP2.STATE, {
		url: kkconst.ROUNTING.NEW_USER_AUTHEN_STEP2.URL,
		templateUrl: kkconst.ROUNTING.NEW_USER_AUTHEN_STEP2.TEMPLATE_URL,
		controller: kkconst.ROUNTING.NEW_USER_AUTHEN_STEP2.CONTROLLER,
		cache : false
	}).state(kkconst.ROUNTING.NEW_USER_AUTHEN_STEP3.STATE, {
		url: kkconst.ROUNTING.NEW_USER_AUTHEN_STEP3.URL,
		templateUrl: kkconst.ROUNTING.NEW_USER_AUTHEN_STEP3.TEMPLATE_URL,
		controller: kkconst.ROUNTING.NEW_USER_AUTHEN_STEP3.CONTROLLER,
		cache : false
	}).state(kkconst.ROUNTING.LOGINSETTING.STATE, {
		url: kkconst.ROUNTING.LOGINSETTING.URL,
		views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.LOGINSETTING.TEMPLATE_URL,
				controller: kkconst.ROUNTING.LOGINSETTING.CONTROLLER
			}
		}
	}).state(kkconst.ROUNTING.TRANSACTION_HISTORY_NDID_AUTHEN.STATE, {
		url: kkconst.ROUNTING.TRANSACTION_HISTORY_NDID_AUTHEN.URL,
		views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.TRANSACTION_HISTORY_NDID_AUTHEN.TEMPLATE_URL,
				controller: kkconst.ROUNTING.TRANSACTION_HISTORY_NDID_AUTHEN.CONTROLLER
			}
		},
		cache: false
	}).state(kkconst.ROUNTING.TRANSACTION_HISTORY_NDID_AUTHEN_DETAIL.STATE, {
		url: kkconst.ROUNTING.TRANSACTION_HISTORY_NDID_AUTHEN_DETAIL.URL,
		views: {
			'appContainerView': {
				templateUrl: kkconst.ROUNTING.TRANSACTION_HISTORY_NDID_AUTHEN_DETAIL.TEMPLATE_URL,
				controller: kkconst.ROUNTING.TRANSACTION_HISTORY_NDID_AUTHEN_DETAIL.CONTROLLER
			}
		}
	});
   // set default route path
  	$urlRouterProvider.otherwise(kkconst.ROUNTING.MENU.URL);
  	
 
  	
});

