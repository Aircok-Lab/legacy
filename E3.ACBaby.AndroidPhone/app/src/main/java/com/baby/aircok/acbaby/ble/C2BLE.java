package com.baby.aircok.acbaby.ble;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;

import com.baby.aircok.acbaby.common.LogUtil;

import java.util.List;
import java.util.UUID;
import java.util.Vector;

/**
 * Created by CHO on 2016. 10. 19..
 */

public class C2BLE {
    public static final String C2_DEVICE_NAME = "MN581N_34233";
    public static final int REQUEST_CODE_BLUETOOTH_ENABLE = 4849;
    private static final UUID C2_UUID = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb");
    private static final long SCAN_PERIOD = 10000;

    private static final int STATE_DISCONNECTED = 0;
    private static final int STATE_CONNECTING = 1;
    private static final int STATE_CONNECTED = 2;

    public final static String ACTION_GATT_CONNECTED =
            "com.example.bluetooth.le.ACTION_GATT_CONNECTED";
    public final static String ACTION_GATT_DISCONNECTED =
            "com.example.bluetooth.le.ACTION_GATT_DISCONNECTED";
    public final static String ACTION_GATT_SERVICES_DISCOVERED =
            "com.example.bluetooth.le.ACTION_GATT_SERVICES_DISCOVERED";
    public final static String ACTION_DATA_AVAILABLE =
            "com.example.bluetooth.le.ACTION_DATA_AVAILABLE";
    public final static String EXTRA_DATA =
            "com.example.bluetooth.le.EXTRA_DATA";

    private Context mContext;
    private OnBluetoothEnableListener mEnableListener;
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothGatt mBluetoothGatt;
    private Vector<BluetoothDevice> mDevices;
    private BluetoothDevice mDevice;
    private boolean mScanning;
    private int mConnectionState = STATE_DISCONNECTED;


    public interface OnBluetoothEnableListener {
        public void onBluetoothEnableResult(boolean enable);
    }

