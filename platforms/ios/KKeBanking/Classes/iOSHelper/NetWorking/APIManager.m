//
//  APIManager.mqqqqqqqqqqqqqqqqqq
//  APIManagerDemo
//
//  Created by 周宗锂(AI产品应用团队AI工程化开发组) on 2017/8/30.
//  Copyright © 2017年 周宗锂. All rights reserved.
//

//base on 《BIAP-IS 生物识别应用平台接口说明文档 V1.1.0.pdf》

#define kDdeviceUUID        [[[UIDevice currentDevice] identifierForVendor] UUIDString]//获取设备唯一标识符

#define kEnvironment 2  // 0：开发环境 1：测试环境 2：生产环境
#if (kEnvironment == 0)
#define kBaseURL            @"http://10.13.76.205:8081"                     // 开发环境服务
#define kApp_id             @"PA_OAP-FT-STG"
#define kApp_key            @"5d6b9d757f2da7943bcb8e93495534af5d190a8e"
#elif (kEnvironment == 1)
#define kBaseURL            @"https://biap-is-stg.pa18.com:10030"           // 测试环境服务
#define kApp_id             @"PA_OAP-FT-STG"
#define kApp_key            @"5d6b9d757f2da7943bcb8e93495534af5d190a8e"
#elif (kEnvironment == 2)
#define kBaseURL            @"https://biap-is.pa18.com"                     // 生产环境服务
//#define kApp_id             @"PA_OAP-FT-PRD"
//#define kApp_key            @"454f6a575aaaa19c3b48de624153f1122103caee"
#define kApp_id             @"EX_a50ae01b55cd3142af82b8c29cb98ef4"
#define kApp_key            @"eff69ce3a5be2074fdfbf9084131a8c7fe329865"
#endif


#define kIDcomparison1      @"/biap/face/v1/idcomparison"       // 1、人证比对（校验身份证信息、自拍照活体检测、人证是否统一）
#define kIDcomparison1_1    @"/biap/face/v1.1/idcomparison"     // 1、人证比对（校验身份证信息、人证是否统一）
#define kIDcomparison2      @"/biap/face/v2/idcomparison"       // 1、人证比对（校验身份证信息、自拍照活体检测、用户协议约束、身份证底图损坏检测、模糊检测、人证是否统一）
#define kIDcomparison2_1    @"/biap/face/v2.1/idcomparison"     // 1、人证比对（校验身份证信息、用户协议约束、身份证底图损坏检测、模糊检测等、人证是否统一）
#define kVerification       @"/biap/id/v1/verification"         // 2、身份验证（提供身份证号码与姓名，进行实名检测）
#define kIDmarkremoval      @"/biap/face/v1/idmarkremoval"      // 3、移除网纹（提供带网纹的身份证照片，进行网纹移除处理）
#define kDetections         @"/biap/face/v1/detections"         // 4、人脸检测（提供自拍照，进行人脸检测，返回最多16张人脸坐标）
#define kComparison         @"/biap/face/v1/comparison"         // 5、人脸比对（提供2张自拍照，进行人脸比对，返回比对结果）
#define kBiodetections      @"/biap/face/v1/biodetections"      // 6、活体检测（提供自拍照，进行活体检测，返回比对结果）
#define kCardrec            @"/biap/character/v1/cardrec"       // 7、卡证识别（提供身份证、银行卡等，进行内容检测，返回识别内容）


#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonHMAC.h>

#import "APIManager.h"
#import "XMLDictionary.h"

@interface APIManager ()<NSURLSessionDelegate>

@property (nonatomic, copy) NSString *app_id;
@property (nonatomic, copy) NSString *app_key;

@end

@implementation APIManager

+ (instancetype)shareInstance {
    
    static APIManager *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[APIManager alloc] init];
    });
    
    return manager;
}

-(void)setApp_id:(NSString *)app_id setApp_key:(NSString *)app_key {
    self.app_id = app_id;
    self.app_key = app_key;
    
}

