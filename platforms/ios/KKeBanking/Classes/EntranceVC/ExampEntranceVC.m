//
//  ExampEntranceVC.m
//  AceFaceDetectDemo
//
//  Created by 刘沛荣 on 2018/4/18.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#import <AVFoundation/AVFoundation.h>
#import "ExampEntranceVC.h"
#import "PAZCLDefineTool.h"
#import "SuccessVC.h"
#import "UIViewExt.h"
#import "APIManager.h"
#import "SVProgressHUD.h"
#import "AppDelegate.h"
#import "DirectionsForUseVC.h"
#import "SVProgressHUD.h"
#import "ConfigVC.h"
#import "PAFaceDetectMainVC.h"

@interface ExampEntranceVC ()
{
    BOOL action_voice_bool;
    BOOL action_count_down;
    AppDelegate *_appdelegate;
    
}

@property (weak, nonatomic) IBOutlet UISwitch *saveWwitchBt;

@end

@implementation ExampEntranceVC

- (instancetype)init
{
    
    self = [super init];
    
    if (self) {
        
        _appdelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
        NSString *nibName ;
        if([[_appdelegate identifier] containsString:@"iPhone4"]){
            
            nibName = @"ExampEntranceVC4S";
            
        }else if([[_appdelegate identifier] containsString:@"iPhone6"] || [[_appdelegate identifier] containsString:@"iPhone7"] || [[_appdelegate identifier] containsString:@"iPhone8"]){
            
            nibName = @"ExampEntranceVC";

            
        }else if ([[_appdelegate identifier] containsString:@"iPhone5"]|| [[_appdelegate identifier] isEqualToString:@"iPhoneSE"]) {
                
                nibName = @"ExampEntranceVC5S";
                
        }else{
            
            nibName = @"ExampEntranceVCX";

        }
        NSLog(@"nibName:%@",nibName);
        self = [self initWithNibName:nibName bundle:nil];
    }
    return self;
}


-(void)viewDidAppear:(BOOL)animated{
    
    [super viewDidAppear:animated];
    
}

-(BOOL)prefersStatusBarHidden{
    
    return YES;
    
}

-(void)viewDidLayoutSubviews{
    
    [super viewDidLayoutSubviews];
    
}

- (void)viewDidLoad {
    [super viewDidLoad];
}

- (IBAction)usershow:(id)sender {
    
    DirectionsForUseVC *usershow = [[DirectionsForUseVC alloc]init];
    [self presentViewController:usershow animated:NO completion:^{
    }];
    
    
}

- (IBAction)ConfigVC:(id)sender {
    
    ConfigVC *mainVC = [[ConfigVC alloc] init];
    [self presentViewController:mainVC animated:NO completion:^{
    }];
    
    
}

/*!
 *  点击开始
 */
- (IBAction)startCheak:(id)sender {
    
    [self getNetWorkDateSuccess:^(NSDate *networkDate, NSString *networkDateStr) {
        NSLog(@"date:%@" ,networkDateStr);
        if ([self isGreaterThanWithCurrentDate:networkDate ToDate:@"2019-07-11 00:00:00"]) {
            NSLog(@"sdk处于正常时间段");
            [self checkAVAuthorizationStatus];
        }else{
            NSLog(@"sdk处于非正常时间段");
            
            UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:@"本版本已经失效" message:@"请联系平安AI应用团队" preferredStyle:UIAlertControllerStyleAlert];
            
            [alertVC addAction:[UIAlertAction actionWithTitle:@"退出" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
                
            }]];
            [self presentViewController:alertVC animated:NO completion:^{
                
            }];
            return ;
        }
    }];
    
}

-(void)checkAVAuthorizationStatus{
    
    AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if(authStatus == AVAuthorizationStatusAuthorized)
    {
        MAIN_ACTION(^{
            [self pushToTestVC];
        });
        
    }
    else if (authStatus == AVAuthorizationStatusDenied)
    {
        NSLog(@"您没有授权使用摄像头");
        [SVProgressHUD showErrorWithStatus:@"您没有授权使用摄像头" duration:1];
        
    }
    else if (authStatus == AVAuthorizationStatusNotDetermined)
    {
        [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
            if (granted) {
                MAIN_ACTION(^{
                    [self pushToTestVC];
                });
                
            }else{
                NSLog(@"您没有授权使用摄像头");
                [SVProgressHUD showErrorWithStatus:@"您没有授权使用摄像头" duration:1];
            }
        }];
    }
    
}

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



/**
 判断当前时间是否处于某一时间之前
 @param currentDate 当前时间
 @param toDate 比较时间
 @return 比较结果 currentDate相对于toDate NO为0 YES为1
 */
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

#pragma mark --------------- 以下为宿主APP需要关注的代码 ---------------
/*!
 *  活体检测控制器初始化
 */
- (void)pushToTestVC{
    
    PAFaceDetectMainVC *detectorVC = [[PAFaceDetectMainVC alloc] initWithPADetectionWithTheCountdown:YES detectType:DemoMotionType_EyeBlink voiceSwitch:YES];
    [self presentViewController:detectorVC animated:NO completion:^{
        
    }];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