    private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(final BluetoothDevice device, int rssi, byte[] scanRecord) {
            Handler handler = new Handler();
            handler.post(new Runnable() {
                @Override
                public void run() {
                    if (C2_DEVICE_NAME.equals(device.getName())) {
                        if (mDevice == null) {
                            LogUtil.LOGE("onLeScan : " + device.getName());
                            mDevice = device;
                            connectGatt(mDevice);
                        }
                    }

//                    LogUtil.LOGE("onLeScan : ");
//                    if (mDevices.size() <= 0) {
//                        mDevices.add(device);
//                    }
//                    for (int i = 0; i < mDevices.size() ; i++) {
//                        BluetoothDevice item = mDevices.get(i);
//                        LogUtil.LOGE("item addr : " + item.getAddress());
//                        LogUtil.LOGE("device addr : " + device.getAddress());
//                        if (!item.getAddress().equals(device.getAddress())) {
//                            mDevices.add(device);
//                        }
//                    }
//
//                    for (int i = 0; i < mDevices.size() ; i++) {
//                        BluetoothDevice item = mDevices.get(i);
//                        String log = String.format("onLeScan device : %s, name : %s, type : %d", item, item.getName(), item.getType());
//                        LogUtil.LOGE(log);
//                    }
                }
            });
        }
    };

    private BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            super.onConnectionStateChange(gatt, status, newState);
            LogUtil.LOGE("onConnectionStateChange");
            String intentAction;
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                LogUtil.LOGE("Connected to GATT server.");
                LogUtil.LOGE("Attempting to start service discovery:" + mBluetoothGatt.discoverServices());
                intentAction = ACTION_GATT_CONNECTED;
                mConnectionState = STATE_CONNECTED;
                broadcastUpdate(intentAction);
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                LogUtil.LOGE("Disconnected from GATT server.");
                mDevice = null;
                intentAction = ACTION_GATT_DISCONNECTED;
                mConnectionState = STATE_DISCONNECTED;
                broadcastUpdate(intentAction);
            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            LogUtil.LOGE("onServicesDiscovered");
            if (status == BluetoothGatt.GATT_SUCCESS) {
                broadcastUpdate(ACTION_GATT_SERVICES_DISCOVERED);
            } else {
                LogUtil.LOGE("onServicesDiscovered received : " + status);
            }
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
            LogUtil.LOGE("onCharacteristicChanged");
            broadcastUpdate(ACTION_DATA_AVAILABLE, characteristic);
        }

    };

    public C2BLE(Context context) {
        mContext = context;
        mDevices = new Vector<>();
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

    private boolean isBleutoothOn() {
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
            return false;
        }
        return true;
    }

    public void scanLeDevice(final boolean enable) {

        if (enable) {
            // Stops scanning after a pre-defined scan period.
            Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
//                    mScanning = false;
//                    mBluetoothAdapter.stopLeScan(mLeScanCallback);
                }
            }, SCAN_PERIOD);
            mScanning = true;
            mBluetoothAdapter.startLeScan(mLeScanCallback);
        } else {
            mScanning = false;
            mBluetoothAdapter.stopLeScan(mLeScanCallback);
        }
    }

    public Vector<BluetoothDevice> getDevices() {
        return mDevices;
    }

    public void connectGatt(BluetoothDevice device) {
        if (device != null) {
            mBluetoothGatt = device.connectGatt(mContext, false, mGattCallback);
        }
    }

    private void broadcastUpdate(final String action) {
        LogUtil.LOGE("broadcastUpdate action : " + action);
        final Intent intent = new Intent(action);
        mContext.sendBroadcast(intent);
    }

    private void broadcastUpdate(final String action, final BluetoothGattCharacteristic characteristic) {
        LogUtil.LOGE("broadcastUpdate");
        final Intent intent = new Intent(action);
        // This is special handling for the Heart Rate Measurement profile. Data
        // parsing is carried out as per profile specifications.
        if (C2_UUID.equals(characteristic.getUuid())) {
            int flag = characteristic.getProperties();
            int format = -1;
            if ((flag & 0x01) != 0) {
                format = BluetoothGattCharacteristic.FORMAT_UINT16;
                LogUtil.LOGE("Heart rate format UINT16.");
            } else {
                format = BluetoothGattCharacteristic.FORMAT_UINT8;
                LogUtil.LOGE("Heart rate format UINT8.");
            }
            final int heartRate = characteristic.getIntValue(format, 1);
            LogUtil.LOGE("Received heart rate : " + heartRate);
            intent.putExtra(EXTRA_DATA, String.valueOf(heartRate));
        } else {
            // For all other profiles, writes the data formatted in HEX.
            final byte[] data = characteristic.getValue();
            int min = Math.min(data.length, 20);
            byte[] temp = new byte[min];
            System.arraycopy(data, 0, temp, 0, temp.length);
            if (temp != null && temp.length > 0) {
                final StringBuilder stringBuilder = new StringBuilder(temp.length);
//                for(byte byteChar : temp){
//                    stringBuilder.append(String.format("%02X ", byteChar));
//                }

//                intent.putExtra(EXTRA_DATA, stringBuilder.toString());
                intent.putExtra(EXTRA_DATA, new String(temp));
            }
        }
        mContext.sendBroadcast(intent);
    }

    public List<BluetoothGattService> getSupportedGattServices() {
        if (mBluetoothGatt == null) {
            return null;
        }
        return mBluetoothGatt.getServices();
    }

    public void setNotification(C2BLEData data) {
        if (mBluetoothGatt == null) {
            return;
        }

        BluetoothGattCharacteristic notify = data.getNotify();
        if (notify != null) {
            LogUtil.LOGE("setNotification");
            mBluetoothGatt.setCharacteristicNotification(notify, true);
        }
    }

    public void write(C2BLEData data) {
        if (mBluetoothGatt == null) {
            return;
        }

        BluetoothGattCharacteristic write = data.getWrite();
        if (write != null) {
            LogUtil.LOGE("write");
            mBluetoothGatt.writeCharacteristic(write);
        }
    }

    public void close() {
        if (mBluetoothGatt == null) {
            return;
        }
        mBluetoothGatt.close();
        mBluetoothGatt = null;
    }

}