#pragma mark - 1、人证比对
-(void)faceCheckWithImage:(UIImage *)faceImage name:(NSString *)name cardID:(NSString *)cardID success:(SuccessBlock)success failure:(FailureBlock)failure {
    NSString *request_id = [NSString stringWithFormat:@"%@:%@",kDdeviceUUID,[self getTimeString]];
    NSString *imageStr = [self base64EncodedStringData:UIImageJPEGRepresentation(faceImage, 1) WithWrapWidth:0];
    //    NSString *request_id= [NSString stringWithFormat:@"%u",arc4random()];
    NSDictionary *params = @{@"request_id":request_id,                      // [string] 用户http请求的唯一标识
                             @"person_id":cardID,                      // [string] 身份证号码
                             @"person_name":name,                   // [string] 用户姓名
                             @"device":@{
                                     @"plat":@"2",                // [string] 平台，其中客户端平台类型为(1->android, 2->ios, 3->pc)
                                     @"version":@"10.3.3",       // [string] 版本号
                                     @"model":@"iPhone6s+"         // [string] 机型
                                     },
                             @"file":@{
                                     @"name":@"1_3demo.jpeg",              // [string] 文件名称
                                     @"data":imageStr                    // [string] Base64编码后的图片内容
                                     }
                             };
    
    NSString *headStr = [self dictionaryToJson:params];
    //request
    NSMutableURLRequest * request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@%@",kBaseURL,kIDcomparison1_1]] cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:10];
    //myRequestData
    NSMutableData *myRequestData = [NSMutableData dataWithCapacity:15];
    [myRequestData appendData:[headStr dataUsingEncoding:NSUTF8StringEncoding]];
    //set http body
    [request setHTTPBody:myRequestData];
    //http method
    [request setHTTPMethod:@"POST"];
    
    NSDate *dat = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a = [dat timeIntervalSince1970]*1000;
    NSString *timeString = [NSString stringWithFormat:@"%.f", a];
    
    NSString *hmac_data = [self getSignStringWithTimeStamp:timeString method:kIDcomparison1_1 deviceID:@"test_client" paramsJson:headStr];
    
    [request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    [request setValue:kApp_id forHTTPHeaderField:@"X-Appid"];
    [request setValue:timeString forHTTPHeaderField:@"X-Timestamp"];
    [request setValue:@"test_client" forHTTPHeaderField:@"X-Deviceid"];
    [request setValue:hmac_data forHTTPHeaderField:@"Authorization"];
    
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration] delegate:self delegateQueue:[[NSOperationQueue alloc] init]];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        [session finishTasksAndInvalidate];
        if (!error) {
            NSString *jsonStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            NSData *newdata = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];
            NSMutableDictionary *newDict =[NSJSONSerialization JSONObjectWithData:newdata options:NSJSONReadingAllowFragments error:nil];
            if (newDict == nil) {
                newDict = [NSMutableDictionary dictionaryWithDictionary:[NSDictionary dictionaryWithXMLString:jsonStr]];
            }
            if (success) {
                success(newDict);
            }
        }else{
            if (failure) {
                failure(error);
            }
        }
    }];
    
    [dataTask resume];
}

#pragma mark - 2、身份验证
-(void)IDCheckWithName:(NSString *)name cardID:(NSString *)cardID success:(SuccessBlock)success failure:(FailureBlock)failure {}

#pragma mark - 3、移除网纹
-(void)idmarkremovalWithIDImage:(UIImage *)IDImage success:(SuccessBlock)success failure:(FailureBlock)failure {}

#pragma mark - 4、人脸检测
-(void)faceDetectWithImage:(UIImage *)image multiple_face:(BOOL)multiple_face success:(SuccessBlock)success failure:(FailureBlock)failure {
    
    NSString *request_id = [NSString stringWithFormat:@"%@:%@",kDdeviceUUID,[self getTimeString]];
    NSString *imageStr = [self base64EncodedStringData:UIImageJPEGRepresentation(image, 0.4) WithWrapWidth:0];
    //    NSString *request_id= [NSString stringWithFormat:@"%u",arc4random()];
    NSDictionary *params = @{@"request_id":request_id,                  // [string] 用户http请求的唯一标识
                             @"person_id":request_id,
                             @"multiple_face":@NO,                //[bool] 是否多人脸检测
                             @"device":@{
                                     @"plat":@"2",                // [string] 平台，其中客户端平台类型为(1->android, 2->ios, 3->pc)
                                     @"version":@"10.3.3",        // [string] 版本号
                                     @"model":@"iPhone6s+"        // [string] 机型
                                     },
                             @"file":@{
                                     @"type":@"jpeg",             // [string] 文件名称
                                     @"data":imageStr             // [string] Base64编码后的图片内容
                                     }
                             };
    
    [self basePostWithParams:params api:kDetections success:success failure:failure];
}

