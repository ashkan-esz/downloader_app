#import <Foundation/Foundation.h>
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

#import <Expo/Expo.h>

@interface AppDelegate : EXAppDelegateWrapper <UIApplicationDelegate, RCTBridgeDelegate>

@interface AppDelegate : RCTAppDelegate

@end
