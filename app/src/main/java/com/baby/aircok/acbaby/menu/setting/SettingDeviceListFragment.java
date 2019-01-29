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
import android.widget.ListView;
import android.widget.TextView;

import com.baby.aircok.acbaby.BaseFragment;
import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.C2BLEManager;
import com.baby.aircok.acbaby.common.C2Preference;
import com.baby.aircok.acbaby.common.Config;
import com.baby.aircok.acbaby.common.LoginInfo;
import com.baby.aircok.acbaby.common.PermissionManager;
import com.baby.aircok.acbaby.common.Util;
import com.baby.aircok.acbaby.common.widget.CXAdapter;
import com.baby.aircok.acbaby.net.client.C2HTTPProcessor;
import com.baby.aircok.acbaby.net.transaction.ACTransaction;

import com.baby.aircok.acbaby.common.LogUtil;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;

import static com.baby.aircok.acbaby.common.PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION;

/**
 * Created by CHO on 2016. 11. 7..
 *
 * @author CHO
 * @version 1.0.0
 * @since 1.0.0
 */
public class SettingDeviceListFragment extends BaseFragment {

    private Adapter_ mAdapter;
    private C2BLEManager mBLEManager;
    private Handler mHandler = new Handler();
    private HashMap<String, String> mDeviceMap = new HashMap<>();
    private boolean isConnect = false;


    private class Adapter_ extends CXAdapter {

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            if (convertView == null) {
                convertView = View.inflate(getContext(), R.layout.cell_device_list, null);
            }

            if (getItem(position) instanceof String) {
                String name = (String) getItem(position);
                TextView tv_device_name = (TextView) convertView.findViewById(R.id.tv_device_name);
                tv_device_name.setText(name);
                isConnect = true;
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

    public SettingDeviceListFragment() {}

    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_setting_device_list, container, false);
        mBLEManager = new C2BLEManager(getContext());

        ListView list_view = (ListView) baseView.findViewById(R.id.list_view);
        mAdapter = new Adapter_();
        list_view.setAdapter(mAdapter);
        list_view.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                C2Preference.setDevice(getContext(), (String)mAdapter.getItem(position));

                ACTransaction tr = new ACTransaction(SettingDeviceListFragment.this, "aircok");
                tr.setConnectionURL(Config.SERVER_URL);
                tr.setRequest("user_id", LoginInfo.getInstance().user_id);
                tr.setRequest("email", C2Preference.getLoginID(getContext()));
                tr.setRequest("aircok_id", (String)mAdapter.getItem(position));
                tr.setRequest("aircok_fid", (String)mAdapter.getItem(position));
                tr.setRequest("aircok_type", "baby");
                JSONObject location = new JSONObject();
                try {
                    JSONArray coordinate = new JSONArray();
                    coordinate.put(Util.getLatitude());
                    coordinate.put(Util.getLongitude());
                    String address = Util.getAddress(getContext(), Util.getLatitude(), Util.getLongitude());
                    location.put("address", address);
                    location.put("coordinate", coordinate);
                    location.put("country", "대한민국");

                    String[] data = address.split(" ");
                    for (int i = 0 ; i < data.length; i++){
                        LogUtil.LOGE("address split: " + data[i]);
                        if (null != data[i]) {
                            if (i == 0)
                                location.put("locality", data[0]);
                            if (i == 1)
                                location.put("sublocality_lv1", data[1]);
                            if (i == 2)
                                location.put("sublocality_lv2", data[2]);
                            if (i == 3)
                                location.put("political", data[3]);
                        }
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
                tr.setRequest("location", location);
                C2HTTPProcessor.getInstance().sendToBLServer(tr);

                baseActivity.finish();
            }
        });

        View footer = View.inflate(getContext(), R.layout.cell_device_list_refresh, null);
        footer.findViewById(R.id.tv_device_list_refresh).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!mBLEManager.isScanning()) {
                    baseActivity.getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);
                }
            }
        });
        list_view.setFooterDividersEnabled(false);
        list_view.addFooterView(footer);

        baseActivity.getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_LOCATION, REQUEST_CODE_ACCESS_FINE_LOCATION);
        return baseView;
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
                if (!isConnect)
                    baseActivity.getSupportFragmentManager().beginTransaction().replace(R.id.layout_device_container, new SettingDeviceNoneFragment()).commit();
            }
        }, 5000);


        mDeviceMap.clear();
        mAdapter.datas.removeAllElements();
        mAdapter.notifyDataSetChanged();
        mBLEManager.scanLeDevice(true, mLeScanCallback);
        isConnect = false;
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