#pragma mark - 5、人脸比对
-(void)faceComparisonWithImage1:(UIImage *)image1 image2:(UIImage *)image2 success:(SuccessBlock)success failure:(FailureBlock)failure {
    NSString *request_id = [NSString stringWithFormat:@"%@:%@",kDdeviceUUID,[self getTimeString]];
    NSString *imageStr1 = [self base64EncodedStringData:UIImageJPEGRepresentation(image1, 0.4) WithWrapWidth:0];
    NSString *imageStr2 = [self base64EncodedStringData:UIImageJPEGRepresentation(image2, 0.4) WithWrapWidth:0];
    
    NSDictionary *params = @{@"request_id":request_id,                  // [string] 用户http请求的唯一标识
                             @"person_id":request_id,
                             @"device":@{
                                     @"plat":@"2",                // [string] 平台，其中客户端平台类型为(1->android, 2->ios, 3->pc)
                                     @"version":@"10.3.3",        // [string] 版本号
                                     @"model":@"iPhone6s+"        // [string] 机型
                                     },
                             @"file1":@{
                                     @"type":@"jpeg",             // [string] 文件名称
                                     @"data":imageStr1            // [string] Base64编码后的图片内容
                                     },
                             @"file2":@{
                                     @"type":@"jpeg",             // [string] 文件名称
                                     @"data":imageStr2            // [string] Base64编码后的图片内容
                                     }
                             };
    
    [self basePostWithParams:params api:kComparison success:success failure:failure];
}

#pragma mark - 6、活体检测
-(void)bioDetectionsWithImage:(UIImage *)image  success:(SuccessBlock)success failure:(FailureBlock)failure {
    NSString *request_id = [NSString stringWithFormat:@"%@:%@",kDdeviceUUID,[self getTimeString]];
    NSString *imageStr = [self base64EncodedStringData:UIImageJPEGRepresentation(image, 0.4) WithWrapWidth:0];
    
    //    NSString *request_id= [NSString stringWithFormat:@"%u",arc4random()];
    NSDictionary *params = @{@"request_id":request_id,                  // [string] 用户http请求的唯一标识
                             @"person_id":request_id,
                             @"device":@{
                                     @"plat":@"2",                // [string] 平台，其中客户端平台类型为(1->android, 2->ios, 3->pc)
                                     @"version":@"10.3.3",        // [string] 版本号
                                     @"model":@"iPhone6s+"        // [string] 机型
                                     },
                             @"file":@{
                                     @"type":@"jpeg",             // [string] 文件名称
                                     @"data":imageStr             // [string] Base64编码后的图片内容
                                     },
                             };
    
    [self basePostWithParams:params api:kBiodetections success:success failure:failure];
    
}

#pragma mark - 7、卡证识别
-(void)getInformationWithImage:(UIImage *)image cardType:(NSString *)type success:(SuccessBlock)success failure:(FailureBlock)failure {
    
    NSString *request_id = [NSString stringWithFormat:@"%@:%@",kDdeviceUUID,[self getTimeString]];
    NSString *imageStr = [self base64EncodedStringData:UIImageJPEGRepresentation(image, 0.4) WithWrapWidth:0];
    //    NSString *request_id= [NSString stringWithFormat:@"%u",arc4random()];
    NSDictionary *params = @{@"request_id":request_id,                  // [string] 用户http请求的唯一标识
                             @"device":@{
                                     @"plat":@"2",                // [string] 平台，其中客户端平台类型为(1->android, 2->ios, 3->pc)
                                     @"version":@"10.3.3",        // [string] 版本号
                                     @"model":@"iPhone6s+"        // [string] 机型
                                     },
                             @"card_type":@"2",
                             @"file":@{
                                     @"type":@"jpeg",             // [string] 文件名称
                                     @"data":imageStr             // [string] Base64编码后的图片内容
                                     }
                             };
    
    NSString *headStr = [self dictionaryToJson:params];
    //request
    NSMutableURLRequest * request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@%@",kBaseURL,kCardrec]] cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:15];
    //myRequestData
    NSMutableData *myRequestData = [NSMutableData dataWithCapacity:15];
    [myRequestData appendData:[headStr dataUsingEncoding:NSUTF8StringEncoding]];
    //set http body
    [request setHTTPBody:myRequestData];
    //http method
    [request setHTTPMethod:@"POST"];
    
    NSDate *dat = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a = [dat timeIntervalSince1970]*1000;
    NSString *timeString = [NSString stringWithFormat:@"%.f", a];
    
    NSString *hmac_data = [self getSignStringWithTimeStamp:timeString method:kCardrec deviceID:@"test_client" paramsJson:headStr];
    
    [request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    [request setValue:kApp_id forHTTPHeaderField:@"X-Appid"];
    [request setValue:timeString forHTTPHeaderField:@"X-Timestamp"];
    [request setValue:@"test_client" forHTTPHeaderField:@"X-Deviceid"];
    [request setValue:hmac_data forHTTPHeaderField:@"Authorization"];
    
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration] delegate:self delegateQueue:[[NSOperationQueue alloc] init]];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        [session finishTasksAndInvalidate];
        if (!error) {
            NSString *jsonStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            NSData *newdata = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];
            NSMutableDictionary *newDict =[NSJSONSerialization JSONObjectWithData:newdata options:NSJSONReadingAllowFragments error:nil];
            if (newDict == nil) {
                newDict = [NSMutableDictionary dictionaryWithDictionary:[NSDictionary dictionaryWithXMLString:jsonStr]];
            }
            if (success) {
                success(newDict);
            }
        }else{
            if (failure) {
                failure(error);
            }
        }
    }];
    
    [dataTask resume];
}

