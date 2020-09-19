//
//  PAFaceDetectMainVC.m
//  AceFaceDetectDemo
//
//  Created by 刘沛荣 on 2018/4/16.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#import "PAFaceDetectMainVC.h"
#import <QuartzCore/QuartzCore.h>
#import "SuccessVC.h"
#import "PAZCLDefineTool.h"
#import <AVFoundation/AVFoundation.h>
#import <CoreVideo/CVPixelBuffer.h>
#import <AVFoundation/AVAssetWriterInput.h>
#import "AppDelegate.h"
#import "PATimeCounter.h"
#import "APIManager.h"
#import "SVProgressHUD.h"
#import <sys/utsname.h>
#import "UIImage+PAFixOrientation.h"
#import "PAFaceDetectorManager.h"
#import <UIKit/UIDevice.h>
#import "ACEPlayAudio.h"
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonHMAC.h>
#import "PAAuthorizationKit.h"
#import "AceVideoManager.h"
#include <stdio.h>
#include <stdlib.h>
#include <vector>
#include <fstream>
#import "PAFaceDetectorSetting.h"

@interface BufferType : NSObject

@property (nonatomic ,assign) CMSampleBufferRef sampleBuffer;

@end

@implementation BufferType

@end

#define TimeDown @"15"

@interface PAFaceDetectMainVC ()<PAFaceDetectorManagerDelegate,PATimeCounterDelegate,VideoManagerDelegate>
{
    AppDelegate *_appdelegate;
    
    BOOL _soundContor;
    BOOL _countDown;
    BOOL _isTimeOut;
    
    BOOL _isFace;
    BOOL _isLive;
    BOOL _isDetection;
    
    DemoPlanType _motionType;
    PAFaceDetectType _detectionType;
    
    
    PAFaceDetectionFrame *_retainFrame;
    PAFaceDetectionFrame *_validImageInfo;
    
    dispatch_queue_t _detectQueue;
    dispatch_semaphore_t _semaphore;
    
    UIImage *headImg;
    UIImage *mouthImg;
    UIImage *eyeImg;
    
    NSUInteger _detectCount;
    UIInterfaceOrientation _currentInterfaceOrientation;
    
}
@property (nonatomic,strong)  NSMutableArray *arrimgBuffer;
@property (nonatomic ,strong) PAFaceDetectorManager *detector;
@property (nonatomic, strong) AceVideoManager *videoManager;

@property (nonatomic, weak) id <PADetectionDelegate>delegate;


@property (nonatomic, strong)  UIView *pilotLightView;
@property (nonatomic, strong)  UIImageView *regedImageView;
@property (nonatomic, strong)  UILabel *hintLabel;
@property (nonatomic, strong)  UILabel *timeLabel;
@property (nonatomic, strong)  UILabel *stateLabel;
@property (nonatomic, strong)  UIImageView *faceCheckBackground;
@property (nonatomic, strong)  UIImageView *logoImage;
//测试专用
@property (nonatomic, strong)  UILabel *eyeDisLabel;
@property (nonatomic, strong)  UILabel *blurLabel;
@property (nonatomic, strong)  UILabel *bringhtLabel;
@property (nonatomic, strong)  UILabel *yrpLabel;


@property (nonatomic ,strong) UIButton *backButton;
@property (nonatomic ,strong) UIButton *backButtonBg;

@property (nonatomic, strong) PATimeCounter *timerManager;

@property (nonatomic, strong) UIView *userGuideView;
@property (nonatomic, strong) UIButton *guanbiBt;
@property (nonatomic, strong) UIImageView *userGuideImg;

@property (nonatomic, strong) NSMutableArray *actionArray;
@property (nonatomic, strong) NSMutableArray *actionImgArr;


@property (nonatomic, strong) __attribute__((NSObject)) CMSampleBufferRef currentSampleBuffer;

@end

@implementation PAFaceDetectMainVC

#define APP_ID  @"cab9ee16c7df19edbea9f00f0c2e88bfc86d9df71d404f5a9a25760269921351"
#define APP_KEY  @"1646A8456F00FAEB"
#define Kurl @"https://biap-dev-auth.pingan.com/dev-auth-web/biap/device/v2/activeDeviceAuthInfo"
#define Kappkey @"1646A8456F00FAEB"
#define KappId @"cab9ee16c7df19edbea9f00f0c2e88bfc86d9df71d404f5a9a25760269921351"


@synthesize onSuccessDelegate = _onSuccessDelegate;
static NSBundle *bundle = nil;

- (id)initWithPADetectionWithTheCountdown:(BOOL)countDown detectType:(DemoPlanType)detectType voiceSwitch:(BOOL)voiceSwitch
{
    self = [super init];
    if (self) {
        _countDown = countDown;
        _soundContor = voiceSwitch;
        _isDetection = NO;
        _isTimeOut = NO;
        _motionType = detectType;
        if (_detectQueue == nil) {
            _detectQueue = dispatch_queue_create("com.PINGAN.detect", DISPATCH_QUEUE_SERIAL);
        }
        if (!_semaphore) {
            _semaphore = dispatch_semaphore_create(5);
        }
        
    }
    
    return self;
}

//重置 随机动作的数组

-(void)resetActionArray{
    
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    NSArray *demoMotionArr = [userDefaults objectForKey:@"DemoMotionType"];
    self.actionArray = [NSMutableArray array];
//    if (demoMotionArr.count>0) {
//
//        for (NSString *motionType in demoMotionArr) {
//            if (![motionType isEqualToString:@"1007"]) {
//                [self.actionArray addObject:motionType];
//            }
//        }
//        if (![self.actionArray containsObject:@"1001"]) {
//            [self.actionArray addObject:@"1001"];
//        }
//
//    }else{
//        self.actionArray = [NSMutableArray arrayWithObjects:@"1001",@"1002",@"1003",@"1004",@"1005",@"1006", nil];
//    }
    
    self.actionArray = [NSMutableArray arrayWithObjects:@"1001",@"1004",@"1005",@"1006", nil];
    
}

