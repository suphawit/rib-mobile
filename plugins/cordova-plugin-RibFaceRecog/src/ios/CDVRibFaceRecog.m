//
//  CDVNativeView.m
//
//  Created by Michel Felipe on 05/09/17.
//
//

#import "CDVRibFaceRecog.h"
#import <UIKit/UIKit.h>
#import "PAFaceDetectMainVC.h"
#import "MainViewController.h"

@interface CDVRibFaceRecog (hidden) <OnSuccessDelegate>

-(UIViewController *) instantiateViewControllerWithName: (NSString*) name;
-(UIViewController *) tryInstantiateViewWithName: (NSString*) name;

@end

@implementation CDVRibFaceRecog

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.resultExceptions = @{
                                  @"IoException": ^{
                                      return CDVCommandStatus_IO_EXCEPTION;
                                  },
                                  @"NotFoundException": ^{
                                      return CDVCommandStatus_CLASS_NOT_FOUND_EXCEPTION;
                                  },
                                  @"ParamInvalidException": ^{
                                      return CDVCommandStatus_ERROR;
                                  },
                                  @"InstantiationException": ^{
                                      return CDVCommandStatus_INSTANTIATION_EXCEPTION;
                                  },
                                  @"NoResultException": ^{
                                      return CDVCommandStatus_NO_RESULT;
                                  },
                                  @"ParamsTypeException": ^{
                                      return CDVCommandStatus_INVALID_ACTION;
                                  }
                                  };
    }
    return self;
}

- (void)openCamera:(CDVInvokedUrlCommand*)command {
    NSString *firstParam;
    NSString *detailMessage;
    CDVPluginResult *pluginResult;
    @try {
        
        NSString* language = [command argumentAtIndex: 0];
        PAFaceDetectMainVC *detectorVC = [[PAFaceDetectMainVC alloc] initWithPADetectionWithTheCountdown:YES detectType:DemoMotionType_EyeBlink voiceSwitch:YES];
        detectorVC.onSuccessDelegate = self;
        detectorVC.callBackId = command.callbackId;
        [detectorVC setLanguage:language];
        [self.viewController presentViewController:detectorVC animated:YES completion:nil];
    } @catch (NSException *e) {
        detailMessage = [[NSString alloc] initWithFormat:@"Storyboard %@ was not found", firstParam];
        @throw [[NSException alloc] initWithName:@"NotFoundException" reason:detailMessage userInfo:nil];
    }
}

-(void)onSuccessDetectFace:(NSString*)data callBackId:(NSString*)callBackId{
    NSMutableDictionary* resultDict = [NSMutableDictionary new];
    resultDict[@"message"] = data;
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus: CDVCommandStatus_OK
                               messageAsDictionary: resultDict
                               ];
    [self.commandDelegate sendPluginResult:result callbackId:callBackId];
}

///init/////
//获取网络时间
- (void)getNetWorkDateSuccess:(void(^)(NSDate *networkDate, NSString *networkDateStr))success {
    NSString *urlString = @"https://www.baidu.com";
    //    urlString = [urlString stringByAddingPercentEscapesUsingEncoding: NSUTF8StringEncoding];
    [urlString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"`#%^{}\"[]|\\<> "]];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:[NSURL URLWithString: urlString]];
    [request setCachePolicy:NSURLRequestReloadIgnoringCacheData];
    [request setTimeoutInterval:5];
    [request setHTTPShouldHandleCookies:FALSE];
    [request setHTTPMethod:@"GET"];
    __block NSDate *localDate;
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration] delegate:nil delegateQueue:[[NSOperationQueue alloc] init]];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        [session finishTasksAndInvalidate];
        if (!error) {
            //要把网络数据强转 不然用不了下面那个方法获取不到内容（个人感觉，不知道对不）
            NSHTTPURLResponse *responsee = (NSHTTPURLResponse *)response;
            NSString *date = [[responsee allHeaderFields] objectForKey:@"Date"];
            date = [date substringFromIndex:5];
            date = [date substringToIndex:[date length]-4];
            NSDateFormatter *dMatter = [[NSDateFormatter alloc] init];
            dMatter.locale = [[NSLocale alloc] initWithLocaleIdentifier:@"en_US"];
            [dMatter setDateFormat:@"dd MMM yyyy HH:mm:ss"];
            //处理八小时问题-这里获取到的是标准时间
            NSDate *netDate = [dMatter dateFromString:date];
            NSTimeZone *zone = [NSTimeZone systemTimeZone];
            NSInteger interval = [zone secondsFromGMTForDate:netDate];
            localDate = [netDate dateByAddingTimeInterval: interval];
            NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
            [formatter setDateFormat:@"YYYY-MM-dd HH:mm:ss"];
            NSString *nowtimeStr = [formatter stringFromDate:localDate];
            dispatch_async(dispatch_get_main_queue(), ^{
                if (success) {
                    success(localDate, nowtimeStr);
                }
            });
        }else {
        }
    }];
    [dataTask resume];
}

- (BOOL)isGreaterThanWithCurrentDate:(NSDate *)currentDate ToDate:(NSString *)toDate {
    //获取当前时间
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"YYYY-MM-dd HH:mm:ss"];
    NSTimeInterval currentTime = [currentDate timeIntervalSince1970];
    
    //开始时间和结束时间
    NSString *toDateStr = [NSString stringWithFormat:@"%@", toDate];
    [formatter setDateFormat:@"YYYY-MM-dd HH:mm:ss"];
    NSTimeInterval toTime = [[formatter dateFromString:toDateStr] timeIntervalSince1970];
    NSLog(@"currentTime:%f",currentTime);
    NSLog(@"toDateStr:%f",toTime);
    
    if (currentTime < toTime) {
        return YES;
    }else {
        return NO;
    }
}

- (void)initSDK {
    
    [self getNetWorkDateSuccess:^(NSDate *networkDate, NSString *networkDateStr) {
        NSLog(@"date:%@" ,networkDateStr);
        if ([self isGreaterThanWithCurrentDate:networkDate ToDate:@"2019-07-20 00:00:00"]) {
            NSLog(@"sdk valid time");
        }else{
            NSLog(@"sdk invalid time");
            return ;
        }
    }];
    
}

@end
