angular.module('service.suitabilityScore', [])
		.service('suitabilityScoreService',function(mainSession, $q, $translate,$ionicPopup, invokeService,kkconst) {
        
        'use strict';
    


    this.inquirySuitabilityScore = function() {
        
        var deferred = $q.defer();
        var request = {};
        request.params = {};
        request.params.language = mainSession.lang;
        request.actionCode = 'ACT_CURRENT_CUST_SUIT_SCORE';
        request.procedure = 'getCurrentCustSuitProcedure';

        request.onSuccess = function(result) {
            deferred.resolve(result.responseJSON)
        };
            request.onFailure = function(result) {
            deferred.resolve(result.responseJSON)
        };
        invokeService.executeInvokePublicService(request,{adapter:kkconst.FUND_CONNEXT_ADAPTER});
          return deferred.promise;

    };
            


    this.getRiskTable = function(){
               
                var deferred = $q.defer();
                var request = {};
                request.params = {  "actionCode" : "fund_risk_table" };
                request.actionCode = 'ACT_RBAC_GET_INFORMATION_SERVICE';
                request.procedure = 'getFundRisktableProcedure';

                request.onSuccess = function(result) {
                    deferred.resolve(result.responseJSON)
                };
                request.onFailure = function(result) {
                    deferred.resolve(result.responseJSON)
                };
                invokeService.executeInvokePublicService(request,{adapter:'utilityAdapter'});

                return deferred.promise;
            }
		})	
        
        .service('suitabilityQuestionService',function(mainSession, $q, $translate,$ionicPopup, invokeService, displayUIService,kkconst) {

                   'use strict';
                 this.inquirySuitQuestion = function() {
                        var deferred = $q.defer();
                        var request = {};
                        request.params = {};
                        request.params.language = mainSession.lang;
                        request.actionCode = 'ACT_INQUIRY_SUITABILIY_QUESTION';
                        request.procedure = 'getQuestionProcedure';
                
                        request.onSuccess = function(result) {
                            deferred.resolve(result.responseJSON)
                        };
                         request.onFailure = function(result) {
                            deferred.resolve(result.responseJSON)
                        };
                        invokeService.executeInvokePublicService(request,{adapter:kkconst.FUND_CONNEXT_ADAPTER});
                
                        return deferred.promise;
                    
   
                    };

                     this.submitAnswer = function(param){
                        var deferred = $q.defer();
                        var request = {};
                        request.params = {};
                        request.params.language = mainSession.lang;
                        request.params.submitAnswers = param;
                        request.actionCode = 'ACT_SUBMIT_SUITABILITY_ANSWER';
                        request.procedure = 'submitSuitAnswerProcedure';
                
                        request.onSuccess = function(result) {
                            deferred.resolve(result.responseJSON)
                        };
                         request.onFailure = function(result) {
                            deferred.resolve(result.responseJSON)
                        };
                        invokeService.executeInvokePublicService(request,{adapter:kkconst.FUND_CONNEXT_ADAPTER});
                
                        return deferred.promise;
                 };

    
              
                this.getResultPreview = function () {
                    return this.resultPreview;
                };


                this.setResultPreview = function (data) {
                    this.resultPreview = data;
                };


	
		});