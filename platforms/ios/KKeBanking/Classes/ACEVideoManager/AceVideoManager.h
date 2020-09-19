//
//  PAVideoManager.h
//  PAFaceSDK_EXAMPLE
//
//  Created by prliu on 2017/4/10.
//  Copyright © 2017年 prliu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

@protocol VideoManagerDelegate <NSObject>

- (void)onPermissionOfCamer:(AVAuthorizationStatus)camerState;
- (void)onCaptureOutput:(AVCaptureOutput *)captureOutput
  didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer
         fromConnection:(AVCaptureConnection *)connection;
@end

@interface AceVideoManager : NSObject

@property (nonatomic, assign) id<VideoManagerDelegate> videoDelegate;

- (dispatch_queue_t)getVideoQueue;

/**
 *  初始化方法
 *
 *  @param sessionPreset 相机分辨率 如果设置为空，则默认为 AVCaptureSessionPreset640x480
 *  @param devicePosition 前置或者后置相机，则默认为 前置相机
 *  @return 实例化对象
 */
+ (instancetype)videoPreset:(NSString *)sessionPreset
             devicePosition:(AVCaptureDevicePosition)devicePosition delegate:(id<VideoManagerDelegate>)camerDelegate;

@property (nonatomic, strong, readonly) AVCaptureSession *videoSession;
@property (nonatomic, strong, readonly) AVCaptureDeviceInput *videoInput;
@property (nonatomic, assign, readonly) AVCaptureDevicePosition devicePosition;

@property (nonatomic, assign) int maxFrame;

/**
 *  视频权限
 *
 */
-(void)videoPermission;

/**
 *  视频流的预览layer 默认全屏大小
 *
 *  @return 实例化对象
 */
-(AVCaptureVideoPreviewLayer *)videoPreview;

/**
 *  视频流的方向
 */
@property(nonatomic, assign) AVCaptureVideoOrientation videoOrientation;

/**
 *  开启视频流
 */
- (void)startRunning;

/**
 *  关闭视频流
 */
- (void)stopRunning;

- (CMFormatDescriptionRef)formatDescription;

/** only valid after startRunning has been called */
- (CGAffineTransform)transformFromVideoBufferOrientationToOrientation:(AVCaptureVideoOrientation)orientation
                                                    withAutoMirroring:(BOOL)mirroring;

@end
