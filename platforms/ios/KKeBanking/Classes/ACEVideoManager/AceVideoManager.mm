//
//  PAVideoManager.m
//  PAFaceSDK_EXAMPLE
//
//  Created by prliu on 2017/4/10.
//  Copyright © 2017年 prliu. All rights reserved.
//

#import "AceVideoManager.h"
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

//屏幕宽度 （区别于viewcontroller.view.fream）
#define PA_WIN_WIDTH  [UIScreen mainScreen].bounds.size.width
//屏幕高度 （区别于viewcontroller.view.fream）
#define PA_WIN_HEIGHT [UIScreen mainScreen].bounds.size.height

@interface AceVideoManager ()<AVCaptureVideoDataOutputSampleBufferDelegate, AVCaptureAudioDataOutputSampleBufferDelegate>
{
    AVCaptureConnection *_audioConnection;
    AVCaptureConnection *_videoConnection;
    NSDictionary *_audioCompressionSettings;
    AVCaptureDevice *_videoDevice;
    
    NSString *_tempVideoPath;
    
    dispatch_queue_t _videoQueue;
}
@property(nonatomic, assign) CMFormatDescriptionRef outputAudioFormatDescription;
@property(nonatomic, assign) CMFormatDescriptionRef outputVideoFormatDescription;

@property (nonatomic, strong) AVCaptureVideoPreviewLayer *videoPreviewLayer;
@property(nonatomic, copy) NSString *sessionPreset;


@end

@implementation AceVideoManager

-(instancetype)initWithPreset:(NSString *)sessionPreset
               devicePosition:(AVCaptureDevicePosition)devicePosition delegate:(id<VideoManagerDelegate>)camerDelegate
{
    self = [super init];
    if (self) {
        self.sessionPreset = sessionPreset;
        _devicePosition = devicePosition;
        _videoDelegate = camerDelegate;
        _videoQueue = dispatch_queue_create("com.PINGAN.face.video", NULL);
        [self initialSession];
        self.maxFrame = 30;
    }
    return self;
}

+ (instancetype)videoPreset:(NSString *)sessionPreset
             devicePosition:(AVCaptureDevicePosition)devicePosition delegate:(id<VideoManagerDelegate>)camerDelegate{
    
    AceVideoManager *manager = [[AceVideoManager alloc] initWithPreset:sessionPreset
                                                        devicePosition:devicePosition delegate:camerDelegate];
    return manager;
}

#pragma mark - video 功能开关
- (void)stopRunning{
    if (self.videoSession) {
        [self.videoSession stopRunning];
    }
}
- (void)startRunning{
    if (self.videoSession) {
        [self.videoSession startRunning];
    }
}
- (void)startRecording{
    [self startRunning];
}
#pragma mark - 权限管理
-(void)videoPermission{
    
    NSString *mediaType = AVMediaTypeVideo;// Or AVMediaTypeAudio
    
    AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:mediaType];
    
    if(authStatus ==AVAuthorizationStatusRestricted){//拒绝访问
        
        if (self.videoDelegate) {
            [self.videoDelegate onPermissionOfCamer:AVAuthorizationStatusRestricted];
        }
        
    }else if(authStatus == AVAuthorizationStatusDenied){
        
        if (self.videoDelegate) {
            [self.videoDelegate onPermissionOfCamer:AVAuthorizationStatusDenied];
        }
    }
    
    else if(authStatus == AVAuthorizationStatusAuthorized){//允许访问
        
        if (self.videoDelegate) {
            [self.videoDelegate onPermissionOfCamer:AVAuthorizationStatusAuthorized];
        }
        
    }else if(authStatus == AVAuthorizationStatusNotDetermined){
        
        //不明确
        if (self.videoDelegate) {
            [self.videoDelegate onPermissionOfCamer:AVAuthorizationStatusNotDetermined];
        }
        
        [AVCaptureDevice requestAccessForMediaType:mediaType completionHandler:^(BOOL granted) {
            
            if(granted){
                
                if (self.videoDelegate) {
                    [self.videoDelegate onPermissionOfCamer:AVAuthorizationStatusAuthorized];
                }
                
            }
            
            else {
                
                if (self.videoDelegate) {
                    [self.videoDelegate onPermissionOfCamer:AVAuthorizationStatusNotDetermined];
                }
                
            }
            
        }];
        
    }
    
}

#pragma mark - 初始化video配置
- (NSString *)sessionPreset{
    if (nil == _sessionPreset) {
        _sessionPreset = AVCaptureSessionPreset640x480;
    }
    return _sessionPreset;
}

-(AVCaptureVideoPreviewLayer *)videoPreviewLayer{
    
    if (nil == _videoPreviewLayer) {
        _videoPreviewLayer = [[AVCaptureVideoPreviewLayer alloc] initWithSession:self.videoSession];
        [_videoPreviewLayer setFrame:CGRectMake(0, 0, PA_WIN_WIDTH, PA_WIN_HEIGHT)];
        [_videoPreviewLayer setVideoGravity:AVLayerVideoGravityResizeAspectFill];
    }
    return _videoPreviewLayer;
}

-(AVCaptureVideoPreviewLayer *)videoPreview{
    
    return self.videoPreviewLayer;
    
}

- (CMFormatDescriptionRef)formatDescription{
    return self.outputVideoFormatDescription;
}

- (dispatch_queue_t)getVideoQueue{
    
    return _videoQueue;
}

