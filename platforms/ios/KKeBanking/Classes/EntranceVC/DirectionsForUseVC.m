//
//  DirectionsForUseVC.m
//  AceFaceDetectDemo
//
//  Created by 刘沛荣 on 2018/4/23.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#import "DirectionsForUseVC.h"
#import "PAZCLDefineTool.h"
#import "AppDelegate.h"

@interface DirectionsForUseVC (){
    AppDelegate *_appdelegate;
}
@property (nonatomic ,strong) UIButton *backButton;
@property (nonatomic ,strong) UIButton *backButtonBg;
@end

@implementation DirectionsForUseVC

- (instancetype)init
{
    
    self = [super init];
    if (self) {
        _appdelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
        NSString *nibName ;
        
        if([[_appdelegate identifier] containsString:@"iPhoneX"]){
            
            nibName = @"DirectionsForUseVCX";
            
            
        }else{
            
            nibName = @"DirectionsForUseVC";
            
        }
        NSLog(@"nibName:%@",nibName);
        self = [self initWithNibName:nibName bundle:nil];
    }
    return self;
}


- (void)viewDidLoad {
    [super viewDidLoad];
    _appdelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    // Do any additional setup after loading the view from its nib.
}

-(void)viewDidLayoutSubviews{
    
    [super viewDidLayoutSubviews];
    [self initBar];
    
}

- (UIStatusBarStyle)preferredStatusBarStyle{
    
    return UIStatusBarStyleLightContent;
    
}
- (void)initBar{
    
    UIView *backView = [[UIView alloc]initWithFrame:self.view.bounds];
    [backView setBackgroundColor:[UIColor clearColor]];
    [self.view addSubview:backView];
    
    
    _appdelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    
    int barH ;
    if([[_appdelegate identifier] isEqualToString:@"iPhoneX"]){
        
        barH = 84;
        
    }else{
        
        barH = 64;
        
    }
    
    UIView *bar = [[UIView alloc]init];
    bar.backgroundColor = [UIColor colorWithRed:11/255.0 green:36/255.0 blue:86
                           /255.0 alpha:1];
    [bar setFrame:CGRectMake(0, 0, kScreenWidth , barH)];
    [self.view bringSubviewToFront:backView];
    [backView addSubview:bar];
    
    self.backButton.frame =CGRectMake(20, bar.bounds.size.height-10-20, 20*0.6315, 20);
    [bar addSubview:self.backButton];
    self.backButtonBg.frame =CGRectMake(10, 25, 50*0.6315, 50);
    [bar addSubview:self.backButtonBg];
    
    UILabel *title = [[UILabel alloc]init];
    [title setText:@"用户指引"];
    [title setFrame:CGRectMake(self.view.bounds.size.width/2-100, CGRectGetMinY(self.backButton.frame), 200, CGRectGetHeight(self.backButton.frame))];
    [title setTextColor:PAColorWithRGB(255, 255, 255, 1)];
    [title setTextAlignment:NSTextAlignmentCenter];
    [title setFont:[UIFont systemFontOfSize:18]];
    [bar addSubview:title];
    
    UIImage *img = [UIImage imageNamed:@"使用指引.png"];
    UIImageView *directIG = [[UIImageView alloc]initWithFrame:CGRectMake(0, 0, kScreenSize.width, img.size.height)];
    directIG.contentMode = UIViewContentModeScaleAspectFit;
    UIScrollView * scrollview = [[UIScrollView alloc] initWithFrame:CGRectMake(0, barH, kScreenSize.width , kScreenSize.height-barH)];
    scrollview.contentSize = CGSizeMake(0,img.size.height+barH);
    directIG.image = img;
    [scrollview addSubview:directIG];
    [self.view addSubview:scrollview];
}


-(UIButton *)backButton{
    
    if (!_backButton) {
        UIImage *butImage = [UIImage imageNamed:@"返回icon"];
        _backButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backButton setBackgroundColor:[UIColor clearColor]];
        [_backButton setBackgroundImage:butImage forState:UIControlStateNormal];
        [_backButton addTarget:self action:@selector(stopDetection:) forControlEvents:UIControlEventTouchDown];
    }
    return _backButton;
}

-(UIButton *)backButtonBg{
    
    if (!_backButtonBg) {
        _backButtonBg = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backButtonBg setBackgroundColor:[UIColor clearColor]];
        [_backButtonBg addTarget:self action:@selector(stopDetection:) forControlEvents:UIControlEventTouchDown];
    }
    return _backButtonBg;
}

-(void)stopDetection:(UIButton*)bt{
    
    [self dismissViewControllerAnimated:YES completion:nil];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */

@end