#pragma mark - 公用方法
-(void)basePostWithParams:(NSDictionary *)params api:(NSString *)api success:(SuccessBlock)success failure:(FailureBlock)failure {
    NSString *headStr = [self dictionaryToJson:params];
    //request
    NSMutableURLRequest * request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@%@",kBaseURL,api]] cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:10];
    //myRequestData
    NSMutableData *myRequestData = [NSMutableData dataWithCapacity:15];
    [myRequestData appendData:[headStr dataUsingEncoding:NSUTF8StringEncoding]];
    //set http body
    [request setHTTPBody:myRequestData];
    //http method
    [request setHTTPMethod:@"POST"];
    
    NSDate *dat = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval a = [dat timeIntervalSince1970]*1000;
    NSString *timeString = [NSString stringWithFormat:@"%.f", a];
    
    NSString *hmac_data = [self getSignStringWithTimeStamp:timeString method:api deviceID:@"test_client" paramsJson:headStr];
    
    [request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    [request setValue:kApp_id forHTTPHeaderField:@"X-Appid"];
    [request setValue:timeString forHTTPHeaderField:@"X-Timestamp"];
    [request setValue:@"test_client" forHTTPHeaderField:@"X-Deviceid"];
    [request setValue:hmac_data forHTTPHeaderField:@"Authorization"];
    
    NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration] delegate:self delegateQueue:[[NSOperationQueue alloc] init]];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSString *jsonStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            NSData *newdata = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];
            NSMutableDictionary *newDict =[NSJSONSerialization JSONObjectWithData:newdata options:NSJSONReadingAllowFragments error:nil];
            if (newDict == nil) {
                newDict = [NSMutableDictionary dictionaryWithDictionary:[NSDictionary dictionaryWithXMLString:jsonStr]];
            }
            if (success) {
                success(newDict);
            }
        }else{
            if (failure) {
                failure(error);
            }
        }
    }];
    
    [dataTask resume];
}

// 生成签名
-(NSString *)getSignStringWithTimeStamp:(NSString *)timeStamp method:(NSString *)method deviceID:(NSString *)deviceID paramsJson:(NSString *)paramsJson{
    NSMutableString *sign_data = [NSMutableString stringWithFormat:@"%@%@",@"POST",@"\n"];
    [sign_data appendString:[NSString stringWithFormat:@"%@%@",method,@"\n"]];
    [sign_data appendString:@"\n"];
    NSArray *headers = @[@{@"content-type":@"application/json;charset=utf-8"},
                         @{@"x-appid":kApp_id},
                         @{@"x-deviceid":deviceID},//ios_test_deviceid
                         @{@"x-timestamp":timeStamp},// 时间戳 timeString
                         ];
    NSMutableString *s_headers = [NSMutableString stringWithFormat:@"%@",@""];
    
    for (NSDictionary *dic in headers) {
        NSString *key =[[dic allKeys] firstObject];
        NSString *Value = [[dic allValues] firstObject];
        [sign_data appendFormat:@"%@%@%@%@",key,@":",Value,@"\n"];
        if ([s_headers isEqualToString:@""]) {
            s_headers = [NSMutableString stringWithFormat:@"%@",key];
        }else{
            [s_headers appendString:@";"];
            [s_headers appendString:key];
        }
    }
    
    [sign_data appendFormat:@"%@%@",s_headers,@"\n"];
    
    NSString *Macstr = [self SHA256:paramsJson];
    [sign_data appendFormat:@"%@",Macstr];
    
    NSString *hash_data = [self SHA256:sign_data];
    NSString *hmac_data = [self hmac:hash_data withKey:kApp_key];
    
    return hmac_data.lowercaseString;
}

