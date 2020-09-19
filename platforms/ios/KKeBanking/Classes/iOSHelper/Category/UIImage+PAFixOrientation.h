//
//  UIImage+PAFixOrientation.h
//  PALivenessDetector
//
//  Created by 刘沛荣 on 15/11/3.
//  Copyright © 2015年 PA. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (PAFixOrientation)

- (UIImage *)PACroppedImage:(CGRect)bounds;
- (UIImage *)PAFixOrientation;

@end
