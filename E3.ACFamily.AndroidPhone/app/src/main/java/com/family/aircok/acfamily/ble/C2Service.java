package com.family.aircok.acfamily.ble;

import android.app.Service;
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
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.family.aircok.acfamily.common.LogUtil;

import java.util.List;
import java.util.UUID;

/**
 * Created by ssong on 2017. 5. 16..
 */

public class C2Service  extends Service {

    private static final UUID C2_UUID = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb");
    private static final int STATE_DISCONNECTED = 0;
    private static final int STATE_CONNECTING = 1;
    private static final int STATE_CONNECTED = 2;

    public final static String ACTION_GATT_CONNECTED = "c2_action.ACTION_GATT_CONNECTED";
    public final static String ACTION_GATT_DISCONNECTED = "c2_action.ACTION_GATT_DISCONNECTED";
    public final static String ACTION_GATT_SERVICES_DISCOVERED = "c2_action.ACTION_GATT_SERVICES_DISCOVERED";
    public final static String ACTION_DATA_AVAILABLE = "c2_action.ACTION_DATA_AVAILABLE";
    public final static String EXTRA_DATA = "c2_action.EXTRA_DATA";

    private final C2ServiceBinder mBinder = new C2ServiceBinder();
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothGatt mBluetoothGatt;
    private int mConnectionState = STATE_DISCONNECTED;

    public class C2ServiceBinder extends Binder {
        public C2Service getService() {
            return C2Service.this;
        }
    }

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
                intentAction = ACTION_GATT_DISCONNECTED;
                mConnectionState = STATE_DISCONNECTED;
                broadcastUpdate(intentAction);
                close();
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

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        LogUtil.LOGE("onBind");
        return mBinder;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        final BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
        LogUtil.LOGE("onCreate");
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        close();
        LogUtil.LOGE("onDestroy");
    }

    private void broadcastUpdate(final String action) {
        LogUtil.LOGE("broadcastUpdate action : " + action);
        final Intent intent = new Intent(action);
        sendBroadcast(intent);
    }

    private void broadcastUpdate(final String action, final BluetoothGattCharacteristic characteristic) {
        LogUtil.LOGE("broadcastUpdate");
        LogUtil.LOGE("characteristic.getUuid(): " + characteristic.getUuid());
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
                intent.putExtra(EXTRA_DATA, new String(temp));
            }
        }
        sendBroadcast(intent);
    }

    public List<BluetoothGattService> getSupportedGattServices() {
        if (mBluetoothGatt == null) {
            return null;
        }
        return mBluetoothGatt.getServices();
    }

    public void connectGatt(BluetoothDevice device) {
        if (device != null) {
            mBluetoothGatt = device.connectGatt(this, false, mGattCallback);
        }
    }

    public void setNotification(C2BLEData data) {
        if (mBluetoothGatt == null) {
            return;
        }

        BluetoothGattCharacteristic notify = data.getNotify();
        if (notify != null) {
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