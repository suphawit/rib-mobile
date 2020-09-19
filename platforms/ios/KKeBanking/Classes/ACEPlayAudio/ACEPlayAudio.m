//
//  ACEPlayAudio.m
//  PAFaceDetectSDK
//
//  Created by 刘沛荣 on 2018/7/17.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#import "ACEPlayAudio.h"
#import <AVFoundation/AVFoundation.h>

@interface ACEPlayAudio()
{
    NSString *_name_old;
    int _playCount;
    
}
@property (strong, nonatomic) AVAudioPlayer *audioPlayer;

@end

@implementation ACEPlayAudio


+ (id)sharedAudioPlayer
{
    static ACEPlayAudio *audioPlayer ;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        audioPlayer = [[ACEPlayAudio alloc] init];
    });
    
    return audioPlayer;
}

- (instancetype)init{
    self = [super init];
    if (self) {
        
        _playCount = 0;
        
    }
    return self;
}

- (void)play
{
    [self.audioPlayer stop];
    [self.audioPlayer play];
    //    NSLog(@"播放。 ");
}

- (void)stop
{
    if (self.audioPlayer) {
        [self.audioPlayer stop];
    }
}



- (void)setplayData:(NSData *)data
{
    NSError *error;
    
    if (self.audioPlayer != nil) {
        self.audioPlayer = nil;
    }
    self.audioPlayer = [[AVAudioPlayer alloc] initWithData:data error:&error];
    [self.audioPlayer prepareToPlay];
    
}

- (void)setplayURL:(NSURL *)url{
    NSError *error;
    if (self.audioPlayer != nil) {
        self.audioPlayer = nil;
    }
    self.audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:&error];
    
    [self.audioPlayer prepareToPlay];
}
- (void)playWithFileName:(NSString *)name{
    
    AVAudioSession *session = [AVAudioSession sharedInstance];
    [session setCategory:AVAudioSessionCategoryPlayback error:nil];
    if (name && name.length > 0 && !self.audioPlayer.isPlaying) {
        if ([name isEqualToString:_name_old]) {
            _playCount ++;
            if (_playCount>80) {
                _name_old = nil;
                _playCount = 0;
            }
            return;
        }
        NSString *path = [[NSBundle mainBundle] pathForResource:name ofType:@"mp3"];
        
        NSData *data = [NSData dataWithContentsOfFile:path];

        [self stop];
        [self setplayData:data];
        [self play];

        
    }
    _name_old = name;
    
}

@end