//普通Post(返回JSON)
-(void)basePostWithURL:(NSString *)URL params:(NSDictionary *)params success:(SuccessBlock)success failure:(FailureBlock)failure {
    NSString *headStr = [self dictionaryToJson:params];
    //request
    NSMutableURLRequest * request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:URL]
                                                            cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                        timeoutInterval:10];
    //myRequestData
    NSMutableData *myRequestData = [NSMutableData dataWithCapacity:15];
    [myRequestData appendData:[headStr dataUsingEncoding:NSUTF8StringEncoding]];
    //set http body
    [request setHTTPBody:myRequestData];
    //http method
    [request setHTTPMethod:@"POST"];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSString *jsonStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            NSData *newdata = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];
            NSMutableDictionary *newDict =[NSJSONSerialization JSONObjectWithData:newdata options:NSJSONReadingAllowFragments error:nil];
            if (newDict == nil) {
                newDict = [NSMutableDictionary dictionaryWithDictionary:[NSDictionary dictionaryWithXMLString:jsonStr]];
            }
            
            if (success) {
                success(newDict);
            }
        }else{
            if (failure) {
                failure(error);
            }
        }
    }];
    
    [dataTask resume];
}

//拼接表单
- (NSData *)bodyDataWithParam:(NSDictionary *)param fileData:(NSArray<NSDictionary *> *)fileDatas {
    NSMutableData *bodyData = [NSMutableData data];
    //拼接常规参数
    [param enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
        [bodyData appendData:[@"--boundary\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
        [bodyData appendData:[[NSString stringWithFormat:@"Content-Disposition: form-data; name=\"%@\"\r\n\r\n",key] dataUsingEncoding:NSUTF8StringEncoding]];
        [bodyData appendData:[[NSString stringWithFormat:@"%@\r\n",obj] dataUsingEncoding:NSUTF8StringEncoding]];
    }];
    //拼接文件二进制数据
    for (NSDictionary *dic in fileDatas) {
        NSString *fieldName = dic[@"fieldName"];
        NSData *fileData = dic[@"data"];
        NSString *fileType = dic[@"fileType"];
        
        [bodyData appendData:[@"--boundary\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
        [bodyData appendData:[[NSString stringWithFormat:@"Content-Disposition: form-data; name=\"%@\"; filename=\"%@\"\r\n", @"file", [NSString stringWithFormat:@"%@.JPG", fieldName]] dataUsingEncoding:NSUTF8StringEncoding]];
        [bodyData appendData:[[NSString stringWithFormat:@"Content-Type: %@\r\n\r\n", fileType] dataUsingEncoding:NSUTF8StringEncoding]];
        [bodyData appendData:fileData];
        [bodyData appendData:[@"\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
    }
    [bodyData appendData:[@"--boundary--\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
    return bodyData;
    
}

#pragma mark - Tools
- (NSString *)getTimeString {
    NSDateFormatter* formatter = [[NSDateFormatter alloc] init];
    formatter.timeZone = [NSTimeZone timeZoneWithName:@"shanghai"];
    [formatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    NSString *dateString = [formatter stringFromDate:[NSDate date]];
    return dateString;
}

- (NSString *)SHA256:(NSString *)body_content {
    const char *s = [body_content cStringUsingEncoding:NSUTF8StringEncoding];
    NSData *keyData = [NSData dataWithBytes:s length:strlen(s)];
    
    uint8_t digest[CC_SHA256_DIGEST_LENGTH] = {0};
    CC_SHA256(keyData.bytes, (CC_LONG)keyData.length, digest);
    NSData *out = [NSData dataWithBytes:digest length:CC_SHA256_DIGEST_LENGTH];
    NSString *hash = [out description];
    hash = [hash stringByReplacingOccurrencesOfString:@" " withString:@""];
    hash = [hash stringByReplacingOccurrencesOfString:@"<" withString:@""];
    hash = [hash stringByReplacingOccurrencesOfString:@">" withString:@""];
    return hash;
}

- (NSString *)hmac:(NSString *)plaintext withKey:(NSString *)key {
    const char *cKey  = [key cStringUsingEncoding:NSASCIIStringEncoding];
    const char *cData = [plaintext cStringUsingEncoding:NSASCIIStringEncoding];
    unsigned char cHMAC[CC_SHA256_DIGEST_LENGTH];
    CCHmac(kCCHmacAlgSHA256, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
    NSData *HMACData = [NSData dataWithBytes:cHMAC length:sizeof(cHMAC)];
    const unsigned char *buffer = (const unsigned char *)[HMACData bytes];
    NSMutableString *HMAC = [NSMutableString stringWithCapacity:HMACData.length * 2];
    for (int i = 0; i < HMACData.length; ++i){
        [HMAC appendFormat:@"%02x", buffer[i]];
    }
    
    return HMAC;
}

- (NSString *)base64EncodedStringData:(NSData*)data WithWrapWidth:(NSUInteger)wrapWidth
{
    //ensure wrapWidth is a multiple of 4
    wrapWidth = (wrapWidth / 4) * 4;
    
    const char lookup[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    
    long long inputLength = [data length];
    const unsigned char *inputBytes = [data bytes];
    
    long long maxOutputLength = (inputLength / 3 + 1) * 4;
    maxOutputLength += wrapWidth? (maxOutputLength / wrapWidth) * 2: 0;
    unsigned char *outputBytes = (unsigned char *)malloc(maxOutputLength);
    
    long long i;
    long long outputLength = 0;
    for (i = 0; i < inputLength - 2; i += 3)
    {
        outputBytes[outputLength++] = lookup[(inputBytes[i] & 0xFC) >> 2];
        outputBytes[outputLength++] = lookup[((inputBytes[i] & 0x03) << 4) | ((inputBytes[i + 1] & 0xF0) >> 4)];
        outputBytes[outputLength++] = lookup[((inputBytes[i + 1] & 0x0F) << 2) | ((inputBytes[i + 2] & 0xC0) >> 6)];
        outputBytes[outputLength++] = lookup[inputBytes[i + 2] & 0x3F];
        
        //add line break
        if (wrapWidth && (outputLength + 2) % (wrapWidth + 2) == 0)
        {
            outputBytes[outputLength++] = '\r';
            outputBytes[outputLength++] = '\n';
        }
    }
    
    //handle left-over data
    if (i == inputLength - 2)
    {
        // = terminator
        outputBytes[outputLength++] = lookup[(inputBytes[i] & 0xFC) >> 2];
        outputBytes[outputLength++] = lookup[((inputBytes[i] & 0x03) << 4) | ((inputBytes[i + 1] & 0xF0) >> 4)];
        outputBytes[outputLength++] = lookup[(inputBytes[i + 1] & 0x0F) << 2];
        outputBytes[outputLength++] =   '=';
    }
    else if (i == inputLength - 1)
    {
        // == terminator
        outputBytes[outputLength++] = lookup[(inputBytes[i] & 0xFC) >> 2];
        outputBytes[outputLength++] = lookup[(inputBytes[i] & 0x03) << 4];
        outputBytes[outputLength++] = '=';
        outputBytes[outputLength++] = '=';
    }
    
    //truncate data to match actual output length
    outputBytes = realloc(outputBytes, outputLength);
    NSString *result = [[NSString alloc] initWithBytesNoCopy:outputBytes length:outputLength encoding:NSASCIIStringEncoding freeWhenDone:YES];
    
#if !__has_feature(objc_arc)
    [result autorelease];
#endif
    
    return (outputLength >= 4)? result: nil;
}


- (NSString*)dictionaryToJson:(NSDictionary *)dic {
    NSError *parseError = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:&parseError];
    
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential *))completionHandler {
    // 1.判断服务器返回的证书类型, 是否是服务器信任
    if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
        
        NSURLCredential *card = [[NSURLCredential alloc]initWithTrust:challenge.protectionSpace.serverTrust];
        completionHandler(NSURLSessionAuthChallengeUseCredential , card);
    }
}

@end
