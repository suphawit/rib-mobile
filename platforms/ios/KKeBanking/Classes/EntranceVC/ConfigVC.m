//
//  ConfigVC.m
//  AceFaceDetectDemo
//
//  Created by 刘沛荣 on 2018/9/7.
//  Copyright © 2018年 刘沛荣. All rights reserved.
//

#import "ConfigVC.h"
#import "AppDelegate.h"
#import "PAZCLDefineTool.h"

@interface ConfigVC ()
{
    AppDelegate *_appdelegate;
    
}
// 控件数组
@property (nonatomic, strong) NSMutableArray *actionBtArray;
// 标签数组
@property (nonatomic, strong) NSMutableArray *actionArray;
// 标签字典
@property (nonatomic, strong) NSDictionary *actionDict;
// 选中标签数组(数字)
@property (nonatomic, strong) NSMutableArray *selectedActionArray;
// 选中标签数组(文字字符串)
@property (nonatomic, strong) NSMutableArray *selectedActionStrArray;
// 选中标签数组(plan)
@property (nonatomic, strong) NSString *selectedPlanType;

@property (nonatomic ,strong) UIButton *backButton;
@property (nonatomic ,strong) UIButton *backButtonBg;

@property (nonatomic ,strong) UIButton *planAbtn;
@property (nonatomic ,strong) UIButton *planBbtn;
@property (nonatomic ,strong) UIButton *custombtn;

@end

@implementation ConfigVC

#define PAUnselectedColor [UIColor colorWithRed:(241)/255.0 green:(242)/255.0 blue:(243)/255.0 alpha:1.0]
#define PASelectedColor [UIColor colorWithRed:(128)/255.0 green:(177)/255.0 blue:(34)/255.0 alpha:1.0]

/**
 * 按钮多选处理
 */
- (void)chooseMark:(UIButton *)btn {
    
    btn.selected = !btn.selected;
    
    if ([btn.currentTitle isEqualToString:@"Option 1: Random two actions + silent living body + back end living body"] || [btn.currentTitle isEqualToString:@"Option 2: Random two actions + back end living body"] || [btn.currentTitle isEqualToString:@"Customize"]) {
        
        if (btn.isSelected) {
            
            NSString *montion1 ;
            NSString *montion2 ;
            
            do {
                
                montion1 = [self randActionType];
                montion2 = [self randActionType];
                
            } while ([montion1 isEqualToString: montion2] || [montion1 isEqualToString:@"1007"] ||[montion2 isEqualToString:@"1007"]);
            
            //先清除
            [self.selectedActionArray removeAllObjects];
            
            //更新UI
            self.selectedPlanType = btn.titleLabel.text;
            
            if ([btn.currentTitle isEqualToString:@"Option 1: Random two actions + silent living body + back end living body"]) {
                
                self.planAbtn.selected = YES;
                self.planBbtn.selected = NO;
                self.custombtn.selected = NO;
                for (UIButton *bt in self.actionBtArray) {
                    bt.userInteractionEnabled = NO;
                }
                if (![self.selectedActionArray containsObject:@"1007"]) {
                    [self.selectedActionArray addObject:@"1007"];
                }
                
            }else if ([btn.currentTitle isEqualToString:@"Option 2: Random two actions + back end living body"]) {
                
                self.planAbtn.selected = NO;
                self.planBbtn.selected = YES;
                self.custombtn.selected = NO;
                
                for (UIButton *bt in self.actionBtArray) {
                    bt.userInteractionEnabled = NO;
                }
                if ([self.selectedActionArray containsObject:@"1007"]) {
                    [self.selectedActionArray removeObject:@"1007"];
                }
                
            }else{
                
                self.planAbtn.selected = NO;
                self.planBbtn.selected = NO;
                self.custombtn.selected = YES;
                
                for (UIButton *bt in self.actionBtArray) {
                    bt.userInteractionEnabled = YES;
                }
                [self.selectedActionArray removeAllObjects];
                for (UIButton *bt in self.actionBtArray) {
                    bt.selected = NO;
                }
                
                [self.selectedActionStrArray removeAllObjects];
                
                NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
                [userDefaults setObject:self.selectedActionArray forKey:@"DemoMotionType"];
                [userDefaults setObject:self.selectedPlanType forKey:@"DemoPlanType"];
                [userDefaults synchronize];
                return;
                
            }
            
            NSLog(@"montion1:%@",montion1);
            NSLog(@"montion2:%@",montion2);
            
            //后添加
            if (![self.selectedActionArray containsObject:montion1]) {
                [self.selectedActionArray addObject:montion1];
                
            }
            if (![self.selectedActionArray containsObject:montion2]) {
                [self.selectedActionArray addObject:montion2];
            }
            
            //更新已经选择内容
            for (int i = 0; i<self.actionBtArray.count; i++) {
                
                UIButton *bt = self.actionBtArray[i];
                NSString *btStr = [self.actionDict objectForKey:bt.currentTitle];
                NSLog(@"btStr:%@",btStr);
                
                if ([montion1 isEqualToString:btStr] || [montion2 isEqualToString:btStr] || [@"1007" isEqualToString:btStr]) {
                    if ([@"1007" isEqualToString:btStr]) {
                        if ([self.selectedActionArray containsObject:@"1007"] ) {
                            bt.selected = YES;
                        }else{
                            bt.selected = NO;
                        }
                    }else{
                        bt.selected = YES;
                    }
                }else {
                    bt.selected = NO;
                }
                
                
            }
            
            
        }
        
        
    }else{
        
        if (btn.isSelected) {
            //btn.backgroundColor = PASelectedColor;
            [self.selectedActionArray addObject:self.actionDict[btn.titleLabel.text]];
            [self.selectedActionStrArray addObject:btn.titleLabel.text];
        } else {
            //btn.backgroundColor = PAUnselectedColor;
            [self.selectedActionArray removeObject:self.actionDict[btn.titleLabel.text]];
            [self.selectedActionStrArray removeObject:btn.titleLabel.text];
        }
    }
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    [userDefaults setObject:self.selectedActionArray forKey:@"DemoMotionType"];
    [userDefaults setObject:self.selectedPlanType forKey:@"DemoPlanType"];
    [userDefaults synchronize];
}

