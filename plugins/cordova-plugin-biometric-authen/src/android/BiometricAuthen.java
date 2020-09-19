package com.kkebanking.biometricauthen;

import java.security.Signature;
import java.util.*;
import java.lang.reflect.Method;
import java.lang.reflect.InvocationTargetException;
import java.math.BigInteger; 
import java.security.MessageDigest; 
import java.security.NoSuchAlgorithmException; 
import com.kkebanking.biometricauthen.Biometric.FingerprintAuthenticationDialogFragment;
import com.kkebanking.biometricauthen.encrypt.EncryptionServices;
import java.util.Locale; 
import android.os.Bundle; 
import android.content.Intent; 
import android.content.res.Configuration; 
import android.content.res.Resources; 
import android.util.DisplayMetrics; 
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.TargetApi;
import android.app.FragmentManager;
import android.app.KeyguardManager;
import android.hardware.fingerprint.FingerprintManager;
import android.util.Log;
import android.content.Context;
import android.content.SharedPreferences;
/**
 * This class echoes a string called from JavaScript.
 */
@TargetApi(23)
public class BiometricAuthen extends CordovaPlugin implements FingerprintAuthenticationDialogFragment.Callback {
    public static final int REQUEST_CODE = 777777777;
    public CordovaWebView webView;
    public CordovaInterface cordova;
    public FingerprintManager mFingerPrintManager;
    public FragmentManager fragmentManager;
    public static String packageName;
   
    public static CallbackContext mCallbackContext;
    public static Context baseContext;
    public EncryptionServices encryptionServices;
    public String clientID;
    public FingerprintAuthenticationDialogFragment fragment;
    public KeyguardManager keyguardManager;
    public String challenge;
    public String lang;
    public SharedPreferences mSharedPreferences;
    private Resources mRes;
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        mCallbackContext = callbackContext;
        // Log.v("FINGER", "FingerprintAuth action: " + action);
        // if (android.os.Build.VERSION.SDK_INT < 23) {
        //     Log.e("SDK", "minimum SDK version 23 required");
        // }
        // Log.v("FINGER", "FingerprintAuth action ----->: " + action);
      

        if (action.equals("isAvailable")) {
               isFingerprintAuthAvailable();
      
        }
        if (action.equals("isBioStateChanged")) {
            isBiometricStateChanged();
        }
        if(action.equals("setBioState")){
            setValueBiometricStateChangedPreference();
        }
       
        
        JSONObject arg_object = args.getJSONObject(0);
        // clientID= args.getString(0);
        clientID = arg_object.getString("clientID");
        // Log.d("ARGS", clientID);

        if (action.equals("activate")) {
            activate();
        }
        if (action.equals("deactivate")) {
            deactivate();
        }
        challenge = arg_object.getString("challenge");
        // Log.d("ARGS2", challenge);
        if (action.equals("sign")) {
            signData();
        }
            lang = arg_object.getString("lang");

         // Change locale settings in the app.
         DisplayMetrics dm = mRes.getDisplayMetrics();
         Configuration conf = mRes.getConfiguration();
         conf.locale = new Locale(lang);
         mRes.updateConfiguration(conf, dm);
         // Log.d("change",lang);
        if (action.equals("authenticate")) {
         
           onFingerprint();
                           
        }

        return true;
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        fragmentManager = cordova.getActivity().getFragmentManager();
        fragment = new FingerprintAuthenticationDialogFragment();
        encryptionServices = new EncryptionServices(cordova.getActivity().getApplicationContext());
        baseContext = cordova.getActivity().getApplicationContext();
        packageName = cordova.getActivity().getApplicationContext().getPackageName();
       
        keyguardManager = cordova.getActivity().getApplicationContext().getSystemService(KeyguardManager.class);
        mFingerPrintManager = cordova.getActivity().getApplicationContext().getSystemService(FingerprintManager.class);
        mSharedPreferences= baseContext.getSharedPreferences("STATE_BIOMETRIC",Context.MODE_PRIVATE); 
        mRes = cordova.getActivity().getResources();
   
