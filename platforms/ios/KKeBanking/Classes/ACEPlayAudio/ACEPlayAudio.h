//
//  ACEPlayAudio.h
//  PAFaceDetectSDK
//
//  Created by 刘沛荣 on 2018/7/17.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ACEPlayAudio : NSObject

/**
 *  音乐播放管理器
 */
+ (instancetype)sharedAudioPlayer;

/**
 *  开始播放
 */
- (void)play;

/**
 *  暂停播放
 */
- (void)stop;

/**
 *  设置播放的数据
 *  @param  data  音乐的 data
 */
- (void)setplayData:(NSData *)data;


/**
 *  设置音乐播放的路径（非网络音乐）
 *  @param  url  歌曲路径
 */
- (void)setplayURL:(NSURL *)url;


- (void)playWithFileName:(NSString *)name;
@end