//随机一个动作
- (PAFaceDetectType)randActionType{
    
    if (self.actionArray.count>0) {
        
        //如果有1001 必先提取1001
        if ([self.actionArray containsObject:@"1001"]) {
            
            [self.actionArray removeObject:@"1001"];
            return PADetectType_NORMAL;
            
        }
        NSInteger type = arc4random()%(self.actionArray.count);
        PAFaceDetectType detectionType = (PAFaceDetectType)[self.actionArray[type] integerValue];
        [self.actionArray removeObjectAtIndex:type];
        _detectionType = detectionType;
        return detectionType;
        
    }
    return PADetectType_NORMAL;
    
}

extern bool setSdkAuth(std::string authorization);

- (void)viewDidLoad {
    
    [super viewDidLoad];
    _appdelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    [self initBar];
    
    
    //授权
    [PAAuthorizationKit applicationAuthorizationWithUrl:Kurl AppKey:Kappkey AppId:KappId completion:^(NSString *code, NSString *msg) {
       
        NSLog(@"completion-code--msg:%@--%@",code,msg);
        if ([code intValue] == 0) {
            NSLog(@"SDK can be used normally");
        }else{
            NSLog(@"SDK is not working properly");
        }
        
    }];
    
    /*如果需要日记上传 则可以打开 需要与本团队确认 后台是否已经上线*/
    [PAFaceDetectorManager setApp_id:APP_ID setApp_key:APP_KEY url:@"" success:^(id responseObject) {
        
        NSLog(@":The configuration environment is successful：%@",responseObject);
        
    } failure:^(NSError *error) {
        
        NSLog(@":Configuration environment failed：%@",error.description);
        
    }];
    [self.detector addLogNotification];
    [self resetActionArray];
    PAFaceDetectType detectionType = [self randActionType];
    [self.detector resetWithFaceDetectType:detectionType compareVerifySwitch:NO liveVerifySwitch:[PAFaceDetectorSetting share].liveSwitch];
}

-(PAFaceDetectorManager *)detector{
    
    if (!_detector) {
        
        //初始化检测器
        NSDictionary *options ;
        
        NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
        NSString *planType = [userDefaults objectForKey:@"DemoPlanType"];
        NSArray *demoMotionArr = [userDefaults objectForKey:@"DemoMotionType"];
        
        
        if ([planType isEqualToString:@"Option 1: Random two actions + silent living body + back end living body"]) {
            
            options = [[PAFaceDetectorSetting share] getPlanADefaultParameters];
            
        }else if ([planType isEqualToString:@"Option 2: Random two actions + back end living body"]){
            
            options = [[PAFaceDetectorSetting share] getPlanBDefaultParameters];
            
        }else{
            
            BOOL live_Switch = NO;
            BOOL live_Is2M = NO;
            
            if (demoMotionArr && demoMotionArr.count>0 ) {
                if ([demoMotionArr containsObject:@"1007"]) {
                    live_Switch = YES;
                }else{
                    live_Switch = NO;
                }
            }
            options = [NSDictionary dictionaryWithObjectsAndKeys:
                       
                       [NSNumber numberWithFloat:0.1],PAThreshold_CloseEye,
                       [NSNumber numberWithFloat:-1.2],PAThreshold_OpenEye,
                       [NSNumber numberWithFloat:3],PAThreshold_Paper,
                       [NSNumber numberWithFloat:-3.84],PAThreshold_MouthOcc,
                       [NSNumber numberWithFloat:3],PAThreshold_Paper,
                       [NSNumber numberWithFloat:-0.97],PAThreshold_EyeOcc,
                       [NSNumber numberWithFloat:0.45],PAThreshold_Feature,
                       [NSNumber numberWithFloat:0.5],PAThreshold_Live,
                       [NSNumber numberWithBool:live_Switch],PAThreshold_Live_Switch,
                       [NSNumber numberWithBool:live_Is2M],PAThreshold_Live_Is2M,
                       [NSNumber numberWithBool:YES],PAThreshold_Log_Switch,
                       [NSNumber numberWithFloat:10],PAThreshold_PoseCenter,
                       [NSNumber numberWithFloat:1.7],PAThreshold_MouthOpen,
                       [NSNumber numberWithFloat:-1],PAThreshold_MouthClose,
                       [NSNumber numberWithFloat:-0.6],PAThreshold_MouthConfidence,
                       [NSNumber numberWithFloat:18],PAThreshold_Shake,
                       [NSNumber numberWithFloat:18],PAThreshold_ShakeLeft,
                       [NSNumber numberWithFloat:18],PAThreshold_Shake,
                       [NSNumber numberWithFloat:18],PAThreshold_ShakeRight,
                       [NSNumber numberWithFloat:0.3],PAThreshold_Far,
                       [NSNumber numberWithFloat:0.8],PAThreshold_Close,
                       [NSNumber numberWithFloat:15],PAThreshold_Blurness,
                       [NSNumber numberWithFloat:220],PAThreshold_Brightness,
                       [NSNumber numberWithFloat:65],PAThreshold_Dark,
                       [NSNumber numberWithFloat:130],PAThreshold_BetweenPoints,
                       [self getSuccessPaht],PAThreshold_Log_PATH,
                       nil];
            
        }
        _detector = [PAFaceDetectorManager initDetectorWithBundleName:@"ACEFaceKit" detectorOfOptions:options andSetDelegate:self completion:^(BOOL successed) {
            
            if (successed) {
                NSLog(@"SDK Initialization Successful");
                [self createCamerManager];
                _isTimeOut = NO;
                _isDetection = YES;
                [self.timerManager start];
            }
            
        }];
    }
    return _detector;
}


