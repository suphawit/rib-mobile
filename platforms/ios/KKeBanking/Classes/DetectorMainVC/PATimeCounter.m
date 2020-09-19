//
//  PATimeCounter.m
//  PAMovieRecorder
//
//  Created by 刘沛荣 on 2017/12/19.
//  Copyright © 2017年 pingan. All rights reserved.
//

#import "PATimeCounter.h"

@interface PATimeCounter()
{
    int _count;
}
@end

@implementation PATimeCounter

- (void)start{
    if (self.timer) {
        [self.timer invalidate];
        self.timer = nil;
    }
    _count = 0;
    self.timer = [NSTimer scheduledTimerWithTimeInterval:1.0f target:self selector:@selector(repeatShowTime:) userInfo:@"admin" repeats:YES];
}

- (void)stop {
    if (self.timer) {
        [self.timer invalidate];
        self.timer = nil;
    }
    _count = 0;
}

- (void)pause {
    [self.timer setFireDate:[NSDate distantFuture]];
}

- (void)continue {
    [self.timer setFireDate:[NSDate date]];
}

- (void)repeatShowTime:(NSTimer *)tempTimer {
    
    _count++;
    if (_delegate&& [_delegate respondsToSelector:@selector(currentTime:)]) {
        [_delegate currentTime:_count];
    }
}

- (void)dealloc {
    if (self.timer) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

@end

