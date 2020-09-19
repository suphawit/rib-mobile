/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  KKeBanking
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"
#import <sys/utsname.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    @try {
        NSFileManager *fileManager = [NSFileManager defaultManager];
        [[NSFileManager defaultManager] removeItemAtPath:[NSHomeDirectory() stringByAppendingPathComponent:@"Library/SplashBoard"] error:nil];
        if ([fileManager removeItemAtPath:@"FilePath" error:NULL]) {
           NSLog(@"Removed successfully");
        }
    } @catch(id anException) {
      
    }
    self.viewController = [[MainViewController alloc] init];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSString *_Nonnull)identifier {
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *platform = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
    if ([platform isEqualToString:@"x86_64"]){return @"Simulator";}
    if ([platform isEqualToString:@"i386"]) {      return @"Simulator";}
    if ([platform isEqualToString:@"iPhone1,1"]){  return @"iPhone";}
    if ([platform isEqualToString:@"iPhone1,2"]){  return @"iPhone3G";}
    if ([platform isEqualToString:@"iPhone2,1"]){  return @"iPhone3GS";}
    if ([platform isEqualToString:@"iPhone3,1"]){  return @"iPhone4";}
    if ([platform isEqualToString:@"iPhone3,2"]) { return @"iPhone4";}
    if ([platform isEqualToString:@"iPhone3,3"]) { return @"iPhone4";}
    if ([platform isEqualToString:@"iPhone4,1"]) { return @"iPhone4S";}
    if ([platform isEqualToString:@"iPhone5,1"])  {return @"iPhone5";}
    if ([platform isEqualToString:@"iPhone5,2"])  {return @"iPhone5c";}
    if ([platform isEqualToString:@"iPhone5,3"])  {return @"iPhone5c";}
    if ([platform isEqualToString:@"iPhone5,4"])  {return @"iPhone5c";}
    if ([platform isEqualToString:@"iPhone6,1"])  {return @"iPhone5s";}
    if ([platform isEqualToString:@"iPhone6,2"])  {return @"iPhone5s";}
    if ([platform isEqualToString:@"iPhone7,1"])  {return @"iPhone6Plus";}
    if ([platform isEqualToString:@"iPhone7,2"]) { return @"iPhone6";}
    if ([platform isEqualToString:@"iPhone8,1"]) { return @"iPhone6s";}
    if ([platform isEqualToString:@"iPhone8,2"]) { return @"iPhone6sPlus";}
    if ([platform isEqualToString:@"iPhone8,4"]) { return @"iPhoneSE";}
    if ([platform isEqualToString:@"iPhone9,1"]) { return @"iPhone7";}
    if ([platform isEqualToString:@"iPhone9,3"])  {return @"iPhone7";}
    if ([platform isEqualToString:@"iPhone9,2"])  {return @"iPhone7Plus";}
    if ([platform isEqualToString:@"iPhone9,4"])  {return @"iPhone7Plus";}
    if ([platform isEqualToString:@"iPhone10,1"]) {return @"iPhone8";}
    if ([platform isEqualToString:@"iPhone10,4"]) {return @"iPhone8";}
    if ([platform isEqualToString:@"iPhone10,2"]){ return @"iPhone8Plus";}
    if ([platform isEqualToString:@"iPhone10,5"]){ return @"iPhone8Plus";}
    if ([platform isEqualToString:@"iPhone10,3"]) {return @"iPhoneX";}
    if ([platform isEqualToString:@"iPhone10,6"]){ return @"iPhoneX";}
    if ([platform isEqualToString:@"iPhone11,8"]){ return @"iPhoneXR";}
    if ([platform isEqualToString:@"iPhone11,2"]){ return @"iPhoneXS";}
    if ([platform isEqualToString:@"iPhone11,6"]){ return @"iPhoneXSMAX";}
    
    
    
    
    return platform;
}

@end