/**
 获取存放Log的路径
 @return 路径
 */
-(NSString*)getSuccessPaht{
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    
    NSString*logDirectory = [NSString stringWithFormat:@"%@/PALog",paths[0]];
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    BOOL fileExists = [fileManager fileExistsAtPath:logDirectory];
    
    if (!fileExists) {
        NSError *error;
        [fileManager createDirectoryAtPath:logDirectory  withIntermediateDirectories:YES attributes:nil error:&error];
        if (error) {
            NSLog(@"SDK-LOGINFO-get path faile :%@",error.description);
            return nil;
        }
    }
    return logDirectory;
}


-(void)viewDidAppear:(BOOL)animated{
    
    [super viewDidAppear:animated];
    
}

-(void)viewWillDisappear:(BOOL)animated{
    
    [super viewWillDisappear:animated];
    
}

#pragma mark --- 相机管理

-(void)createCamerManager{
    
    if (!_videoManager) {
        self.videoManager = [AceVideoManager videoPreset:AVCaptureSessionPreset640x480
                                          devicePosition:AVCaptureDevicePositionFront delegate:self
                             ];
    }
    [self.videoManager videoPermission];
    [self.videoManager startRunning];//开启摄像头
    
}

/*!
 *  相机授权处理（sdk中提供相机用到）
 */
- (void)onPermissionOfCamer:(AVAuthorizationStatus)camerState{
    
    [self setupPreviewView];
    
}

/*!
 *  视频流处理的回调，相机获得的视屏流会传出来（使用sdk提供相机需要）
 */
- (void)onCaptureOutput:(AVCaptureOutput *)captureOutput
  didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer
         fromConnection:(AVCaptureConnection *)connection{
    
    @autoreleasepool {
        @synchronized(self) {
            if (sampleBuffer) {
                [self detectFaceWithSampleBuffer:sampleBuffer];
            }
        }
    }
    
}

- (void)detectFaceWithSampleBuffer:(CMSampleBufferRef)sampleBuffer{
    
    _detectCount++;
    if (_detectCount%2 == 0) {
        return;
    }
    
    if (_isDetection && _detectCount>20) {
        
        __weak typeof(self) weakSelf = self;
        self.currentSampleBuffer = sampleBuffer;
        
        dispatch_async(_detectQueue, ^{
            @autoreleasepool {
                __strong typeof(weakSelf) strongSelf=weakSelf;
                __block CMSampleBufferRef matchSampleBuffer = NULL;
                @synchronized( strongSelf ) {
                    matchSampleBuffer = self.currentSampleBuffer;
                    if ( matchSampleBuffer ) {
                        CFRetain(matchSampleBuffer);
                        self.currentSampleBuffer = NULL;
                    }
                }
                if (matchSampleBuffer) {
                    // 获取当前设备方向
                    ACEDeviceOrientation deviceOrientation;
                    if (strongSelf->_currentInterfaceOrientation == UIInterfaceOrientationLandscapeLeft) {
                        deviceOrientation = PADeviceOrientationLandscapeLeft;
                    }else if (strongSelf->_currentInterfaceOrientation == UIInterfaceOrientationLandscapeRight){
                        deviceOrientation = PADeviceOrientationLandscapeRight;
                    }else{
                        deviceOrientation = PADeviceOrientationPortrait;
                    }
                    [strongSelf.detector detectWithSampleBuffer:matchSampleBuffer orientation:deviceOrientation];
                }
                self.currentSampleBuffer = NULL;
            }
        });
    }
}

-(void)viewDidDisappear:(BOOL)animated

{
    [super viewDidDisappear:animated];
    
}

- (UIStatusBarStyle)preferredStatusBarStyle{
    
    return UIStatusBarStyleLightContent;
    
}