//初始化相机
- (void) initialSession
{
    if (self.videoSession == nil) {
        
        _videoSession = [[AVCaptureSession alloc] init];
        self.videoSession.sessionPreset = self.sessionPreset;
        
        _videoDevice = [self cameraWithPosition:self.devicePosition];
        _videoInput = [[AVCaptureDeviceInput alloc] initWithDevice:_videoDevice error:nil];
        if ([self.videoSession canAddInput:self.videoInput]) {
            [self.videoSession addInput:self.videoInput];
        }
        AVCaptureVideoDataOutput *output = [[AVCaptureVideoDataOutput alloc] init];
        
        [output setSampleBufferDelegate:self queue:_videoQueue];
        
        output.videoSettings =[NSDictionary dictionaryWithObject:@(kCVPixelFormatType_32BGRA)
                                                          forKey:(id)kCVPixelBufferPixelFormatTypeKey];
        output.alwaysDiscardsLateVideoFrames = NO;
        
        if ([self.videoSession canAddOutput:output]) {
            [self.videoSession addOutput:output];
        }
        _videoConnection = [output connectionWithMediaType:AVMediaTypeVideo];
        
        // 设置采集的视频为坚屏
        if ([_videoConnection isVideoOrientationSupported]) {
            [_videoConnection setVideoOrientation:AVCaptureVideoOrientationPortrait];
        }
        
        self.videoOrientation = _videoConnection.videoOrientation;
        
        
        int frameRate = 0;
        CMTime frameDuration = kCMTimeInvalid;
        
        if ([NSProcessInfo processInfo].processorCount == 1)
        {
            frameRate = 10;
        }else{
            frameRate = self.maxFrame;
        }
        
        frameDuration = CMTimeMake(1, frameRate );
        
        NSError *error = nil;
        if ( [_videoDevice lockForConfiguration:&error] ) {
            _videoDevice.activeVideoMaxFrameDuration = frameDuration;
            _videoDevice.activeVideoMinFrameDuration = frameDuration;
            [_videoDevice unlockForConfiguration];
        }else {
            NSLog( @"videoDevice lockForConfiguration returned error %@", error );
        }
        
        
    }
}

//前后摄像头
- (AVCaptureDevice *)cameraWithPosition:(AVCaptureDevicePosition) position {
    NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
    for (AVCaptureDevice *device in devices) {
        if ([device position] == position) {
            return device;
        }
    }
    return nil;
}

//前后摄像头的切换
- (void)toggleCamera:(id)sender{
    NSUInteger cameraCount = [[AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo] count];
    if (cameraCount > 1) {
        NSError *error;
        AVCaptureDeviceInput *newVideoInput;
        AVCaptureDevicePosition position = [[_videoInput device] position];
        
        if (position == AVCaptureDevicePositionBack)
            newVideoInput = [[AVCaptureDeviceInput alloc] initWithDevice:[self cameraWithPosition:AVCaptureDevicePositionFront] error:&error];
        else if (position == AVCaptureDevicePositionFront)
            newVideoInput = [[AVCaptureDeviceInput alloc] initWithDevice:[self cameraWithPosition:AVCaptureDevicePositionBack] error:&error];
        else
            return;
        
        if (newVideoInput != nil) {
            [self.videoSession beginConfiguration];
            [self.videoSession removeInput:self.videoInput];
            if ([self.videoSession canAddInput:newVideoInput]) {
                [self.videoSession addInput:newVideoInput];
                _videoInput = newVideoInput;
            } else {
                [self.videoSession addInput:self.videoInput];
            }
            [self.videoSession commitConfiguration];
        } else if (error) {
            NSLog(@"toggle carema failed, error = %@", error);
        }
    }
}

- (CGAffineTransform)transformFromVideoBufferOrientationToOrientation:(AVCaptureVideoOrientation)orientation withAutoMirroring:(BOOL)mirror
{
    CGAffineTransform transform = CGAffineTransformIdentity;
    
    CGFloat orientationAngleOffset = PAAngleOffsetFromPortraitOrientationToOrientation_video(orientation);
    CGFloat videoOrientationAngleOffset = PAAngleOffsetFromPortraitOrientationToOrientation_video(self.videoOrientation);
    
    CGFloat angleOffset = orientationAngleOffset - videoOrientationAngleOffset;
    transform = CGAffineTransformMakeRotation(angleOffset);
    //    transform = CGAffineTransformRotate(transform, -M_PI);
    
    if ( _videoDevice.position == AVCaptureDevicePositionFront)
    {
        if (mirror) {
            transform = CGAffineTransformScale(transform, -1, 1);
        }else {
            transform = CGAffineTransformRotate(transform, M_PI );
        }
    }
    
    return transform;
}

#pragma mark - delegate
- (void)captureOutput:(AVCaptureOutput *)captureOutput
didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer
       fromConnection:(AVCaptureConnection *)connection
{
    @autoreleasepool {
        if (connection == _videoConnection)
        {
            CMFormatDescriptionRef formatDescription = CMSampleBufferGetFormatDescription(sampleBuffer);
            
            if (self.outputVideoFormatDescription == nil) {
                self.outputVideoFormatDescription = formatDescription;
            }
            if (self.videoDelegate) {
                [self.videoDelegate onCaptureOutput:captureOutput didOutputSampleBuffer:sampleBuffer fromConnection:connection];
            }
            
        }
    }
}

CGFloat PAAngleOffsetFromPortraitOrientationToOrientation_video(AVCaptureVideoOrientation orientation)
{
    CGFloat angle = 0.0;
    switch ( orientation )
    {
        case AVCaptureVideoOrientationPortrait:
            angle = 0.0;
            break;
        case AVCaptureVideoOrientationPortraitUpsideDown:
            angle = M_PI;
            break;
        case AVCaptureVideoOrientationLandscapeRight:
            angle = -M_PI_2;
            break;
        case AVCaptureVideoOrientationLandscapeLeft:
            angle = M_PI_2;
            break;
        default:
            break;
    }
    return angle;
}

@end