//随机一个动作
- (NSString*)randActionType{
    
    NSInteger type = arc4random()%(self.actionArray.count);
    NSString *detectionType = [self.actionDict objectForKey:self.actionArray[type]];
    return detectionType;
    
}

/**
 * 确认接口请求处理
 */
- (void)sureBtnClick {
    
    [self dismissViewControllerAnimated:YES completion:nil];
    
}

- (void)setupMultiselectView {
    
    NSArray *motionArr = [[NSUserDefaults standardUserDefaults] objectForKey:@"DemoMotionType"];
    if (![self.selectedActionArray containsObject:@"1001"]) {
        [self.selectedActionArray addObject:@"1001"];
    }
    for (int i = 0; i<motionArr.count; i++) {
        if (![motionArr[i] isEqualToString:@"1001"]) {
            [self.selectedActionArray addObject:motionArr[i]];
        }
    }
    
    CGFloat UI_View_Width = [UIScreen mainScreen].bounds.size.width;
    CGFloat marginX = 15;
    CGFloat top = 19;
    CGFloat btnH = 35;
    CGFloat marginH = 40;
    CGFloat height = 350;
    CGFloat width = (UI_View_Width - marginX * 4) / 3;
    
    // 按钮背景
    UIView *btnsBgView = [[UIView alloc] initWithFrame:CGRectMake(0, 100, UI_View_Width, height)];
    btnsBgView.backgroundColor = [UIColor whiteColor];
    [self.view addSubview:btnsBgView];
    
    // 循环创建按钮
    NSInteger maxCol = 3;
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    
    for (NSInteger i = 0; i < self.actionArray.count; i++) {
        
        UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
        btn.layer.cornerRadius = 3.0; // 按钮的边框弧度
        btn.clipsToBounds = YES;
        btn.titleLabel.font = [UIFont boldSystemFontOfSize:14];
        [btn setTitleColor:[UIColor colorWithRed:(102)/255.0 green:(102)/255.0 blue:(102)/255.0 alpha:1.0] forState:UIControlStateNormal];
        [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateSelected];
        [btn addTarget:self action:@selector(chooseMark:) forControlEvents:UIControlEventTouchUpInside];
        
        CGRect temp = btn.frame;
        
        NSInteger col = i % maxCol; //列
        temp.origin.x = marginX + col * (width + marginX);
        NSInteger row = i / maxCol; //行
        temp.origin.y = top + row * (btnH + marginX);
        temp.size.width = width;
        temp.size.height = btnH;
        
        btn.frame = temp;
        
        [btn setTitle:self.actionArray[i] forState:UIControlStateNormal];
        
        //同步
        NSArray *demoMotionArr = [userDefaults objectForKey:@"DemoMotionType"];
        NSString *demoMotionIndex = [self.actionDict objectForKey:self.actionArray[i]];
        [btn setBackgroundImage:[self imageWithColor:PASelectedColor retct:btn.bounds] forState:UIControlStateSelected];
        [btn setBackgroundImage:[self imageWithColor:PAUnselectedColor retct:btn.bounds] forState:UIControlStateNormal];
        if ([demoMotionArr containsObject:demoMotionIndex]) {
            btn.selected = YES;
        }else{
            btn.selected = NO;
            
        }
        [self.actionBtArray addObject:btn];
        [btnsBgView addSubview:btn];
    }
    NSString *planType = [userDefaults objectForKey:@"DemoPlanType"];
    
    //计划单独按钮
    // @"方案一:随机两种动作+静默活体+后端活体": @"1007",
    self.planAbtn = [UIButton buttonWithType:UIButtonTypeCustom];
    self.planAbtn.layer.cornerRadius = 3.0; // 按钮的边框弧度
    self.planAbtn.clipsToBounds = YES;
    self.planAbtn.titleLabel.font = [UIFont boldSystemFontOfSize:14];
    [self.planAbtn setTitleColor:[UIColor colorWithRed:(102)/255.0 green:(102)/255.0 blue:(102)/255.0 alpha:1.0] forState:UIControlStateNormal];
    [self.planAbtn setTitleColor:[UIColor whiteColor] forState:UIControlStateSelected];
    [self.planAbtn addTarget:self action:@selector(chooseMark:) forControlEvents:UIControlEventTouchUpInside];
    [self.planAbtn setTitle:@"Option 1: Random two actions + silent living body + back end living body" forState:UIControlStateNormal];
    [self.planAbtn setContentMode:UIViewContentModeLeft];
    CGRect temp = self.planAbtn.frame;
    temp.origin.x = 0;
    NSInteger row = self.actionArray.count / maxCol + 1; //行
    temp.origin.y = top + row * (btnH + marginX);
    temp.size.width = UI_View_Width;
    temp.size.height = btnH;
    self.planAbtn.frame = temp;
    [self.planAbtn setBackgroundImage:[self imageWithColor:PASelectedColor retct:self.planAbtn.bounds] forState:UIControlStateSelected];
    [self.planAbtn setBackgroundImage:[self imageWithColor:PAUnselectedColor retct:self.planAbtn.bounds] forState:UIControlStateNormal];
    [btnsBgView addSubview:self.planAbtn];
    
    // @"方案二:随机两种动作+后端活体" : @"1007",
    self.planBbtn = [UIButton buttonWithType:UIButtonTypeCustom];
    self.planBbtn.layer.cornerRadius = 3.0; // 按钮的边框弧度
    self.planBbtn.clipsToBounds = YES;
    self.planBbtn.titleLabel.font = [UIFont boldSystemFontOfSize:14];
    [self.planBbtn setTitleColor:[UIColor colorWithRed:(102)/255.0 green:(102)/255.0 blue:(102)/255.0 alpha:1.0] forState:UIControlStateNormal];
    [self.planBbtn setTitleColor:[UIColor whiteColor] forState:UIControlStateSelected];
    [self.planBbtn addTarget:self action:@selector(chooseMark:) forControlEvents:UIControlEventTouchUpInside];
    [self.planBbtn setTitle:@"Option 2: Random two actions + back end living body" forState:UIControlStateNormal];
    [self.planBbtn setContentMode:UIViewContentModeLeft];
    CGRect temp_planB = self.planBbtn.frame;
    temp_planB.origin.x = 0;
    temp_planB.origin.y = CGRectGetMaxY(self.planAbtn.frame) +top;
    temp_planB.size.width = UI_View_Width;
    temp_planB.size.height = btnH;
    self.planBbtn.frame = temp_planB;
    [self.planBbtn setBackgroundImage:[self imageWithColor:PASelectedColor retct:self.planBbtn.bounds] forState:UIControlStateSelected];
    [self.planBbtn setBackgroundImage:[self imageWithColor:PAUnselectedColor retct:self.planBbtn.bounds] forState:UIControlStateNormal];
    [btnsBgView addSubview:self.planBbtn];
    
    // 正脸+?....
    self.custombtn = [UIButton buttonWithType:UIButtonTypeCustom];
    self.custombtn.layer.cornerRadius = 3.0; // 按钮的边框弧度
    self.custombtn.clipsToBounds = YES;
    self.custombtn.titleLabel.font = [UIFont boldSystemFontOfSize:14];
    [self.custombtn setTitleColor:[UIColor colorWithRed:(102)/255.0 green:(102)/255.0 blue:(102)/255.0 alpha:1.0] forState:UIControlStateNormal];
    [self.custombtn setTitleColor:[UIColor whiteColor] forState:UIControlStateSelected];
    [self.custombtn addTarget:self action:@selector(chooseMark:) forControlEvents:UIControlEventTouchUpInside];
    [self.custombtn setTitle:@"Customize" forState:UIControlStateNormal];
    [self.custombtn setContentMode:UIViewContentModeLeft];
    CGRect temp_custom = self.custombtn.frame;
    temp_custom.origin.x = 0;
    temp_custom.origin.y = CGRectGetMaxY(self.planBbtn.frame) +top;
    temp_custom.size.width = UI_View_Width;
    temp_custom.size.height = btnH;
    self.custombtn.frame = temp_custom;
    [self.custombtn setBackgroundImage:[self imageWithColor:PASelectedColor retct:self.custombtn.bounds] forState:UIControlStateSelected];
    [self.custombtn setBackgroundImage:[self imageWithColor:PAUnselectedColor retct:self.custombtn.bounds] forState:UIControlStateNormal];
    [btnsBgView addSubview:self.custombtn];
    
    if ([planType  isEqualToString:self.planAbtn.currentTitle]) {
        self.planAbtn.selected = YES;
        self.planBbtn.selected = NO;
        self.custombtn.selected = NO;
        for (UIButton *bt in self.actionBtArray) {
            bt.userInteractionEnabled = NO;
        }
    }else if ( [planType  isEqualToString:self.planBbtn.currentTitle]){
        self.planAbtn.selected = NO;
        self.planBbtn.selected = YES;
        self.custombtn.selected = NO;
        for (UIButton *bt in self.actionBtArray) {
            bt.userInteractionEnabled = NO;
        }
    }else{
        self.planAbtn.selected = NO;
        self.planBbtn.selected = NO;
        self.custombtn.selected = YES;
        for (UIButton *bt in self.actionBtArray) {
            bt.userInteractionEnabled = YES;
        }
    }
    // 确定按钮
    
    UIButton *surebtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [surebtn setTitle:@"Set" forState:UIControlStateNormal];
    surebtn.frame = CGRectMake(marginX * 2, CGRectGetMaxY(btnsBgView.frame) + marginH, UI_View_Width - marginX * 4, 40);
    surebtn.titleLabel.font = [UIFont boldSystemFontOfSize:16];
    [surebtn addTarget:self action:@selector(sureBtnClick) forControlEvents:UIControlEventTouchUpInside];
    surebtn.backgroundColor = [UIColor orangeColor];
    surebtn.layer.cornerRadius = 3.0;
    surebtn.clipsToBounds = YES;
    [self.view addSubview:surebtn];
}



