package com.family.aircok.acfamily.main;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.view.GravityCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.family.aircok.acfamily.BaseFragment;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.TestActivity;
import com.family.aircok.acfamily.login.LoginActivity;
import com.family.aircok.acfamily.menu.DustInfoActivity;
import com.family.aircok.acfamily.menu.monitoring.MonitoringActivity;
import com.family.aircok.acfamily.menu.ProductInfoActivity;
import com.family.aircok.acfamily.menu.setting.SettingActivity;
import com.family.aircok.acfamily.menu.TermsInfoActivity;


/**
 * Created by CHO on 2016. 10. 24..
 */
public class MenuFragment extends BaseFragment {

    private View.OnClickListener mMenuClickListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Class clazz = null;
            switch (v.getId()) {
                case R.id.product_info:
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("http://m.aircok.com/")));
                    break;
                case R.id.dust_info:
                    clazz = DustInfoActivity.class;
                    break;
                case R.id.monitoring:
                    clazz = MonitoringActivity.class;
                    break;
                case R.id.buy_info:
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("http://m.aircok.com/goods/goods_view.php?goodsNo=1000000001")));
                    break;
                case R.id.setting:
                    clazz = SettingActivity.class;
                    break;
                case R.id.terms_info:
                    clazz = TermsInfoActivity.class;
                    break;
                default:
                    closeDrawer();
                    return;
            }

            if (clazz != null) {
                Intent intent = new Intent(getContext(), clazz);
                baseActivity.startActivity(intent);
                closeDrawer();
            }
        }
    };

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        baseView = inflater.inflate(R.layout.fragment_menu, container, false);

        baseView.findViewById(R.id.product_info).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.dust_info).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.monitoring).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.buy_info).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.setting).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.terms_info).setOnClickListener(mMenuClickListener);
        baseView.findViewById(R.id.btn_menu_close).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                closeDrawer();
            }
        });
        return baseView;
    }

    private void closeDrawer() {
        if (baseActivity instanceof MainActivity) {
            MainActivity activity = (MainActivity) baseActivity;
            activity.getDrawerLayout().closeDrawer(GravityCompat.START);
        }
    }

}