- (void)initBar{

    UIView *backView = [[UIView alloc]initWithFrame:self.view.bounds];
    [backView setBackgroundColor:[UIColor clearColor]];
    [self.view addSubview:backView];

    int barH;
    int logowidth;
    int logoHeigth;
    int spaceLogo;
    if([[_appdelegate identifier] isEqualToString:@"iPhoneX"]
       || [[_appdelegate identifier] isEqualToString:@"iPhoneXR"]
       || [[_appdelegate identifier] isEqualToString:@"iPhoneXS"]
       || [[_appdelegate identifier] isEqualToString:@"iPhoneXSMAX"]){
        barH = 64;
        logowidth = 110*2/5;
        logoHeigth = 100*2/5;
        spaceLogo = (barH/2)-3;
    }else{
        barH = 64;
        logowidth = 55;
        logoHeigth = 50;
        spaceLogo = (barH/2)-15;
    }
    
    /* Fix for iPad */
    int thisMaxX = 0;
    int thisScreenWidth = kScreenWidth;
    int thisScreenHeight = kScreenHeight;
    int viewBoundSize = self.view.bounds.size.width;
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
    {
        thisScreenWidth = kScreenHeight;
        thisScreenHeight = kScreenWidth;
        viewBoundSize = self.view.bounds.size.height;
        thisMaxX = 100;
    }
    
    UIView *bar = [[UIView alloc]init];
    bar.backgroundColor = [UIColor colorWithRed:0/255.0 green:154/255.0 blue:199
                           /255.0 alpha:1];
    [bar setFrame:CGRectMake(0, 0, thisScreenWidth , barH)];
    
    UIImageView *logoImage = [[UIImageView alloc]init];
    logoImage.frame = CGRectMake((thisScreenWidth/2)-(logowidth/2), spaceLogo , logowidth , logoHeigth);
    NSString *imgPathLogo = [[NSBundle mainBundle]pathForResource:@"logoK_w" ofType:@"png"];
    NSData *dataLogo = [NSData dataWithContentsOfFile:imgPathLogo];
    [logoImage setImage:[UIImage imageWithData:dataLogo]];
    [bar addSubview:logoImage];
   
    UIView *subbar = [[UIView alloc]init];
    subbar.backgroundColor = [UIColor whiteColor];
    subbar.layer.borderWidth = 1;
    subbar.layer.borderColor = [UIColor colorWithRed:209/255.0 green:211/255.0 blue:212
                                /255.0 alpha:1].CGColor;
    [subbar setFrame:CGRectMake(0, barH, thisScreenWidth , 44)];

    self.backButton.frame =CGRectMake(20, bar.bounds.size.height-10-20, 20*0.6315, 20);
//    [bar addSubview:self.backButton];
//    self.backButtonBg.frame =CGRectMake(10, 25, 50*0.6315, 50);
//    [bar addSubview:self.backButtonBg];

    UILabel *title = [[UILabel alloc]init];
    [title setText:[self get:@"faceDetection" alter:@""]];
    [title setFrame:CGRectMake(viewBoundSize/2-100, (44/2) - (CGRectGetHeight(self.backButton.frame)/2), 200, CGRectGetHeight(self.backButton.frame))];
    [title setTextColor:PAColorWithRGB(0, 154, 199, 1)];
    [title setTextAlignment:NSTextAlignmentCenter];
    [title setFont:[UIFont boldSystemFontOfSize:21]];
    [subbar addSubview:title];

    UIView *whileTop = [[UIView alloc]initWithFrame:CGRectMake(0, CGRectGetMaxY(bar.frame)-20 , thisScreenWidth, CGRectGetMaxY(bar.frame)+thisScreenHeight*0.03)];
    [whileTop setBackgroundColor:[UIColor colorWithRed:245/255.0 green:243/255.0 blue:243
                                  /255.0 alpha:1]];
    [backView addSubview:whileTop];
    
    //倒计时
    UIImageView *timeBackgroud = [[UIImageView alloc]init];
    timeBackgroud.frame = CGRectMake(thisScreenWidth-(thisMaxX+75),CGRectGetMaxY(bar.frame)+30+40 , thisScreenWidth*0.138 , thisScreenWidth*0.138*0.596);
    NSString *imgPath = [[NSBundle mainBundle]pathForResource:@"倒计时外框@3x" ofType:@"png"];
    NSData *data = [NSData dataWithContentsOfFile:imgPath];
    [timeBackgroud setImage:[UIImage imageWithData:data]];

    [self.timeLabel setTextColor:PAColorWithRGB(67, 155, 255, 1)];
    [self.timeLabel setTextAlignment:NSTextAlignmentCenter];
    [self.timeLabel setFont:[UIFont systemFontOfSize:18]];
    [self.timeLabel setFrame:CGRectMake(thisScreenWidth-(thisMaxX+73)+5,CGRectGetMaxY(bar.frame)+30+40+2, thisScreenWidth*0.138-10 , thisScreenWidth*0.138*0.596-4)];
    
//    UIButton *switch_voice = [UIButton buttonWithType:UIButtonTypeCustom];
//    [switch_voice setFrame:CGRectMake(kScreenWidth-32-kScreenWidth*0.138, CGRectGetMinY(timeBackgroud.frame), kScreenWidth*0.138 , kScreenWidth*0.138*0.596)];
//    [switch_voice setImage:[UIImage imageWithData:[NSData dataWithContentsOfFile:[[NSBundle mainBundle]pathForResource:@"语音按钮ON@3x" ofType:@"png"]]]forState:UIControlStateNormal];
//    [switch_voice addTarget:self action:@selector(switchVoice:) forControlEvents:UIControlEventTouchDown];
//    [switch_voice setHidden:NO];
//    [backView addSubview:switch_voice];

    //采集框
    if (!self.faceCheckBackground) {
        self.faceCheckBackground = [[UIImageView alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(whileTop.frame), thisScreenWidth, thisScreenWidth*0.893)];
        [self.faceCheckBackground setImage:[UIImage imageWithData:[NSData dataWithContentsOfFile:[[NSBundle mainBundle]pathForResource:@"检测到人脸框X@3x" ofType:@"png"]]]];
        [backView addSubview:self.faceCheckBackground];
    }
    [backView addSubview:self.timeLabel];
    [backView addSubview:timeBackgroud];

    UIView *whileBottom = [[UIView alloc]initWithFrame:CGRectMake(0, CGRectGetMaxY(self.faceCheckBackground.frame) , thisScreenWidth,thisScreenHeight-CGRectGetMaxY(self.faceCheckBackground.frame) )];
    [whileBottom setBackgroundColor:[UIColor colorWithRed:245/255.0 green:243/255.0 blue:243
                                     /255.0 alpha:1]];
    [backView addSubview:whileBottom];
    [self.stateLabel setFrame:CGRectMake(thisScreenWidth/2-250, self.faceCheckBackground.frame.origin.y + thisScreenWidth*0.893 + 30, 500, 30)];
    [self.stateLabel setTextColor:PAColorWithRGB(0, 154, 199, 1)];
    [self.stateLabel setText:[self get:@"pleaseFaceTheCamera" alter:@""]];
    [self.stateLabel setFont:[UIFont systemFontOfSize:18]];
    [backView addSubview:self.stateLabel];

    [self.timeLabel setText:[NSString stringWithFormat:@"%@S",TimeDown]];
    [self.hintLabel setFrame:CGRectMake(thisScreenWidth/2-100, CGRectGetMaxY(self.faceCheckBackground.frame)+20, 200, 30)];
    
    [backView addSubview:bar];
    [backView addSubview:subbar];

//    [self.eyeDisLabel setFrame:CGRectMake( switch_voice.frame.origin.x-30, 60, 150, 30)];
//    [backView addSubview:self.eyeDisLabel];
//    //    [self.eyeDisLabel setHidden:YES];
//
//    [self.blurLabel setFrame:CGRectMake(switch_voice.frame.origin.x-30, 90, 150, 30)];
//    [backView addSubview:self.blurLabel];
//    //    [self.blurLabel setHidden:YES];
//
//    [self.bringhtLabel setFrame:CGRectMake(switch_voice.frame.origin.x-30, 120, 150, 30)];
//    [backView addSubview:self.bringhtLabel];
//    [self.bringhtLabel setHidden:YES];
//
//    [self.yrpLabel setFrame:CGRectMake(switch_voice.frame.origin.x-50, 150, 150, 30)];
//    [backView addSubview:self.yrpLabel];
//    [self.yrpLabel setHidden:YES];

    //弹窗
//    self.userGuideView = [[UIView alloc]initWithFrame:CGRectMake(0, barH, self.view.bounds.size.width, self.view.bounds.size.height-barH)];
//    [self.userGuideView setBackgroundColor:[UIColor blackColor]];
//    [self.userGuideView setAlpha:0.4];
//    self.userGuideImg = [[UIImageView alloc] initWithFrame:CGRectMake(30, barH*2, self.userGuideView.frame.size.width-60, (self.userGuideView.frame.size.width-60)*1275/930)];
//    [self.userGuideImg setImage:[UIImage imageWithData:[NSData dataWithContentsOfFile:[[NSBundle mainBundle]pathForResource:@"bg_dialog_tip" ofType:@"png"]]]];
//    self.guanbiBt = [UIButton buttonWithType:UIButtonTypeCustom];
//    [self.guanbiBt setBackgroundImage:[UIImage imageWithData:[NSData dataWithContentsOfFile:[[NSBundle mainBundle]pathForResource:@"关闭icon@3x" ofType:@"png"]]] forState:UIControlStateNormal];
//    [self.guanbiBt setFrame:CGRectMake(self.userGuideImg.frame.origin.x+self.userGuideImg.frame.size.width-20, self.userGuideImg.frame.origin.y-10, 30, 30)];
//    [self.guanbiBt addTarget:self action:@selector(guanbiAct:) forControlEvents:UIControlEventTouchDown];
//    [self.view addSubview:self.userGuideView];
//    [self.view addSubview:self.userGuideImg];
//    [self.view addSubview:self.guanbiBt];

}

