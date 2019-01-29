package com.family.aircok.acfamily.menu;

import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.ScrollView;
import android.widget.TextView;

import com.family.aircok.acfamily.BaseActivity;
import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.PermissionManager;
import com.family.aircok.acfamily.common.Util;
import com.family.aircok.acfamily.intro.IntroActivity;
import com.family.aircok.acfamily.main.MainActivity;

import static com.family.aircok.acfamily.R.id.tab_action_tips_a;
import static com.family.aircok.acfamily.common.PermissionManager.REQUEST_CODE_ACCESS_FINE_LOCATION;
import static com.family.aircok.acfamily.common.PermissionManager.REQUEST_CODE_WRITE_EXTERNAL_STORAGE;

/**
 * Created by ssong on 2017. 4. 24..
 */

public class DustInfoActivity extends BaseActivity implements View.OnClickListener {

    private TextView mTitle_a, mTitle_b, mTitle_c, mTitle_d, mTitle_e,
                    mInside_a, mOutside_a, mInside_b,mOutside_b, mInside_c, mOutside_c, mInside_d, mOutside_d, mInside_e, mOutside_e;

    private PermissionManager.OnPermissionListener mPermissionListener = new PermissionManager.OnPermissionListener() {
        @Override
        public void onPermissionResult(int requestCode, boolean isPermission) {
            if (requestCode == REQUEST_CODE_WRITE_EXTERNAL_STORAGE) {
                if (isPermission) {
                    LogUtil.LOGE("저장 퍼미션 허용");
                    View rootView = getWindow().getDecorView().findViewById(R.id.layout_drawer);
                    Bitmap screenShot = Util.takeScreenshot(rootView);
                    if (getPermissionManager().isStoragePermision()){
                        Util.saveBitmap(screenShot);
                        Util.shareIt(DustInfoActivity.this);
                    }

                } else {
                    //TODO : PERMISSION OFF메세지
                    showAlert(getString(R.string.alert_permission_storage_title), getString(R.string.alert_permission_storage_message), -1, getString(R.string.common_ok),
                            getString(R.string.common_cancel), new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    if (which == 0) {
                                        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                                        startActivity(intent);
                                    }
                                }
                            });
                }
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dustinfo);

//        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.menu_title1, -1, -1);
        setNewHeader(R.drawable.btn_nav_back_n, -1, R.string.menu_title1, true, -1);

        mTitle_a = (TextView) findViewById(R.id.action_tips_title_a);
        mTitle_b = (TextView) findViewById(R.id.action_tips_title_b);
        mTitle_c = (TextView) findViewById(R.id.action_tips_title_c);
        mTitle_d = (TextView) findViewById(R.id.action_tips_title_d);
        mTitle_e = (TextView) findViewById(R.id.action_tips_title_e);

        mInside_a = (TextView) findViewById(R.id.a_inside_tab_text);
        mOutside_a = (TextView) findViewById(R.id.a_outside_tab_text);
        mInside_b = (TextView) findViewById(R.id.b_inside_tab_text);
        mOutside_b = (TextView) findViewById(R.id.b_outside_tab_text);
        mInside_c = (TextView) findViewById(R.id.c_inside_tab_text);
        mOutside_c = (TextView) findViewById(R.id.c_outside_tab_text);
        mInside_d = (TextView) findViewById(R.id.d_inside_tab_text);
        mOutside_d = (TextView) findViewById(R.id.d_outside_tab_text);
        mInside_e = (TextView) findViewById(R.id.e_inside_tab_text);
        mOutside_e = (TextView) findViewById(R.id.e_outside_tab_text);

