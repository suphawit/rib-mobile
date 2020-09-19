//
//  APIManager.h
//  APIManagerDemo
//
//  Created by 周宗锂(AI产品应用团队AI工程化开发组) on 2017/8/30.
//  Copyright © 2017年 周宗锂. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

typedef void(^SuccessBlock)(id responseObject);
typedef void(^FailureBlock)(NSError *error);

@interface APIManager : NSObject

+ (instancetype)shareInstance;

- (void)setApp_id:(NSString *)app_id setApp_key:(NSString *)app_key;

//base on 《BIAP-IS 生物识别应用平台接口说明文档 V1.1.0.pdf》

/**
 1、人证比对

 @param faceImage 现场照
 @param name 姓名
 @param cardID 身份证号码
 */
-(void)faceCheckWithImage:(UIImage *)faceImage name:(NSString *)name cardID:(NSString *)cardID success:(SuccessBlock)success failure:(FailureBlock)failure;


/**
 2、身份验证

 @param name 姓名
 @param cardID 身份证号码
 */
-(void)IDCheckWithName:(NSString *)name cardID:(NSString *)cardID success:(SuccessBlock)success failure:(FailureBlock)failure;


/**
 3、移除网纹

 @param IDImage 带网纹身份证照片
 */
-(void)idmarkremovalWithIDImage:(UIImage *)IDImage success:(SuccessBlock)success failure:(FailureBlock)failure;


/**
 4、人脸检测

 @param image 待检测图片
 @param multiple_face 是否多人脸检测
 */
-(void)faceDetectWithImage:(UIImage *)image multiple_face:(BOOL)multiple_face success:(SuccessBlock)success failure:(FailureBlock)failure;


/**
 5、人脸比对

 @param image1 待比对人脸照片1
 @param image2 待比对人脸照片2
 */
-(void)faceComparisonWithImage1:(UIImage *)image1 image2:(UIImage *)image2 success:(SuccessBlock)success failure:(FailureBlock)failure;


/**
 6、活体检测

 @param image 待检测的图片
 */
-(void)bioDetectionsWithImage:(UIImage *)image  success:(SuccessBlock)success failure:(FailureBlock)failure;


/**
 7、卡证识别（OCR）
 
 @param image 证件照片
 @param type 证件类型 二代证正面 2;  二代证背面 3;  临时身份证 4;  驾驶证 5;  行驶证 6;  银行卡 17;  车牌 19;
 */
-(void)getInformationWithImage:(UIImage *)image cardType:(NSString *)type success:(SuccessBlock)success failure:(FailureBlock)failure;

-(void)basePostWithURL:(NSString *)URL params:(NSDictionary *)params success:(SuccessBlock)success failure:(FailureBlock)failure ;
- (NSString *)base64EncodedStringData:(NSData*)data WithWrapWidth:(NSUInteger)wrapWidth;
@end
