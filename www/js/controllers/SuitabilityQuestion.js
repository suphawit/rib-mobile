angular.module('ctrl.suitabilityQuestion', [])
        .controller('SuitabilityQuestionCtrl', function ($scope,popupService, kkconst, $translate, $ionicModal, suitabilityQuestionService, $state) {

                "use strict";
                
                var obj = {};
                var lengthQuestion;
                var resultData = [];
                var resultSubmit = [];
                var listAnswerDetail = {};
                var suitAnswerSelect = {};
                $scope.suitQuestionResult = {};
                $scope.suitAnswerShow = {  id: '' };
                $scope.suitAnswerCheckBox = [];
                $scope.ngcheck = false;
                $scope.isDisabled = true;
                $scope.suitIndex = 0;
              

                var getSuitQuestion = function () {
                       
                        suitabilityQuestionService
                        .inquirySuitQuestion()
                        .then(function(resp){
                        var respStatus = resp.result;
                        if (respStatus.responseStatus.responseCode === kkconst.success) {
                                $scope.suitQuestionResult  = respStatus.value.questionDetailList; 
                                lengthQuestion = $scope.suitQuestionResult.length;
                        }else{
                               // popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE,respStatus.responseCode);
                                popupService.showErrorPopupMessage('alert.title', respStatus.responseStatus.errorMessage);
                        }
                        });

                };


                var submitAnswer = function () {
                        
                        $scope.suitIndex = lengthQuestion - 1;
                        popupService.showConfirmPopupMessageCallback('button.confirm', 'label.myMutualFundConfirmSubmit', function (ok) {
                        if (ok) {
                                suitabilityQuestionService
                                .submitAnswer(resultSubmit)
                                .then(function(resp){
                                       
                                        var respStatus = resp.result.responseStatus;
                                        if (respStatus.responseCode === kkconst.success) {
                                                popupService.showErrorPopupMessage('label.success', 'label.myMutualFundQuestionSuccess');
                                                 $state.go(kkconst.ROUNTING.SUITABILITY_LISK.STATE);
                                        }else{
                                               // popupService.showErrorPopupMessage('label.fundTransferFailStatus', respStatus.responseCode);
                                               popupService.showErrorPopupMessage('alert.title', respStatus.errorMessage);
                                        }
                                });

                        } else {
                                $scope.suitIndex = lengthQuestion - 1;
                                $scope.isDisabled  = false;
                                $scope.ngcheck = true;
                        }
                        });
                };

               

                $scope.setSelectedAnswer = function (answer) {   
                      
                        suitAnswerSelect  = answer;
                        $scope.isDisabled = false;
                        listAnswerDetail = $scope.suitQuestionResult[$scope.suitIndex].answerDataList;
                        var listAnswerDetailType = $scope.suitQuestionResult[$scope.suitIndex].type;
                   
                        for (var i = 0; i < listAnswerDetail.length; i++) {
                                
                                if ( (listAnswerDetailType === 'R') && (listAnswerDetail[i].id == suitAnswerSelect)) {
                                        $scope.suitAnswerShow.id      =  listAnswerDetail[i].id;
                                        resultData[$scope.suitIndex]  = [listAnswerDetail[i].id];
                                        
                                }else if( (suitAnswerSelect.checked === true) && (listAnswerDetail[i].id == suitAnswerSelect.id) ){
                                        $scope.suitAnswerCheckBox.push(listAnswerDetail[i].id);
                                        resultData[$scope.suitIndex]  =  $scope.suitAnswerCheckBox;
                                
                                }else if((suitAnswerSelect.checked === false) && (listAnswerDetail[i].id == suitAnswerSelect.id) ){
                                        $scope.suitAnswerCheckBox.pop(listAnswerDetail[i].id);
                                        resultData[$scope.suitIndex]  =  $scope.suitAnswerCheckBox;
                                        if($scope.suitAnswerCheckBox.length === 0){
                                            $scope.isDisabled = true;
                                        }
                                }
                        };
                      
                 };

                
                 var checkState = function () {
                   
                        $scope.ngcheck = false;
                        if ($scope.suitIndex < 0) {  
                                $state.go(kkconst.ROUNTING.SUITABILITY_LISK.STATE);   

                        }else if($scope.suitIndex === (lengthQuestion - 1)) {
                                $scope.ngcheck = true;
                                $scope.isDisabled = true;
                               
                        }else if ($scope.suitIndex === lengthQuestion) { 
                                $scope.ngcheck = true;
                                for (var i = 0; i < lengthQuestion  ; i++) {
                                        obj = {
                                                questionId:  $scope.suitQuestionResult[i].id,
                                                answerId: resultData[i]
                                        };
                                        resultSubmit.push(obj);
                                }
                                resultSubmit = resultSubmit.slice(0, lengthQuestion);
                                submitAnswer();
                        }  

                        if ((resultData[$scope.suitIndex] !== undefined) && (resultData[$scope.suitIndex].length !== 0)) {
                                $scope.isDisabled = false;
                                $scope.setSelectedAnswer(resultData[$scope.suitIndex]);
                        }else{
                                $scope.isDisabled = true;
                        }
                };


                $scope.onSubmit = function () {
                         checkState();
                         $scope.suitIndex = $scope.suitIndex + 1;
                         checkState();
                };

                
                $scope.onPreview = function () {
                        $scope.ngcheck = false;   
                        checkState();
                        $scope.suitIndex = $scope.suitIndex - 1;
                        checkState();        
                };

                
                getSuitQuestion();


        });

