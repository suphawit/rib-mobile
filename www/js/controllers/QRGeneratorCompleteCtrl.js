angular.module('ctrl.qrgeneratorcomplete',['monospaced.qrcode'])
.controller('QRGeneratorCompleteCtrl', function($scope,$timeout,$ionicPlatform,$ionicModal,QRScannerService,kkconst,popupService,rtprequestService,generalService ) {
  
    $scope.QRCodeData = '';
    $scope.QRCodeDetail = {};

    var data = QRScannerService.getQRGeneratorObj();
    $scope.QRCodeData = data.value;
    $scope.QRCodeDetail = {
        anyIDValue: data.anyIDValue,
        amount: data.amount,
        accountName: data.accountName
    };
    $scope.QRCodeDetail.anyIDType = data.anyIDType;
    
    angular.element(document).ready(function () {
        setLogoPositionForPreView();
        drawCanvas();
    });
    
    function drawCanvas(){

        var canvas = document.getElementById("QRFrameCanvas");
        canvas.style.display = "none";
        var _qrCodeData = $scope.QRCodeDetail;
       
        var ctx = canvas.getContext("2d");
        
        var bgSize = {w: 414, h: 621};
        var qrSize = {w: 250, h: 250};
        var logoSize = {w: 48, h: 35};

        var renderImg = [
            {path: "images/template_QR_mobile.png",x:0,y: 0,width: bgSize.w, height: bgSize.h},
            {path: document.getElementById('qrCode').getElementsByTagName('a')[0].href,x: getWidthMiddlePosition(qrSize.w),y: getHeightMiddlePosition(qrSize.h),width: qrSize.w, height: qrSize.h},
            {path: "images/Thai_QR_Payment_Logo_tranparent.png",x: getWidthMiddlePosition(logoSize.w),y:  getHeightMiddlePosition(logoSize.h),width: logoSize.w,height:logoSize.h}
        ];
        var renderTxt = [
            {text:_qrCodeData.accountName,lineWidth: 4,font:'30px RSU_BOLD',x:canvas.width / 2,y: (canvas.height/2)+ (qrSize.h/2)},
            {text:generalService.formatNumber(parseFloat(_qrCodeData.amount)),lineWidth: 4,font:'30px RSU_BOLD',x: canvas.width / 2,y: (canvas.height/2)+ (qrSize.h/2) + 87},
            {text:'บาท(Baht)',lineWidth: 2,font:'20px RSU_BOLD',x: canvas.width / 2,y:(canvas.height/2)+ (qrSize.h/2) + 112}
        ];

        var LoadedImgs=[];
        var count=0;
        startLoadingAllImages(imagesAreNowLoaded);

        function getWidthMiddlePosition(objSize){
            return (canvas.width / 2) - (objSize / 2);
        }

        function getHeightMiddlePosition(objSize){
            return (canvas.height / 2) - (objSize / 2) + 20;
        }

        function startLoadingAllImages(callback){

            for (var i=0; i<renderImg.length; i++) {
                var img = new Image();
                LoadedImgs.push(img);
                img.onload = function(){ 
                    count++; 
                    if (count>=renderImg.length ) {
                    callback();
                    }
                };
                img.onerror=function(){
                };
                img.crossOrigin = 'Anonymous';
                img.src = renderImg[i].path;
            }      
        }

        function imagesAreNowLoaded(){
            for(var i = 0; i< renderImg.length; i++){
                ctx.drawImage(LoadedImgs[i],renderImg[i].x,renderImg[i].y,renderImg[i].width,renderImg[i].height);
            }

            var renderTxtLength = (_qrCodeData.amount != null)? renderTxt.length:1;
            var heightAccountNameTxt = (_qrCodeData.amount != null)? 55:80
            for(var i = 0; i< renderTxtLength; i++){
                ctx.lineWidth=renderTxt[i].lineWidth;
                ctx.fillStyle="#000000";
                ctx.font=renderTxt[i].font;
                ctx.textAlign = "center";

                renderTxt[0].y = renderTxt[0].y + heightAccountNameTxt;
                ctx.fillText(renderTxt[i].text,renderTxt[i].x,renderTxt[i].y);
            }
        }
	}

    $scope.saveImage = function(){
        $ionicPlatform.ready(function() {
            var permissions = window.cordova.plugins.permissions;
            permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function( status ){
                if ( status.hasPermission ) {
                    
                    $scope.callSaveImgPlugin();
                }
                else {
                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status) {
                        if( status.hasPermission ) {
                            $scope.callSaveImgPlugin();
                        }else {
                            popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.saveImgFail')
                        }
                      }, null);
                }
              });
                    
        }); 
    }

    $scope.callSaveImgPlugin = function(){
        window.canvas2ImagePlugin.saveImageDataToLibrary(
                function(msg){
                    popupService.showErrorPopupMessage('label.success', 'label.saveImgSuccess');
                }, 
                function(err){ 
                    popupService.showErrorPopupMessage(kkconst.ALERT_WARNING_TITLE, 'label.saveImgFail'); 
                },
               document.getElementById("QRFrameCanvas")
            ); 
    }

    $scope.getAnyIDIcon = rtprequestService.getAnyIDIcon;
    $scope.getAnyIDIconColor = rtprequestService.getAnyIDIconColor;
    $scope.getAnyIDLabelName = rtprequestService.getAnyIDLabelName;


    function setLogoPositionForPreView(){
        var divWidth = document.getElementById('QRGroup').offsetWidth;
        $scope.left = (divWidth/2)- (35/2) + "px";
    }

    $scope.shareReceipt = function () {
        var canvas = document.getElementById("QRFrameCanvas");
        var shareImg = canvas.toDataURL('image/png');
        window.plugins.socialsharing.share(null, null, shareImg, null);
    };
    
})

