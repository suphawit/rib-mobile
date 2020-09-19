//
//  SuccessVC.h
//  PAFaceSDKDemo
//
//  Created by prliu on 16/6/6.
//  Copyright © 2016年 pingan. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^BackBlock)(void);

@interface SuccessVC : UIViewController

@property (weak, nonatomic) IBOutlet UIImageView *imageView;
@property (weak, nonatomic) IBOutlet UILabel *image_size;
@property (weak, nonatomic) IBOutlet UILabel *image_xy;
@property (weak, nonatomic) IBOutlet UILabel *image_wh;
@property (weak, nonatomic) IBOutlet UILabel *face_brightness;
@property (weak, nonatomic) IBOutlet UILabel *face_fuzzy;
@property (weak, nonatomic) IBOutlet UILabel *eye_score;

@property (weak, nonatomic) IBOutlet UILabel *living_value;
@property (weak, nonatomic) IBOutlet UIButton *isliving;

@property (weak, nonatomic) IBOutlet UIButton *restart;
@property (weak, nonatomic) IBOutlet UIButton *saveimage;
@property (weak, nonatomic) IBOutlet UILabel *authLabel;

@property (weak, nonatomic) IBOutlet UIImageView *headImage;
@property (weak, nonatomic) IBOutlet UIImageView *eyeImage;
@property (weak, nonatomic) IBOutlet UIImageView *mouthImage;
-(void)backAacion:(BackBlock)block;
@end
