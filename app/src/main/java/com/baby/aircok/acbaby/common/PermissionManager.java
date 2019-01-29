package com.baby.aircok.acbaby.common;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;


/**
 * Created by CHO on 2016. 10. 13..
 */

public class PermissionManager {

    public static final int REQUEST_CODE_ACCESS_FINE_LOCATION = 4848;
    public static String[] PERMISSIONS_LOCATION = {Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION};

    private Context context;
    private OnPermissionListener listener;


    public interface OnPermissionListener {
        public void onPermissionResult(int requestCode, boolean isPermission);
    }

    public PermissionManager(Context context) {
        this.context = context;
    }

    public void performPermission(OnPermissionListener listener, String[] permissions, int requestCode) {
        this.listener = listener;
        boolean isPermission = checkPermission(permissions);
        if (!isPermission) {
            ActivityCompat.requestPermissions((Activity) context, permissions, requestCode);
            //권한 없음
        }
        else {
            //권한 있음
            if (this.listener != null) {
                this.listener.onPermissionResult(requestCode, true);
            }
        }
    }

    public boolean checkPermission(String[] permissions) {
        boolean isPermission = true;
        for (String item : permissions) {
            if (ActivityCompat.checkSelfPermission(context, item) != PackageManager.PERMISSION_GRANTED) {
                isPermission = false;
                break;
            }
        }
        return isPermission;
    }

    public boolean isLocationPermision() {
        return checkPermission(PERMISSIONS_LOCATION);
    }

    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        LogUtil.LOGE("onRequestPermissionsResult");
        boolean isPermission = true;
        for (int granted : grantResults) {
            if (granted != PackageManager.PERMISSION_GRANTED) {
                isPermission = false;
                break;
            }
        }

        if (this.listener != null) {
            this.listener.onPermissionResult(requestCode, isPermission);
        }
    }
}