        View header = findViewById(R.id.layout_header);
        header.findViewById(R.id.btn_nav_share).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                LogUtil.LOGE("start share screenShot");
                getPermissionManager().performPermission(mPermissionListener, PermissionManager.PERMISSIONS_STORAGE, REQUEST_CODE_WRITE_EXTERNAL_STORAGE);
            }
        });
    }

    @Override
    public void onClickLeftMenu(View view) {
        finish();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.action_tips_tab_a:
                mTitle_a.setTextColor(getResources().getColor(R.color.action_tips_title_a));
                mTitle_b.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_c.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_d.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_e.setTextColor(getResources().getColor(R.color.action_tips_title));
                findViewById(R.id.tab_action_tips_a).setVisibility(View.VISIBLE);
                findViewById(R.id.tab_action_tips_b).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_c).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_d).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_e).setVisibility(View.GONE);

                findViewById(R.id.a_action_tips_lay).setVisibility(View.VISIBLE);
                findViewById(R.id.b_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.c_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.d_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.e_action_tips_lay).setVisibility(View.GONE);
                break;

            case R.id.action_tips_tab_b:
                mTitle_a.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_b.setTextColor(getResources().getColor(R.color.action_tips_title_b));
                mTitle_c.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_d.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_e.setTextColor(getResources().getColor(R.color.action_tips_title));
                findViewById(R.id.tab_action_tips_a).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_b).setVisibility(View.VISIBLE);
                findViewById(R.id.tab_action_tips_c).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_d).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_e).setVisibility(View.GONE);

                findViewById(R.id.a_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.b_action_tips_lay).setVisibility(View.VISIBLE);
                findViewById(R.id.c_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.d_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.e_action_tips_lay).setVisibility(View.GONE);
                break;

            case R.id.action_tips_tab_c:
                mTitle_a.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_b.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_c.setTextColor(getResources().getColor(R.color.action_tips_title_c));
                mTitle_d.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_e.setTextColor(getResources().getColor(R.color.action_tips_title));
                findViewById(R.id.tab_action_tips_a).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_b).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_c).setVisibility(View.VISIBLE);
                findViewById(R.id.tab_action_tips_d).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_e).setVisibility(View.GONE);

                findViewById(R.id.a_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.b_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.c_action_tips_lay).setVisibility(View.VISIBLE);
                findViewById(R.id.d_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.e_action_tips_lay).setVisibility(View.GONE);
                break;

            case R.id.action_tips_tab_d:
                mTitle_a.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_b.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_c.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_d.setTextColor(getResources().getColor(R.color.action_tips_title_d));
                mTitle_e.setTextColor(getResources().getColor(R.color.action_tips_title));
                findViewById(R.id.tab_action_tips_a).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_b).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_c).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_d).setVisibility(View.VISIBLE);
                findViewById(R.id.tab_action_tips_e).setVisibility(View.GONE);

                findViewById(R.id.a_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.b_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.c_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.d_action_tips_lay).setVisibility(View.VISIBLE);
                findViewById(R.id.e_action_tips_lay).setVisibility(View.GONE);
                break;

            case R.id.action_tips_tab_e:
                mTitle_a.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_b.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_c.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_d.setTextColor(getResources().getColor(R.color.action_tips_title));
                mTitle_e.setTextColor(getResources().getColor(R.color.action_tips_title_e));
                findViewById(R.id.tab_action_tips_a).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_b).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_c).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_d).setVisibility(View.GONE);
                findViewById(R.id.tab_action_tips_e).setVisibility(View.VISIBLE);

                findViewById(R.id.a_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.b_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.c_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.d_action_tips_lay).setVisibility(View.GONE);
                findViewById(R.id.e_action_tips_lay).setVisibility(View.VISIBLE);
                break;

            case R.id.a_inside_tab:
                mInside_a.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_a.setTextColor(getResources().getColor(R.color.inside_outside_default));
                findViewById(R.id.a_inside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.a_outside_dot).setVisibility(View.GONE);
                findViewById(R.id.a_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.a_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.a_outside_tab:
                mInside_a.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_a.setTextColor(getResources().getColor(R.color.inside_outside_select));
                findViewById(R.id.a_inside_dot).setVisibility(View.GONE);
                findViewById(R.id.a_outside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.a_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.a_outside_action_tips).setVisibility(View.VISIBLE);
                break;

            case R.id.b_inside_tab:
                mInside_b.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_b.setTextColor(getResources().getColor(R.color.inside_outside_default));
                findViewById(R.id.b_inside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.b_outside_dot).setVisibility(View.GONE);
                findViewById(R.id.b_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.b_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.b_outside_tab:
                mInside_b.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_b.setTextColor(getResources().getColor(R.color.inside_outside_select));
                findViewById(R.id.b_inside_dot).setVisibility(View.GONE);
                findViewById(R.id.b_outside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.b_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.b_outside_action_tips).setVisibility(View.VISIBLE);
                break;

            case R.id.c_inside_tab:
                mInside_c.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_c.setTextColor(getResources().getColor(R.color.inside_outside_default));
                findViewById(R.id.c_inside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.c_outside_dot).setVisibility(View.GONE);
                findViewById(R.id.c_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.c_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.c_outside_tab:
                mInside_c.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_c.setTextColor(getResources().getColor(R.color.inside_outside_select));
                findViewById(R.id.c_inside_dot).setVisibility(View.GONE);
                findViewById(R.id.c_outside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.c_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.c_outside_action_tips).setVisibility(View.VISIBLE);
                break;

            case R.id.d_inside_tab:
                mInside_d.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_d.setTextColor(getResources().getColor(R.color.inside_outside_default));
                findViewById(R.id.d_inside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.d_outside_dot).setVisibility(View.GONE);
                findViewById(R.id.d_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.d_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.d_outside_tab:
                mInside_d.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_d.setTextColor(getResources().getColor(R.color.inside_outside_select));
                findViewById(R.id.d_inside_dot).setVisibility(View.GONE);
                findViewById(R.id.d_outside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.d_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.d_outside_action_tips).setVisibility(View.VISIBLE);
                break;

            case R.id.e_inside_tab:
                mInside_e.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_e.setTextColor(getResources().getColor(R.color.inside_outside_default));
                findViewById(R.id.e_inside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.e_outside_dot).setVisibility(View.GONE);
                findViewById(R.id.e_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.e_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.e_outside_tab:
                mInside_e.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_e.setTextColor(getResources().getColor(R.color.inside_outside_select));
                findViewById(R.id.e_inside_dot).setVisibility(View.GONE);
                findViewById(R.id.e_outside_dot).setVisibility(View.VISIBLE);
                findViewById(R.id.e_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.e_outside_action_tips).setVisibility(View.VISIBLE);
                break;
        }
    }
}
