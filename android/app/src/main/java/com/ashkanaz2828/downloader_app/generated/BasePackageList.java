package com.ashkanaz2828.downloader_app.generated;

import java.util.Arrays;
import java.util.List;
import org.unimodules.core.interfaces.Package;

public class BasePackageList {
  public List<Package> getPackageList() {
    return Arrays.<Package>asList(
        new expo.modules.application.ApplicationPackage(),
        new expo.modules.av.AVPackage(),
        new expo.modules.clipboard.ClipboardPackage(),
        new expo.modules.constants.ConstantsPackage(),
        new expo.modules.errorrecovery.ErrorRecoveryPackage(),
        new expo.modules.filesystem.FileSystemPackage(),
        new expo.modules.font.FontLoaderPackage(),
        new expo.modules.imageloader.ImageLoaderPackage(),
        new expo.modules.keepawake.KeepAwakePackage(),
        new expo.modules.lineargradient.LinearGradientPackage(),
        new expo.modules.medialibrary.MediaLibraryPackage(),
        new expo.modules.splashscreen.SplashScreenPackage(),
        new expo.modules.updates.UpdatesPackage()
    );
  }
}
