//
//  PATimeCounter.h
//  PAMovieRecorder
//
//  Created by 刘沛荣 on 2017/12/19.
//  Copyright © 2017年 pingan. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol PATimeCounterDelegate <NSObject>
-(void)currentTime:(int)time;
@end

@interface PATimeCounter : NSObject
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) id<PATimeCounterDelegate>delegate;
- (void)start;
- (void)stop;
- (void)pause;
- (void)continue;
@end
