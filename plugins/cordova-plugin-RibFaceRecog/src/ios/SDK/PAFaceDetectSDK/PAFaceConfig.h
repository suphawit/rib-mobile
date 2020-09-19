//
//  PAFaceConfig.h
//  PAFaceDetectSDK
//
//  Created by 刘沛荣 on 2018/9/3.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#ifndef PAFaceConfig_h
#define PAFaceConfig_h

//0.0f 闭眼阈值 大于succeed
extern NSString* const PAThreshold_CloseEye ;
//-1.2f 睁眼阈值 小于succeed
extern NSString* const PAThreshold_OpenEye ;
//3 纸张判定阈值 大于fail，纸张
extern NSString* const PAThreshold_Paper ;
//-3.84f 遮挡阈值 小于fail，遮挡
extern NSString* const PAThreshold_MouthOcc ;
//-0.97 遮挡阈值 小于fail，遮挡
extern NSString* const PAThreshold_EyeOcc ;
//0.45 比对阈值 大于succeed，同一人
extern NSString* const PAThreshold_Feature ;
//NO  日记开关 YES为开 NO为关闭
extern NSString* const PAThreshold_Log_Switch;
//0.5  活体阈值 小于fail,非法攻击
extern NSString* const PAThreshold_Live ;
//NO  活体开关 YES为开 NO为关闭
extern NSString* const PAThreshold_Live_Switch;
//No 静默活体2.2M开关 默认900K 所以默认NO
extern NSString* const PAThreshold_Live_Is2M ;
//10 角度阈值 大于fail
extern NSString* const PAThreshold_PoseCenter ;
//1.7张嘴阈值 大于success，张嘴状态
extern NSString* const PAThreshold_MouthOpen ;
//-1 闭嘴阈值 小于success，闭嘴状态
extern NSString* const PAThreshold_MouthClose;
//-0.6 嘴巴置信度 小于fail，不合格
extern NSString* const PAThreshold_MouthConfidence ;
//18 摇头阈值，大于success，摇头成功
extern NSString* const PAThreshold_Shake  ;
//18左摇头，大于success，左摇头成功
extern NSString* const PAThreshold_ShakeLeft ;
//18右摇头,大于success，右摇头成功
extern NSString* const PAThreshold_ShakeRight;
//0.3 小于0.3 太远 人脸对于全图的占比
extern NSString* const PAThreshold_Far ;
//0.8 大于0.8 太近 人脸对于全图的占比
extern NSString* const PAThreshold_Close ;
//15 越小越清晰 越小越严格
extern NSString* const PAThreshold_Blurness ;
//220 大于则过亮
extern NSString* const PAThreshold_Brightness ;
//65 小于过暗
extern NSString* const PAThreshold_Dark ;
//130 人脸中心点与图片中心点的距离
extern NSString* const PAThreshold_BetweenPoints;
//默认路径doc-PALogUpload
extern NSString* const PAThreshold_Log_PATH;

/*!
 *  \enum PAFaceDetectionType
 *  \brief 检测类型选项
 */
typedef NS_ENUM (NSInteger,PAFaceDetectType) {
    
    PADetectType_NORMAL      = 1001,    //正脸--必须--合格
    PADetectType_MouthOpen ,            //张嘴---选择
    PADetectType_EyeBlink ,             //眨眼---选择
    PADetectType_HeadShank,             //摇头---选择
    PADetectType_LeftShank,             //摇头左---选择
    PADetectType_RightShank             //摇头右---选择
    
} ;

/**
 Environmental ErrorEnum
 */
typedef NS_ENUM (NSInteger,EnvironmentalTip) {
    
    PAEnviTip_NORMAL = 2001,     //正常
    PAEnviTip_NO_FACE  ,         //没有人脸
    PAEnviTip_MULTI_FACE ,       //多人脸存在
    PAEnviTip_NOCENTER,          //请正对采集框
    PAEnviTip_YAW_LEFT,          //人脸过于偏左
    PAEnviTip_YAW_RIGHT,         //人脸过于偏右
    PAEnviTip_PITCH_UP,          //人脸过于仰头
    PAEnviTip_PITCH_DOWN,        //人脸过于低头
    PAEnviTip_ROLL_LEFT,         //人脸过于偏左歪头
    PAEnviTip_ROLL_RIGHT,        //人脸过于偏右歪头
    PAEnviTip_TOO_DARK ,         //人脸过于灰暗
    PAEnviTip_TOO_BRIGHT ,       //人脸过于亮
    PAEnviTip_TOO_FUZZY ,        //模糊值过高
    PAEnviTip_TOO_CLOSE,         //人脸过近
    PAEnviTip_TOO_FAR ,          //人脸过于远
    PAEnviTip_ILLEGAL,           //非法人脸警告
    PAEnviTip_MOVEMENT,          //请保持相对静止
    PAEnviTip_MouthOpen,         //请不要张着嘴
    PAEnviTip_EyeClose ,         //请不要闭着眼
    PAEnviTip_CoverFace          //请不要遮挡脸部

} ;

typedef NS_ENUM(NSInteger, ACEDeviceOrientation) {
    
    // Device oriented vertically, home button on the bottom
    PADeviceOrientationPortrait,
    // Device oriented horizontally, home button on the right
    PADeviceOrientationLandscapeLeft,
    // Device oriented horizontally, home button on the left
    PADeviceOrientationLandscapeRight
    
};

/**
 *  人脸识别参数
 */
struct PAFaceAttr{
    
    /** 人脸位置 */
    Rect face_rect;
    /** 左右旋转弧度 */
    float yaw ;
    /** 上下俯仰弧度 */
    float pitch ;
    /** 左右偏航弧度 */
    float roll ;
    /** 运动模糊程度 */
    float blurness_motion ;
    /** 亮度 */
    float brightness ;
    /** 两眼间距 */
    float eyeDis ;
    /**活体结果**/
    float liveType ;
    /**连续帧置信度**/
    float compareScore ;
    /**单帧置信度度**/
    float confidence ;
};

#endif /* PAFaceConfig_h */
