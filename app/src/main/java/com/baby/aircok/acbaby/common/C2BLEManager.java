package com.baby.aircok.acbaby.common;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.Intent;

/**
 * Created by CHO on 2016. 10. 27..
 */

public class C2BLEManager {

//    public static final String C2_DEVICE_NAME = "MN581N_34233";
    public static final String C2_DEVICE_NAME = "MN581N";
    public static final int REQUEST_CODE_BLUETOOTH_ENABLE = 4849;


    private Context mContext;
    private BluetoothAdapter mBluetoothAdapter;
    private OnBluetoothEnableListener mEnableListener;
    private boolean mScanning = false;

    public interface OnBluetoothEnableListener {
        public void onBluetoothEnableResult(boolean enable);
    }

    public C2BLEManager(Context context) {
        mContext = context;
        final BluetoothManager bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE_BLUETOOTH_ENABLE) {
            if (resultCode == Activity.RESULT_OK) {
                if (mEnableListener != null) {
                    mEnableListener.onBluetoothEnableResult(true);
                }
            }
            else {
                if (mEnableListener != null) {
                    mEnableListener.onBluetoothEnableResult(false);
                }
            }
        }
    }

    public void bluetoothEnable(OnBluetoothEnableListener listener) {
        mEnableListener = listener;
        if (isBleutoothOn()) {
            if (mEnableListener != null) {
                mEnableListener.onBluetoothEnableResult(true);
            }
        }
        else {
            Intent i = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            ((Activity)mContext).startActivityForResult(i, REQUEST_CODE_BLUETOOTH_ENABLE);
        }
    }

    public void scanLeDevice(final boolean enable, final BluetoothAdapter.LeScanCallback callback) {
        if (enable) {
            mScanning = true;
            mBluetoothAdapter.startLeScan(callback);
        } else {
            mScanning = false;
            mBluetoothAdapter.stopLeScan(callback);
        }
    }

    public boolean isBleutoothOn() {
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
            return false;
        }
        return true;
    }

    public boolean isScanning() {
        return mScanning;
    }
}