-(void)guanbiAct:(UIButton*)bt{
    
    [self.userGuideView removeFromSuperview];
    [self.userGuideImg removeFromSuperview];
    [self.guanbiBt removeFromSuperview];
    
    //开始
    _isTimeOut = NO;
    _isDetection = YES;
    [self.timerManager start];
    
}

-(void)switchVoice:(UIButton*)bt{
    
//    _soundContor = !_soundContor;
//    if (_soundContor) {
//        [bt setImage:[UIImage imageWithData:[NSData dataWithContentsOfFile:[[NSBundle mainBundle]pathForResource:@"语音按钮ON@3x" ofType:@"png"]]] forState:UIControlStateNormal];
//    }else{
//        [bt setImage:[UIImage imageWithData:[NSData dataWithContentsOfFile:[[NSBundle mainBundle]pathForResource:@"语音按钮OFF@3x" ofType:@"png"]]] forState:UIControlStateNormal];
//    }
    
}


/**
 每一帧的数据
 
 @param perFrame 每一帧数据
 */
- (void)onDetectFrame:(PAFaceDetectionFrame *)perFrame {
    
    //耗时操作注意线程管理
    //NSLog(@"DEMO-%s:%ld",__func__,(long)perFrame);
    _retainFrame = perFrame;
}


-(void)faceDetectionFailed:(ErrorType)failedType{
    
    __weak typeof(self) weakSelf = self;
    
    [self.timerManager stop];
    self->_isDetection = NO;
    
    //如果需要日记上传 则可以打开 需要与本团队确认 后台是否已经上线
    if([PAFaceDetectorSetting share].logoSwitch){
        
        if (self->_retainFrame) {
            UIImage *failePerImg = self->_retainFrame.image;
            NSData *failePerImgData = UIImageJPEGRepresentation(failePerImg, 0.9);
            NSString *failePerImgStr = [[APIManager shareInstance] base64EncodedStringData:failePerImgData WithWrapWidth:0];
            NSString *save_img = [NSString stringWithFormat:@"ImgData:%@",failePerImgStr];
            [self.detector fileHandleForWriting:save_img];
        }
        [self.detector whetherOrNotSave:YES];
    }
    NSString *videoName = nil;
    
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    [dict setValue:[NSNumber numberWithInt:failedType] forKey:@"DetectionFailedType"];
    NSString *errStr ;
    switch (failedType) {
        case Detection_ERROR_ForcedOut:
            errStr = @"Forced Exit";
            break;
        case Detection_ERROR_Attack:
            errStr = @"Illegal attack";
            videoName = @"Illegal attack, please try again";
            break;
        case Detection_ERROR_TimeOut:
            errStr = [self get:@"timeOut" alter:@""];
            videoName = @"time_out";
            break;
        case Detection_ERROR_Permission:
            errStr = @"Permission Denied";
            break;
        default:
            break;
    }
//    if (videoName && self->_soundContor) {
//
//        [[ACEPlayAudio sharedAudioPlayer] playWithFileName:videoName];
//
//    }
    MAIN_ACTION((^{
        
        UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:errStr message:[self get:@"timeOutDes" alter:@""] preferredStyle:UIAlertControllerStyleAlert];
        
        __weak typeof(alertVC) weakAlertVC = alertVC;
        
        [alertVC addAction:[UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
            __strong typeof(weakSelf) strongSelf=weakSelf;
            [strongSelf.detector removeLogNotification];
            strongSelf.timerManager.delegate = nil;
            strongSelf->_retainFrame = nil;
            [strongSelf.actionImgArr removeAllObjects];
            [weakSelf dismissViewControllerAnimated:YES completion:^{
            }];
            [self.onSuccessDelegate onSuccessDetectFace:@"cancelled" callBackId:self.callBackId];
            
        }]];
        [alertVC addAction:[UIAlertAction actionWithTitle:@"Retry" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            
            
            __strong typeof(weakAlertVC) strongAlerVC=weakAlertVC;
            __strong typeof(weakSelf) strongSelf=weakSelf;
            [strongSelf.detector addLogNotification];
            [strongSelf.userGuideView removeFromSuperview];
            [strongSelf.userGuideImg removeFromSuperview];
            [strongSelf.guanbiBt removeFromSuperview];
            [strongAlerVC dismissViewControllerAnimated:NO completion:nil];
            strongSelf.timeLabel.text = TimeDown;
            strongSelf->_isTimeOut = NO;
            [strongSelf.actionImgArr removeAllObjects];
            [strongSelf.stateLabel setText:[self get:@"pleaseFaceTheCamera" alter:@""]];
            [strongSelf resetActionArray];
            PAFaceDetectType detectionType = [self randActionType];
            [self.detector resetWithFaceDetectType:detectionType compareVerifySwitch:NO liveVerifySwitch:[PAFaceDetectorSetting share].liveSwitch];
            [strongSelf.timerManager start];
            strongSelf->_isDetection = YES;
            
        }]];
        [self presentViewController:alertVC animated:NO completion:^{
            
        }];
    }));
    
}

