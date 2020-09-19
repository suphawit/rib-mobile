//
//  SuccessVC.m
//  PAFaceSDKDemo
//
//  Created by prliu on 16/6/6.
//  Copyright © 2016年 pingan. All rights reserved.
//

#import "SuccessVC.h"
#import "PAZCLDefineTool.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import "SVProgressHUD.h"
#import "AppDelegate.h"
#import "APIManager.h"

@interface SuccessVC ()
{
    AppDelegate *_appdelegate;
}
@property (nonatomic ,strong) UIButton *backButton;
@property (nonatomic, copy) BackBlock blackBlock;
@property (nonatomic ,strong) UIButton *backButtonBg;
@property (weak, nonatomic) IBOutlet UIScrollView *scrollView;

@end

@implementation SuccessVC

- (instancetype)init
{
    
    self = [super init];
    if (self) {
            self->_appdelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
        NSString *nibName ;
        if ([[self->_appdelegate identifier] containsString:@"iPhone5"]|| [[self->_appdelegate identifier] containsString:@"iPhoneSE"]||[[self->_appdelegate identifier] containsString:@"iPhone4"]) {
            nibName = @"SuccessVC5S";
        }else{
            nibName = @"SuccessVC";
        }
        self = [self initWithNibName:nibName bundle:nil];
        NSLog(@"nibName:%@",nibName);
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    _appdelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    
}

- (UIStatusBarStyle)preferredStatusBarStyle{
    
    return UIStatusBarStyleLightContent;
    
}

-(void)viewDidAppear:(BOOL)animated{
    
    [super viewDidAppear:animated];
    self.scrollView.contentSize = CGSizeMake(self.view.bounds.size.width, self.view.bounds.size.height+300);
    self.scrollView.delaysContentTouches = NO;
}


-(void)viewDidLayoutSubviews{
    
    [super viewDidLayoutSubviews];
    [self initBar];
    [self.saveimage addTarget:self action:@selector(saveBt) forControlEvents:UIControlEventTouchDown];
    [self.restart addTarget:self action:@selector(restStart) forControlEvents:UIControlEventTouchDown];
    [self.view bringSubviewToFront:self.saveimage];
    [self.view bringSubviewToFront:self.restart];
    
}

-(BOOL)touchesShouldCancelInContentView:(UIView *)view
{
    return YES;
}

-(void)backAacion:(BackBlock)block{
    
    
    self.blackBlock = block;
    
    
}

- (void)initBar{
    
    UIView *backView = [[UIView alloc]initWithFrame:self.view.bounds];
    [backView setBackgroundColor:[UIColor clearColor]];
    [self.view addSubview:backView];
    
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
    [title setText:@"Face Recognition"];
    [title setFrame:CGRectMake(self.view.bounds.size.width/2-100, CGRectGetMinY(self.backButton.frame), 200, CGRectGetHeight(self.backButton.frame))];
    [title setTextColor:PAColorWithRGB(255, 255, 255, 1)];
    [title setTextAlignment:NSTextAlignmentCenter];
    [title setFont:[UIFont systemFontOfSize:18]];
    [bar addSubview:title];
    
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

-(void)saveBt{
    
    __block ALAssetsLibrary *lib = [[ALAssetsLibrary alloc] init];
    [lib writeImageToSavedPhotosAlbum:self.imageView.image.CGImage metadata:nil completionBlock:^(NSURL *assetURL, NSError *error) {
        
        //NSLog(@"assetURL = %@, error = %@", assetURL, error);
        lib = nil;
        MAIN_ACTION(^{
            [SVProgressHUD showSuccessWithStatus:@"Successfully saved" duration:3];
        });
        
    }];
    
}

-(void)stopDetection:(UIButton*)bt{
    
    self.imageView.image = nil;
    UIViewController * presentingViewController = self.presentingViewController; while (presentingViewController.presentingViewController) {     presentingViewController = presentingViewController.presentingViewController; }
    [presentingViewController dismissViewControllerAnimated:YES completion:nil];
    
}


-(void)restStart{
    
    self.blackBlock();
    
}
-(void)dealloc{
    
    NSLog(@"Success dealloc");
    
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
