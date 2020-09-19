package com.kkebanking.facerecog.plugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.app.Activity;
import android.util.Log;
import android.util.Base64;

import com.kiatnakinbank.facelivenessdetection.MainActivity;

/**
 * This class echoes a string called from JavaScript.
 */
public class RibFaceRecog extends CordovaPlugin {
    private CallbackContext callbackContext;
    private final int REQUEST_CODE = 7777777;
    private String LOG_TAG = "FACE_RECOG";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        this.callbackContext = callbackContext;
        if (action.equals("openCamera")) {
            this.openCamera(args.getString(0));
			PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
			r.setKeepCallback(true);
			callbackContext.sendPluginResult(r);
            return true;
        } 
        return false;
    }

    private void openCamera(final String lang) {
        Log.d(LOG_TAG, "openCamera");
        final CordovaPlugin that = this;

        try {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    Log.d(LOG_TAG, "getThreadPool -> run -> openCamera:BEFORE");
					
                    Intent intentScan = new Intent(that.cordova.getActivity().getBaseContext(), MainActivity.class);
					intentScan.putExtra("lang", lang);
                    intentScan.setAction("com.kiatnakinbank.facelivenessdetection");
     
                    // avoid calling other phonegap apps
                    intentScan.setPackage(that.cordova.getActivity().getApplicationContext().getPackageName());
     
                    that.cordova.startActivityForResult(that, intentScan, REQUEST_CODE);
                    // that.cordova.getActivity().startActivity(intentScan);
                    Log.d(LOG_TAG, "getThreadPool -> run -> openCamera:AFTER");
                }
            });
        } catch (Exception e) {
            Log.d(LOG_TAG, e.toString());
			this.callbackContext.error(e.toString());
        }

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		Log.d(LOG_TAG, "onActivityResult");
        if (requestCode == REQUEST_CODE && this.callbackContext != null) {
            if (resultCode == Activity.RESULT_OK) {
                JSONObject obj = new JSONObject();
                try {
					byte[] byteArray = intent.getByteArrayExtra("face_image");
					String base64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
					
                    obj.put("message", base64);
                } catch (JSONException e) {
                    Log.d(LOG_TAG, "This should never happen");
                }
                //this.success(new PluginResult(PluginResult.Status.OK, obj), this.callback);
                this.callbackContext.success(obj);
            } else if (resultCode == Activity.RESULT_CANCELED) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put("message", "cancelled");
                } catch (JSONException e) {
                    Log.d(LOG_TAG, "This should never happen");
                }
                //this.success(new PluginResult(PluginResult.Status.OK, obj), this.callback);
                this.callbackContext.success(obj);
            } else {
                //this.error(new PluginResult(PluginResult.Status.ERROR), this.callback);
                this.callbackContext.error("Unexpected error");
            }
        }
    }
}