        if (android.os.Build.VERSION.SDK_INT < 23) {
            return;
        }

    }

    public Boolean isValidKey() {
        // Log.d("Clientid", clientID);
        return encryptionServices.checkKey(clientID);
    }

    public void onFingerprint() {
        // changeLanguage(lang);
  
        if (isValidKey()) {
            Signature initSign = encryptionServices.getSignData(clientID);
            if(fragment.isAdded() == false){
                if (initSign != null) {
                Log.d("fragment",Boolean.toString(fragment.isAdded()));
                fragment.setCallback(this);
                fragment.setFingerprintManager(mFingerPrintManager);
                fragment.setCryptoObject(new FingerprintManager.CryptoObject(initSign));
                fragment.show(fragmentManager, "777777777");
                // Log.d("Scan", "scan");
            }
            
            }else{
                Log.d("fragment","error");
            }
            
        }else{
            boolean isValidKey = false;
            try{
                JSONObject obj = new JSONObject();
                obj.put("isValidKey", isValidKey);
                mCallbackContext.error(obj);
            }catch(JSONException jex) {
                Log.d("isValidKey", jex.toString());
            }
        }
    }

    // delete key
    public void deactivate() {
        if (isValidKey()) {
            encryptionServices.getRemove(clientID);
            String success = "Deactivate Success";
            try {
                JSONObject obj = new JSONObject();
                obj.put("success", success);
                mCallbackContext.success(obj);
            } catch (JSONException jex) {
                Log.d("error", jex.toString());
            }
            
        }else{
            String error = "Invalid Key";
            try{
                JSONObject obj = new JSONObject();
                obj.put("error", error);
                mCallbackContext.error(obj);
            }catch(JSONException jex) {
                Log.d("error", jex.toString());
            }
        }
        // mCallbackContext.error("None Key");
    }

    // create key
    public void activate() {
        if (isValidKey() == false) {
            // if(!mFingerPrintManager.isHardwareDetected() || !mFingerPrintManager.hasEnrolledFingerprints()){
                encryptionServices.createKeyNoneBio(clientID);
            // }else{
            //     encryptionServices.createAndroidSignKey(clientID);
            // }
            
            String pk = encryptionServices.getPublicKey(clientID);
            try {
                JSONObject obj = new JSONObject();
                obj.put("publicKey", pk);
                mCallbackContext.success(obj);
               
            } catch (JSONException jex) {
                Log.d("error", jex.toString());
            }
        } else {
            String error = "KEY AVAILABLE";
            try{
                JSONObject obj = new JSONObject();
                obj.put("error", error);
                mCallbackContext.success(obj);
            }catch(JSONException jex) {
                Log.d("error", jex.toString());
            }
           
        }
    }

    // sign
    public void signData() {
        if (isValidKey()) {
            Signature initSign = encryptionServices.getSignData(clientID);
            String sign = encryptionServices.sign(challenge, initSign);
            try {
                JSONObject obj = new JSONObject();
                obj.put("signature", sign);
                mCallbackContext.success(obj);
                // mCallbackContext.success(obj.toString());
            } catch (JSONException jex) {
                Log.d("error", jex.toString());
            }
        } else {
            String error = "Invalid Key";
            try{
                JSONObject obj = new JSONObject();
                obj.put("error", error);
                mCallbackContext.error(obj);
            }catch(JSONException jex) {
                Log.d("error", jex.toString());
            }
            
        }
    }

    public void onAuthenticated(Signature signature) {
        String sign = encryptionServices.sign(challenge, signature);
        try {
            JSONObject obj = new JSONObject();
            obj.put("signature", sign);
            mCallbackContext.success(obj);
           
        } catch (JSONException jex) {
            Log.d("error", jex.toString());
            mCallbackContext.error(jex.toString());
        }
    
    }

    public void onError() {
        boolean isLocked = true;
        try {
            JSONObject obj = new JSONObject();
            obj.put("isLocked", isLocked);
            mCallbackContext.error(obj);
        } catch (JSONException jex) {
            mCallbackContext.error(jex.toString());
        }

    }

    // Check Sensor,Enrollment
    private boolean isFingerprintAuthAvailable() throws SecurityException {
        boolean isAvailable = true;
     
        if( mFingerPrintManager == null||!mFingerPrintManager.isHardwareDetected()&&!keyguardManager.isKeyguardSecure()){
            Boolean isDeviceSupported = false;
            Log.d("no","no");
            try{
                JSONObject obj = new JSONObject();
                obj.put("isDeviceSupported", isDeviceSupported);
                mCallbackContext.error(obj);
            }catch(JSONException jex) {
                Log.d("error", jex.toString());
            }
            isAvailable = false;
            return isAvailable;
        }
        if(!mFingerPrintManager.hasEnrolledFingerprints()){
            Boolean isEnrolled = false;
            try{
                JSONObject obj = new JSONObject();
                obj.put("isEnrolled", isEnrolled);
                mCallbackContext.error(obj);
            }catch(JSONException jex) {
                Log.d("error", jex.toString());
            }
            isAvailable = false;
           
            return isAvailable;
        }
    
        try{
            JSONObject obj = new JSONObject();
                obj.put("isAvailable", isAvailable);
                mCallbackContext.success(obj);
            }catch(JSONException jex) {
                Log.d("error", jex.toString());
            }

        
        return isAvailable;
       
    }


    public  String getBiometricStateChangedPreference(String state) {
       
        return  mSharedPreferences.getString(state,getFingerprintInfo(baseContext));
    }
    public  void setBiometricStateChangedPreference(String state,String value) {
           
            SharedPreferences.Editor editor = mSharedPreferences.edit();
            editor.putString(state,value);
            editor.apply();
    }
    public  boolean deleteBiometricStateChangedPreference(String state) {
        
        SharedPreferences.Editor editor = mSharedPreferences.edit();
        return editor.remove(state).commit();
    }

    public void setValueBiometricStateChangedPreference(){     
        if(mFingerPrintManager.hasEnrolledFingerprints()){
            deleteBiometricStateChangedPreference("old");
            Log.d("deleteState : ",Boolean.toString(deleteBiometricStateChangedPreference("old")));
            setBiometricStateChangedPreference("old",getFingerprintInfo(baseContext));
            Log.d("newState",String.valueOf(getBiometricStateChangedPreference("old")));
            mCallbackContext.success();
        }else{
            mCallbackContext.error("error");
        }
              
    }
    public void isBiometricStateChanged() {
       
        if(mFingerPrintManager.hasEnrolledFingerprints()){
        String oldState = getBiometricStateChangedPreference("old");  
        Log.d("old",String.valueOf(oldState));
        String newState = getFingerprintInfo(baseContext);
        Log.d("new",String.valueOf(newState));
        if(!oldState.equals(newState)){
           Log.d("not equals","true");
            mCallbackContext.success();
        }else {
            Log.d("not equals","false");
            mCallbackContext.error("error");
        }
    }
      
    }
    private String getFingerprintInfo(Context context){
    try {
        FingerprintManager fingerprintManager = (FingerprintManager) context.getSystemService(Context.FINGERPRINT_SERVICE);
        Method method = FingerprintManager.class.getDeclaredMethod("getEnrolledFingerprints");
        Object obj = method.invoke(fingerprintManager);

        if (obj != null) {
            Class<?> clazz = Class.forName("android.hardware.fingerprint.Fingerprint");
            Method getFingerId = clazz.getDeclaredMethod("getFingerId");
            String finger ="";
            for (int i = 0; i < ((List) obj).size(); i++)
            { 
                Object item = ((List) obj).get(i);
                if(item != null)
                {
                finger += getFingerId.invoke(item).toString();
                }
            }
          
            String signFinger = getMd5(finger);
            return signFinger;
        }
    } catch (NoSuchMethodException e) {
        e.printStackTrace();
    } catch (IllegalAccessException e) {
        e.printStackTrace();
    } catch (InvocationTargetException e) {
        e.printStackTrace();
    } catch ( ClassNotFoundException e){
        e.printStackTrace();
    }
    return "";
}
public static String getMd5(String input) 
{ 
    try { 

        // Static getInstance method is called with hashing MD5 
        MessageDigest md = MessageDigest.getInstance("MD5"); 

        // digest() method is called to calculate message digest 
        //  of an input digest() return array of byte 
        byte[] messageDigest = md.digest(input.getBytes()); 

        // Convert byte array into signum representation 
        BigInteger no = new BigInteger(1, messageDigest); 

        // Convert message digest into hex value 
        String hashtext = no.toString(16); 
        while (hashtext.length() < 32) { 
            hashtext = "0" + hashtext; 
        } 
        return hashtext; 
    }  

    // For specifying wrong message digest algorithms 
    catch (NoSuchAlgorithmException e) { 
        throw new RuntimeException(e); 
    } 
} 

}
