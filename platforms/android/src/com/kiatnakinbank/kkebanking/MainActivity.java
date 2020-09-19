package com.kiatnakinbank.kkebanking;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import org.apache.cordova.CordovaActivity;

import java.util.Arrays;

public class MainActivity extends CordovaActivity {
	
	String[] forceShowPortraitModels = { 
	"H8166", "H8116", "SOV38", //Sony Xperia XZ2 Premium 
	"G020P", "G020", "GA01181-US", "GA01182-US", "GA01180-US" //Google Pixel 4 XL 
	}; 

	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);

		Context context = getApplicationContext();

		if(isTablet(context)){
			setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
		}else{
			setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
		}
    loadUrl(launchUrl);
	}
	private boolean isTablet(Context context){
 		if(Arrays.asList(forceShowPortraitModels).contains(Build.MODEL)) {
 			return false;
		}
		return (context.getResources().getConfiguration().screenLayout 
				& Configuration.SCREENLAYOUT_SIZE_MASK) 
				>= Configuration.SCREENLAYOUT_SIZE_LARGE;
	}
}
