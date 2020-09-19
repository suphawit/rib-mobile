//
//  PAFaceDetectMainVC.h
//  AceFaceDetectDemo
//
//  Created by 刘沛荣 on 2018/4/16.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#import "ViewController.h"

typedef NS_ENUM (NSInteger,DemoMotionType) {
    
    DemoMotionType_NORMAL_FACE = 1001,    //正脸--必须--合格
    DemoMotionType_MouthOpen ,            //张嘴---选择
    DemoMotionType_EyeBlink ,             //眨眼---选择
    DemoMotionType_HeadShake ,            //摇头---选择
    DemoMotionType_LeftShake ,            //左摇头---选择
    DemoMotionType_RightShake            //右摇头---选择
    
};

typedef NS_ENUM (NSInteger,DemoPlanType) {
    
    //方案一：正脸-- + ? = random（张嘴+眨眼+摇头+左摇头+右摇头）+random（张嘴+眨眼+摇头+左摇头+右摇头-?）-->正脸+动作一+动作二，适用于需要极高安全场景，并保证高通过率
    //获取默认 方案一 随机两种动作+静默活体+后端活体
    DemoPlanType_PlanA = 2001,
    // 获取默认 方案二 随机两种动作+后端活体
    //方案二：正脸-- + ? = random（张嘴+眨眼+摇头+左摇头+右摇头）+random（张嘴+眨眼+摇头+左摇头+右摇头-?）-->正脸+动作一+动作二，适用于需要极高安全场景，并保证高通过率
    DemoPlanType_PlanB ,
    //正脸+?....
    DemoPlanType_Custom
    
};

typedef NS_ENUM (NSInteger,ErrorType) {
    
    Detection_ERROR_TimeOut = 4001,  //超时-DEMO预留
    Detection_ERROR_Attack,         //非法攻击
    Detection_ERROR_ForcedOut,      //强制退出-DEMO预留
    Detection_ERROR_Permission      //摄像头无权限-DEMO预留
    
};

/*!
 *  活体检测代理方法
 */
@protocol PADetectionDelegate <NSObject>
@optional
/*!
 *  每一个活体动作检测的代理回调方法（APP处理网络时，错误回调）
 *  @param singleReport 每一个活体动作检测失败数据字典
 *  @param error        检测失败报错
 */
- (void)getSinglePADetectionReport:(NSDictionary *)singleReport error:(NSError *)error;

/*!
 *  活体检测的代理回调方法(APP处理网络则不需要理会)
 *  @param faceReport   检测成功数据字典
 *  其中key有:     imageID       上传照片的流水号
 *              imageInfoArr    活体检测详细数据类数组
 *
 *  @param faceImage    人脸正面照（即上传到服务器的照片）
 *  @param error        检测失败报错
 */
- (void)getDetectionReport:(NSDictionary *)faceReport Image:(UIImage *)faceImage error:(NSError *)error;

/*!
 *  APP在此回调处理网络
 *  @param picture   完整图片
 *  @param faceImage    人脸正面照（即上传到服务器的照片）
 *  @param imageInfo    人脸正面照信息（自主选择）
 */
-(int)getDetectionreportWithImage:(UIImage *)picture andTheFaceImage:(UIImage*)faceImage andTheFaceImageInfo:(NSDictionary*)imageInfo;

@end

@protocol OnSuccessDelegate <NSObject>
- (void)onSuccessDetectFace:(NSString *)data callBackId:(NSString*)callBackId;
@end


@interface PAFaceDetectMainVC : ViewController
/**
 初始化扫描页面
 
 @param countDown 倒计时显示否
 @param voiceSwitch 语音开关
 @return obj
 */
- (id)initWithPADetectionWithTheCountdown:(BOOL)countDown detectType:(DemoPlanType)detectType voiceSwitch:(BOOL)voiceSwitch;
@property (nonatomic, weak) id <OnSuccessDelegate>onSuccessDelegate;
@property (nonatomic, strong) NSString *callBackId;

-(void)initialize;
-(void)setLanguage:(NSString *)language;

@end

