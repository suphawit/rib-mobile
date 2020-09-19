//
//  PAFaceDetector.h
//  PAFaceDetector
//
//  Created by 刘沛荣 on 15/11/3.
//  Copyright © 2015年 PA. All rights reserved.
//
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import "PAFaceConfig.h"

/*!
 *  单帧检测结果的类，包含单帧检测出人脸的所有属性，此类无需构造，仅用于回调
 */
@interface PAFaceDetectionFrame : NSObject

/** 检测帧对应图片*/
@property (readonly) UIImage* image;
/** 图片中的人脸属性 */
@property (readonly) struct PAFaceAttr attr;

@end

/*!
 *  此接口通过 PAFaceDetector 的 setDelegate 函数进行注册，在活体检测的过程中会经由不同的事件触发不同的回调方法
 */
@protocol PAFaceDetectorManagerDelegate <NSObject>

@required

/**
 每一帧数据
 
 @param perFrame 每一帧相对于的帧数据
 */
-(void)onDetectFrame:(PAFaceDetectionFrame *)perFrame;
/*!
 *  当前活体检测的环境与用户操作监控
 *  @param tipType 返回环境与用户操作 不妥当的地方
 */
-(void)onDetectTip:(EnvironmentalTip)tipType;

/*!
 *  当前活体检测的动作检测成功时，调用此方法。
 *  @param validFrame 当前动作中采集的质量最好帧。
 */
-(void)onDetectSuccess:(PAFaceDetectionFrame *)validFrame currentFaceDetectionState:(PAFaceDetectType)currentState;

@end


@interface PAFaceDetectorManager : NSObject

/**
 初始化
 @param bundleName 模型bundle
 @param options 阈值参数
 @param facedelegate 代理
 @return obj
 */

+(PAFaceDetectorManager*) initDetectorWithBundleName:(NSString*)bundleName detectorOfOptions:(NSDictionary*) options andSetDelegate:(id<PAFaceDetectorManagerDelegate>)facedelegate completion:(void(^)(BOOL successed))initBlock;


/**
 设置业务配置
 
 @param app_id appid
 @param app_key appkey
 */
+(void)setApp_id:(NSString *)app_id setApp_key:(NSString *)app_key url:(NSString*)baseUrl success:(void(^)(id responseObject))success  failure:(void(^)(NSError *error))failure;

/**
 将图片传入检测器进行异步活体检测，检测结果将以异步的形式通知delegate
 @param sampleBuffer 视频流
 //竖屏ACEDeviceOrientationPortrait
 //左横ACEDeviceOrientationLandscapeLeft
 //右横ACEDeviceOrientationLandscapeRight
 */
-(void) detectWithSampleBuffer:(CMSampleBufferRef)sampleBuffer orientation:(ACEDeviceOrientation)orientation;

/**
 重置Detector类的状态，当用户需要重新开始活体检测流程时，调用此函数。 *
 
 @param detectionType 强制更改当前的活体检测类型 具体选项请参照 PAFaceDetectType
 @param compareSwitch 是否与前一帧做校对 防止非连续攻击
 @param liveSwitch 是否开启非连续
 */
-(void) resetWithFaceDetectType:(PAFaceDetectType)detectionType compareVerifySwitch:(BOOL)compareSwitch liveVerifySwitch:(BOOL)liveSwitch;


/**
 添加日记监控
 */
-(void)addLogNotification;

/**
 删除日记监控
 */
-(void)removeLogNotification;

/**
 写入日记
 @param text log信息
 */
-(void)fileHandleForWriting:(NSString *)text;

/**
 是否保存日记
 @param isSave yes保存 no废弃
 */
-(void)whetherOrNotSave:(BOOL)isSave;

/**
 释放资源
 */
-(void)releaseSDK;

/*!
 *  获取版本信息
 *
 *  @return 版本描述
 */
+(NSString*)getVersion;

@end




