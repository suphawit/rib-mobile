//
//  AceUncaughtExceptionHandler.h
//  AceFaceDetectDemo
//
//  Created by 刘沛荣 on 2018/9/14.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AceUncaughtExceptionHandler : NSObject

+ (void)setDefaultHandler;
+ (NSUncaughtExceptionHandler *)getHandler;
+ (void)TakeException:(NSException *) exception;

@end
