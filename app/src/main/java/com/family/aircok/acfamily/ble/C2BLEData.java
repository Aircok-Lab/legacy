package com.family.aircok.acfamily.ble;

import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;

import com.family.aircok.acfamily.common.LogUtil;

import java.util.UUID;

/**
 * Created by ssong on 2017. 5. 16..
 */

public class C2BLEData {
    private static final UUID C2_UUID = java.util.UUID.fromString("0000fff0-0000-1000-8000-00805f9b34fb");
    private BluetoothGattCharacteristic notify;
    private BluetoothGattCharacteristic write;

    public C2BLEData(BluetoothGattService service) {
        for (BluetoothGattCharacteristic characteristic : service.getCharacteristics()) {
            final int charaProp = characteristic.getProperties();

            if (charaProp == BluetoothGattCharacteristic.PROPERTY_NOTIFY) {
                notify = characteristic;
                LogUtil.LOGE("PROPERTY_NOTIFY");
            }
            else if (charaProp == BluetoothGattCharacteristic.PROPERTY_WRITE) {
                write = characteristic;
                LogUtil.LOGE("PROPERTY_WRITE");
            }
        }
    }

    public BluetoothGattCharacteristic getNotify() {
        return notify;
    }

    public BluetoothGattCharacteristic getWrite() {
        return write;
    }

    public static boolean isC2Service(BluetoothGattService service) {
        if (C2_UUID.equals(service.getUuid())) {
            return true;
        }
        return false;
    }
}
