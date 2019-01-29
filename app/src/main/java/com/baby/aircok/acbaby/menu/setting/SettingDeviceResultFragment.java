package com.baby.aircok.acbaby.menu.setting;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import com.baby.aircok.acbaby.BaseFragment;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.C2BLEManager;
import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.PermissionManager;
import com.baby.aircok.acbaby.common.Util;
import com.baby.aircok.acbaby.common.widget.CXAdapter;

import com.baby.aircok.acbaby.common.LogUtil;

import java.util.HashMap;

import static com.baby.aircok.acbaby.common.PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION;

/**
 * Created by CHO on 2016. 11. 2..
 */

public class SettingDeviceResultFragment extends BaseFragment {

    private Adapter_ mAdapter;
    private C2BLEManager mBLEManager;
    private Handler mHandler = new Handler();

    private HashMap<String, String> mDeviceMap = new HashMap<>();
    private boolean mDeviceEnable = false;
    private int mSelectPosition = -1;

    private class Adapter_ extends CXAdapter {

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            LogUtil.LOGE("getView1");
            if (convertView == null) {
                convertView = View.inflate(getContext(), R.layout.cell_device, null);
            }

            if (getItem(position) instanceof String) {
                LogUtil.LOGE("getView2");
                String name = (String) getItem(position);
                TextView tv_device_name = (TextView) convertView.findViewById(R.id.tv_device_name);
                tv_device_name.setText(name);
                tv_device_name.setSelected(mSelectPosition == position);
            }
            return convertView;
        }
    }

    private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(final BluetoothDevice device, int rssi, byte[] scanRecord) {
            LogUtil.LOGE("mLeScanCallback");
            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    String name = device.getName();
                    if (name != null) {
                        if (name.contains(C2BLEManager.C2_DEVICE_NAME)) {
                            LogUtil.LOGE("mLeScanCallback name : " + name);
                            if (!mDeviceMap.containsKey(name)) {
                                LogUtil.LOGE("mLeScanCallback___");
                                mDeviceMap.put(name, name);
                                mAdapter.datas.addElement(name);
                                mAdapter.notifyDataSetChanged();
                            }
                        }
                    }
                }
            });

        }
    };

    private PermissionManager.OnPermissionListener mPermissionListener = new PermissionManager.OnPermissionListener() {
        @Override
        public void onPermissionResult(int requestCode, boolean isPermission) {
            if (requestCode == REQUEST_CODE_ACCESS_FINE_LOCATION) {
                if (isPermission) {
                    LogUtil.LOGE("퍼미션 허용");
                    if (Util.isGps(getContext())) {
                        bluetoothEnable();
                    }
                    else {
                        showAlert(getString(R.string.alert_location_title), getString(R.string.alert_location_message), R.drawable.icon_pin, getString(R.string.common_ok),
                                getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        if (which == 0) {
                                            Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                                            startActivity(intent);
                                        }
                                    }
                                });
                    }
                } else {
                    //TODO : PERMISSION OFF메세지
                    LogUtil.LOGE("퍼미션 거절");
                    showAlert(getString(R.string.alert_permission_title), getString(R.string.alert_permission_message), -1, getString(R.string.common_ok),
                            getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    if (which == 0) {
                                        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                                                Uri.fromParts("package", getContext().getPackageName(), null));
                                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                        startActivity(intent);
                                    }
                                }
                            });
                }
            }
        }
    };

    public SettingDeviceResultFragment(){}

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_setting_device_result, container, false);
        mBLEManager = new C2BLEManager(getContext());

        ListView list_view = (ListView) baseView.findViewById(R.id.list_view);
        mAdapter = new Adapter_();
        list_view.setAdapter(mAdapter);
        list_view.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                mSelectPosition = position;
                mAdapter.notifyDataSetChanged();
            }
        });

        baseView.findViewById(R.id.btn_device_result).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mDeviceEnable) {
                    if (mSelectPosition != -1) {
                        C2Preference.setDevice(getContext(), (String)mAdapter.getItem(mSelectPosition));
                        baseActivity.finish();
                    }
                }
                else {
                    baseActivity.getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);
                }
            }
        });
        setResultVisible(false);
        baseActivity.getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);
        return baseView;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == C2BLEManager.REQUEST_CODE_BLUETOOTH_ENABLE) {
            mBLEManager.onActivityResult(requestCode, resultCode, data);
        }
        else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    private void setResultVisible(boolean isDevice) {
        mDeviceEnable = isDevice;
        baseView.findViewById(R.id.layout_not_device).setVisibility(isDevice ? View.GONE : View.VISIBLE);
        baseView.findViewById(R.id.layout_device).setVisibility(isDevice ? View.VISIBLE : View.GONE);

        Button btn_device_result = (Button) baseView.findViewById(R.id.btn_device_result);
        btn_device_result.setText(mDeviceEnable ? R.string.setting_device_con : R.string.setting_device_search);
    }

    private void startScan() {
        if (mBLEManager.isScanning()) {
            return;
        }
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                mBLEManager.scanLeDevice(false, mLeScanCallback);
                setResultVisible(mAdapter.datas.size() != 0);
            }
        }, 5000);

        setResultVisible(true);
        mSelectPosition = -1;
        mAdapter.datas.removeAllElements();
        mDeviceMap.clear();
        mBLEManager.scanLeDevice(true, mLeScanCallback);
    }

    private void bluetoothEnable() {
        if (mBLEManager.isBleutoothOn()) {
            startScan();
        }
        else {
            showAlert(getString(R.string.alert_ble_title), getString(R.string.alert_ble_message), R.drawable.icon_bluetooth, getString(R.string.common_ok),
                    getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            if (which == 0) {
                                mBLEManager.bluetoothEnable(new C2BLEManager.OnBluetoothEnableListener() {
                                    @Override
                                    public void onBluetoothEnableResult(boolean enable) {
                                        LogUtil.LOGE("onBluetoothEnableResult : " + enable);
                                        if (enable) {
                                            startScan();
                                        }
                                        else {
                                            //TODO : 블루투스 거절 메세지
                                            LogUtil.LOGE("블루투스 거절");
                                        }
                                    }
                                });
                            }
                        }
                    });
        }
    }
}
