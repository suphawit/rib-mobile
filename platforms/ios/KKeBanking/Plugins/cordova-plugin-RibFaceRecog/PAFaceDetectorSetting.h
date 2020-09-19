//
//  PAFaceDetectorSetting.h
//  PAFaceDetectSDK
//
//  Created by 刘沛荣 on 2018/9/19.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PAFaceDetectorSetting : NSObject

@property (readonly) float closeEye;
@property (readonly) float openEye;
@property (readonly) float paper;
@property (readonly) float mouthOcc;
@property (readonly) float eyeOcc;
@property (readonly) float feature;
@property (readonly) float live ;
@property (readonly) BOOL  liveSwitch;
@property (readonly) BOOL  live_Is2M;
@property (readonly) float poseCenter;

@property (readonly) float mouthOpen;
@property (readonly) float mouthClose;
@property (readonly) float mouthConfidence;

@property (readonly) float shake;
@property (readonly) float shakeLeft;
@property (readonly) float shakeRight;

@property (readonly) float far;
@property (readonly) float close;
@property (readonly) float blurness;
@property (readonly) float brightness;
@property (readonly) float dark;
@property (readonly) float betweenPoints;

@property (readonly) BOOL logoSwitch;
@property (readonly) NSString *logoPath;

+(PAFaceDetectorSetting *)share;

/**
 获取默认 方案一 随机两种动作+静默活体+后端活体
 
 @return 获取默认检测器配置参数
 */
-(NSDictionary*)getPlanADefaultParameters;

/**
 获取默认 方案二 随机两种动作+后端活体
 
 @return 获取默认检测器配置参数
 */
-(NSDictionary*)getPlanBDefaultParameters;


/**
 参数设置

 @param environmentDict 强制更改的参数内容,非初始化时调
 */
-(void)setEnvironmentWithDict:(NSDictionary *)environmentDict;

@end
