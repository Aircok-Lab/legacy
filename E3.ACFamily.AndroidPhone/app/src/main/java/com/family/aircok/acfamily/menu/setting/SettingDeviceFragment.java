package com.family.aircok.acfamily.menu.setting;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseFragment;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.C2Preference;


/**
 * Created by CHO on 2016. 11. 2..
 */

public class SettingDeviceFragment extends BaseFragment {

    public SettingDeviceFragment(){}

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_setting_device, container, false);

        baseView.findViewById(R.id.btn_device_search).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                getFragmentManager().beginTransaction().replace(R.id.layout_device_container, new SettingDeviceListFragment()).commit();
            }
        });
        return baseView;
    }
}