-(UIImage*) imageWithColor:(UIColor*)color retct:(CGRect)btRect

{
    UIGraphicsBeginImageContext(btRect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, btRect);
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
    
}

#pragma mark - 懒加载

-(NSMutableArray *)actionBtArray{
    
    if (!_actionBtArray) {
        _actionBtArray = [NSMutableArray array];
    }
    return _actionBtArray;
}

- (NSMutableArray *)actionArray {
    if (!_actionArray) {
//        _actionArray = [NSMutableArray arrayWithArray:@[@"Open Mouth" , @"Blink" ,@"Shanke Head", @"Face Left", @"Face Right", @"Silent Detection"]];
         _actionArray = [NSMutableArray arrayWithArray:@[@"Open Mouth" , @"Blink"]];
    }
    return _actionArray;
}

- (NSDictionary *)actionDict {
    if (!_actionDict) {
        _actionDict = @{
                        @"Open Mouth" : @"1002" ,
                        @"Blink" : @"1003",
//                        @"Shake Head" : @"1004",
//                        @"Face Left" : @"1005",
//                        @"Face Right" : @"1006",
//                        @"Silent Detection" : @"1007",
                        };
    }
    return _actionDict;
}

-(NSMutableArray *)selectedActionArray{
    
    if (!_selectedActionArray) {
        _selectedActionArray = [NSMutableArray array];
    }
    return _selectedActionArray;
    
}

- (NSMutableArray *)selectedActionStrArray{
    if (!_selectedActionStrArray) {
        _selectedActionStrArray = [NSMutableArray array];
    }
    return _selectedActionStrArray;
}

- (void)viewDidLoad {
    
    self.view.backgroundColor = [UIColor whiteColor];
    [super viewDidLoad];
    [self initBar];
    [self setupMultiselectView];
    // Do any additional setup after loading the view from its nib.
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
    [title setText:@"Face recognition"];
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
