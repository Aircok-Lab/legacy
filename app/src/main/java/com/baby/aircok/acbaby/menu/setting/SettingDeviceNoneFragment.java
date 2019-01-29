package com.baby.aircok.acbaby.menu.setting;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.baby.aircok.acbaby.BaseFragment;
import com.baby.aircok.acbaby.R;

/**
 * Created by ssong on 2017. 8. 2..
 */

public class SettingDeviceNoneFragment  extends BaseFragment {

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_setting_deivce_none, container, false);

        baseView.findViewById(R.id.btn_none_device_search).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                getFragmentManager().beginTransaction().replace(R.id.layout_device_container, new SettingDeviceListFragment()).commit();
            }
        });

        return baseView;
    }
}
