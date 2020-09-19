//
//  PaAccessNetTool.h
//  PaAccessControl
//
//  Created by Will on 2018/8/21.
//  Copyright © 2018年 Will. All rights reserved.
//

#import <Foundation/Foundation.h>


/**
 回调

 @param code
 -1000  网络异常
 1001   签名不匹配
 1002   参数校验失败
 -1     appid,appkey,bundleId不匹配
 -2     授权失败
 9996   appid已过期
 9997   注册已超过容量
 9998   appid 未注册
 9999   系统异常
 
 
 @param msg 信息
 */
typedef void(^PA_Completion)(NSString * code, NSString *msg);
@interface PAAuthorizationKit: NSObject

/**
 授权

 @param urlStr 授权url
 @param appKey 业务key
 @param appId 业务id
 @param completion 回调
 */
+ (void)applicationAuthorizationWithUrl:(NSString *)urlStr AppKey:(NSString *)appKey AppId:(NSString *)appId completion:(PA_Completion)completion;
@end