-(void)onDetectTip:(EnvironmentalTip)tipType{
    
    NSString *videoName = nil;
    NSString *tip;
    switch (tipType) {
        case PAEnviTip_NOCENTER:
            tip = [self get:@"pleaseFaceTheCamera" alter:@""];
            videoName = @"detection_forward";
            break;
        case PAEnviTip_TOO_CLOSE:
            tip = [self get:@"tooClose" alter:@""];
            videoName = @"detection_near";
            break;
        case PAEnviTip_TOO_FAR:
            tip = [self get:@"tooFar" alter:@""];
            videoName = @"detection_far";
            break;
        case PAEnviTip_TOO_BRIGHT:
            tip = [self get:@"tooBright" alter:@""];
            videoName = @"detection_bright";
            break;
        case PAEnviTip_TOO_DARK:
            tip = [self get:@"tooDark" alter:@""];
            videoName = @"detection_dark";
            break;
        case PAEnviTip_YAW_LEFT:
            tip = [self get:@"pleaseFaceTheCamera" alter:@""];
            videoName = @"detection_forward";
            break;
        case PAEnviTip_YAW_RIGHT:
            tip = [self get:@"pleaseFaceTheCamera" alter:@""];
            videoName = @"detection_forward";
            break;
        case PAEnviTip_PITCH_UP:
            tip = [self get:@"pleaseFaceTheCamera" alter:@""];
            videoName = @"detection_forward";
            break;
        case PAEnviTip_PITCH_DOWN:
            tip = [self get:@"pleaseFaceTheCamera" alter:@""];
            videoName = @"detection_forward";
            break;
        case PAEnviTip_ROLL_LEFT:
            tip = [self get:@"pleaseFaceTheCamera" alter:@""];
            videoName = @"detection_forward";
            break;
        case PAEnviTip_ROLL_RIGHT:
            tip = [self get:@"pleaseFaceTheCamera" alter:@""];
            videoName = @"detection_forward";
            break;
        case PAEnviTip_NO_FACE:
            tip = [self get:@"pleaseFaceTheCamera" alter:@""];
            videoName = @"detection_forward";
            break;
        case PAEnviTip_TOO_FUZZY:
            tip = [self get:@"blurredImage" alter:@""];
            videoName = @"detection_blurness";
            break;
        case PAEnviTip_ILLEGAL:
            tip = @"No real face detected";
            //videoName = @"未检测到真人脸";
            break;
        case PAEnviTip_MULTI_FACE:
            tip = [self get:@"pleaseKeepASingleFace" alter:@""];
            videoName = @"detection_multi_face";
            break;
        case PAEnviTip_MouthOpen:
            tip = @"Please don't open your mouth";
            //videoName = @"请保持单人脸";
            break;
        case PAEnviTip_CoverFace:
            tip = @"Please don't cover your face";
            //videoName = @"请保持单人脸";
            break;
        case PAEnviTip_EyeClose:
            tip = @"Please don't close your eyes";
            //videoName = @"请保持单人脸";
            break;
        case PAEnviTip_NORMAL:
            switch (_detectionType) {
                case PADetectType_NORMAL:
                    break;
                case PADetectType_MouthOpen:
                    tip = [self get:@"openMount" alter:@""];
                    videoName = @"open_mouth";
                    break;
                case PADetectType_EyeBlink:
                    tip = [self get:@"blink" alter:@""];
                    videoName = @"blink_eye";
                    break;
                case PADetectType_HeadShank:
                    tip = [self get:@"shakeHead" alter:@""];
                    videoName = @"shake_head";
                    break;
                case PADetectType_LeftShank:
                    tip = [self get:@"shakeHeadToLeft" alter:@""];
                    videoName = @"left_head";
                    break;
                case PADetectType_RightShank:
                    tip = [self get:@"shakeHeadToRight" alter:@""];
                    videoName = @"right_head";
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    
   
//    if (videoName && _soundContor) {
//        [[ACEPlayAudio sharedAudioPlayer] playWithFileName:videoName];
//    }
    
    MAIN_ACTION(^{
        [self.stateLabel setText:tip];
    });
    
}

//-(void)initialize
//{
//    NSUserDefaults* defs = [NSUserDefaults standardUserDefaults];
//    NSArray* languages = [defs objectForKey:@"AppleLanguages"];
//    NSString *current = [languages objectAtIndex:0];
//    [self setLanguage:current];
//}

/*
 example calls:
 [Language setLanguage:@"it"];
 [Language setLanguage:@"de"];
 */
-(void)setLanguage:(NSString *)language
{
    NSLog(@"preferredLang: %@", language);
    NSString *param;
    if ([language containsString:@"th"]) {
        param = @"th-TH";
    } else {
        param = @"en";
    }
    
    NSString *path = [[ NSBundle mainBundle ] pathForResource:param ofType:@"lproj" ];
    bundle = [NSBundle bundleWithPath:path];
}

-(NSString *)get:(NSString *)key alter:(NSString *)alternate
{
    return [bundle localizedStringForKey:key value:alternate table:nil];
}



-(void)onDetectSuccess:(PAFaceDetectionFrame *)validFrame currentFaceDetectionState:(PAFaceDetectType)currentState{
    
    if (!_isDetection) {
        return;
    }
    
    __weak typeof(self) weakSelf = self;
    
    if (currentState == PADetectType_NORMAL) {
        //保存这帧作为外送图片
        _validImageInfo = validFrame;
        
        //判断活体
        NSLog(@"liveType:%f",_validImageInfo.attr.liveType);
        
        if ( _validImageInfo.attr.liveType < 0.2 && [PAFaceDetectorSetting share].liveSwitch) {
            
            NSLog(@"Living fraction is too low");
            //[self faceDetectionFailed:Detection_ERROR_Attack];
            [self resetActionArray];
            PAFaceDetectType detectionType = [self randActionType];
            [self.detector resetWithFaceDetectType:detectionType compareVerifySwitch:NO liveVerifySwitch:[PAFaceDetectorSetting share].liveSwitch];
            
            return;
        }
        
    }else{
        
        NSLog(@"FeatureScore:%f",validFrame.attr.compareScore);
        //判断非连续
        if ( validFrame.attr.compareScore < 0.5) {
            
            NSLog(@"The comparison score is too low");
            //[self faceDetectionFailed:Detection_ERROR_Attack];
            [self.detector resetWithFaceDetectType:currentState compareVerifySwitch:YES liveVerifySwitch:NO];
            
            return;
        }
    }
    if (validFrame.image) {
        [self.actionImgArr addObject:validFrame.image];
    }
    
    if (self.actionArray.count<=0) {
        
        //停止操作
        _isDetection = NO;
        _retainFrame = nil;
        [self.timerManager stop];
        self.timerManager.delegate = nil;
        
        //如果需要日记上传 则可以打开 需要与本团队确认 后台是否已经上线
        [self.detector whetherOrNotSave:YES];
        [self.detector removeLogNotification];
        
        MAIN_ACTION(^{
            
            __strong typeof(weakSelf) strongSelf = weakSelf;
            [self pushToSuccessVc:strongSelf->_validImageInfo];
            
        });
        
        
    }else{
        
        MAIN_ACTION(^{
            
            PAFaceDetectType detectionType = [self randActionType];
            //界面提示
            __strong typeof(weakSelf) strongSelf = weakSelf;
            switch (detectionType) {
                case PADetectType_NORMAL:
                    //[strongSelf.stateLabel setText:@"验证中请等待"];
                    break;
//                case PADetectType_MouthOpen:
//                    [strongSelf.stateLabel setText:@"Please open your mouth slowly"];
//                    break;
//                case PADetectType_EyeBlink:
//                    [strongSelf.stateLabel setText:@"Please blink slowly"];
//                    break;
//                case PADetectType_HeadShank:
//                    [strongSelf.stateLabel setText:@"Please shake your head slowly"];
//                    break;
//                case PADetectType_LeftShank:
//                    [strongSelf.stateLabel setText:@"Turn your head slowly to the left"];
//                    break;
//                case PADetectType_RightShank:
//                    [strongSelf.stateLabel setText:@"Turn your head slowly to the right"];
//                    break;
                case PADetectType_MouthOpen:
                    [strongSelf.stateLabel setText:[self get:@"openMount" alter:@""]];
                    break;
                case PADetectType_EyeBlink:
                    [strongSelf.stateLabel setText:[self get:@"blink" alter:@""]];
                    break;
                case PADetectType_HeadShank:
                    [strongSelf.stateLabel setText:[self get:@"shakeHead" alter:@""]];
                    break;
                case PADetectType_LeftShank:
                    [strongSelf.stateLabel setText:[self get:@"shakeHeadToLeft" alter:@""]];
                    break;
                case PADetectType_RightShank:
                    [strongSelf.stateLabel setText:[self get:@"shakeHeadToRight" alter:@""]];
                    break;
                default:
                    break;
            }
            [self.timerManager stop];
            [self.timerManager start];
            [self.detector resetWithFaceDetectType:detectionType compareVerifySwitch:YES liveVerifySwitch:NO];
            
        });
        
    }
    
}
-(NSMutableArray *)actionImgArr{
    
    if (!_actionImgArr) {
        _actionImgArr = [NSMutableArray array];
    }
    return _actionImgArr;
}

-(void)pushToSuccessVc:(PAFaceDetectionFrame*)validFrame{
    if (!_isTimeOut) {
        CGFloat quality = 1.00;
        NSData *imageData = UIImageJPEGRepresentation(validFrame.image,quality);
        NSString * base64String = [imageData base64EncodedStringWithOptions:0];
        [self.onSuccessDelegate onSuccessDetectFace:base64String callBackId:self.callBackId];
        [self dismissViewControllerAnimated:NO completion:nil];
    }
}

#pragma mark UI

-(UILabel *)timeLabel{
    
    if (!_timeLabel) {
        _timeLabel = [[UILabel alloc] init];
        [_timeLabel setTextAlignment:NSTextAlignmentCenter];
    }
    return _timeLabel;
}

#pragma mark --- 倒计时管理器

-(PATimeCounter *)timerManager{
    if (!_timerManager) {
        _timerManager = [[PATimeCounter alloc]init];
        _timerManager.delegate = self;
    }
    return _timerManager;
}

-(void)currentTime:(int)time{
    
    if (time != [TimeDown intValue]) {
        MAIN_ACTION((^{
            [self.timeLabel setText:[NSString stringWithFormat:@"%d",[TimeDown intValue]-time]];
        }));
        
    }else{
        _isTimeOut = YES;
        [self faceDetectionFailed:Detection_ERROR_TimeOut];
        
    }
    
}

- (void)setupPreviewView
{
    // 获取当前设备方向
    _currentInterfaceOrientation = [UIApplication sharedApplication].statusBarOrientation;
    
    AVCaptureVideoPreviewLayer *previewLayer = self.videoManager.videoPreview;
    CGRect bounds = self.view.bounds;
    CGRect previewRect =  bounds;
    
    /// 摆正摄像头镜像
    CGFloat rotationAngle;
    if (_currentInterfaceOrientation == UIInterfaceOrientationLandscapeLeft) {
        
        rotationAngle = M_PI/2;
        
    }else if (_currentInterfaceOrientation == UIInterfaceOrientationLandscapeRight){
        
        rotationAngle = -M_PI/2;
        
    }else{
        
        rotationAngle = 0.0;
        
    }
    
    previewRect.size = CGSizeMake(previewRect.size.width*0.86, previewRect.size.height*0.86*previewRect.size.width/previewRect.size.height);
    previewRect.origin.x = self.faceCheckBackground.center.x-previewRect.size.width/2;
    previewRect.origin.y = self.faceCheckBackground.center.y-previewRect.size.height/2;
    
    previewLayer.frame = previewRect;
    CATransform3D trans = CATransform3DMakeRotation(rotationAngle , 0 , 0 , 1);
    previewLayer.transform = trans;
    [self.view.layer insertSublayer:previewLayer atIndex:0];
    
}

-(void)stopDetection:(UIButton*)bt{
    [self faceDetectionFailed:Detection_ERROR_ForcedOut];
}

#pragma mark --- 懒加载

-(UILabel *)stateLabel{
    
    if (!_stateLabel) {
        _stateLabel = [[UILabel alloc] init];
        [_stateLabel setTextColor:PAColorWithRGB(0, 0, 0, 1)];
        [_stateLabel setTextAlignment:NSTextAlignmentCenter];
    }
    return _stateLabel;
}

-(UILabel *)yrpLabel{
    
    if (!_yrpLabel) {
        _yrpLabel = [[UILabel alloc] init];
        [_yrpLabel setTextColor:[UIColor darkTextColor]];
        [_yrpLabel setTextAlignment:NSTextAlignmentLeft];
    }
    return _yrpLabel;
}

-(UILabel *)eyeDisLabel{
    
    if (!_eyeDisLabel) {
        _eyeDisLabel = [[UILabel alloc] init];
        [_eyeDisLabel setTextColor:[UIColor darkTextColor]];
        [_eyeDisLabel setTextAlignment:NSTextAlignmentLeft];
    }
    return _eyeDisLabel;
}

-(UILabel *)blurLabel{
    
    if (!_blurLabel) {
        _blurLabel = [[UILabel alloc] init];
        [_blurLabel setTextColor:[UIColor darkTextColor]];
        [_blurLabel setTextAlignment:NSTextAlignmentLeft];
    }
    return _blurLabel;
}

-(UILabel *)bringhtLabel{
    
    if (!_bringhtLabel) {
        _bringhtLabel = [[UILabel alloc] init];
        [_bringhtLabel setTextColor:[UIColor darkTextColor]];
        [_bringhtLabel setTextAlignment:NSTextAlignmentLeft];
        
    }
    return _bringhtLabel;
}

-(UILabel *)hintLabel{
    
    if (!_hintLabel) {
        _hintLabel = [[UILabel alloc]init];
        [_hintLabel setTextAlignment:NSTextAlignmentCenter];
        [_hintLabel setFont:[UIFont systemFontOfSize:18]];
        [_hintLabel setTextColor:PAColorWithRGB(102, 102, 102, 1)];
        [_hintLabel setHidden:YES];
        [self.view addSubview:_hintLabel];
    }
    return _hintLabel;
}

-(UIButton *)backButton{
    
    if (!_backButton) {
        UIImage *butImage = [UIImage imageWithData:[NSData dataWithContentsOfFile:[[NSBundle mainBundle]pathForResource:@"返回icon@3x" ofType:@"png"]]];
        _backButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backButton setBackgroundColor:[UIColor clearColor]];
        [_backButton setBackgroundImage:butImage forState:UIControlStateNormal];
        [_backButton addTarget:self action:@selector(stopDetection:) forControlEvents:UIControlEventTouchDown];
    }
    return _backButton;
}
-(UIButton *)backButtonBg{
    
    if (!_backButtonBg) {
        _backButtonBg = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backButtonBg setBackgroundColor:[UIColor clearColor]];
        [_backButtonBg addTarget:self action:@selector(stopDetection:) forControlEvents:UIControlEventTouchDown];
    }
    return _backButtonBg;
}

- (BOOL)shouldAutorotate
{
    return NO;
}

-(void)dealloc{
    
    NSLog(@"MainVC dealloc");
    [self.detector releaseSDK];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end



