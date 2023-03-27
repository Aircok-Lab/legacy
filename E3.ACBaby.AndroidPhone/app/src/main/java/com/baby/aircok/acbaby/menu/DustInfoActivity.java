package com.baby.aircok.acbaby.menu;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.baby.aircok.acbaby.BaseActivity;
import com.baby.aircok.acbaby.R;


/**
 * Created by CHO on 2016. 10. 24..
 */

public class DustInfoActivity extends BaseActivity implements View.OnClickListener{

    private TextView mTitle_a, mTitle_b, mTitle_c, mTitle_d, mTitle_e,
            mInside_a, mOutside_a, mInside_b,mOutside_b, mInside_c, mOutside_c, mInside_d, mOutside_d, mInside_e, mOutside_e;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dust_info);
        setHeader(R.drawable.btn_nav_back_selector, -1, R.string.menu_title1_1, -1);

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
                mInside_a.setBackgroundResource(R.drawable.btn_depth_line);
                mOutside_a.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_a.setBackgroundResource(0);
                findViewById(R.id.a_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.a_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.a_outside_tab:
                mInside_a.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mInside_a.setBackgroundResource(0);
                mOutside_a.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_a.setBackgroundResource(R.drawable.btn_depth_line);
                findViewById(R.id.a_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.a_outside_action_tips).setVisibility(View.VISIBLE);
                break;

            case R.id.b_inside_tab:
                mInside_b.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mInside_b.setBackgroundResource(R.drawable.btn_depth_line);
                mOutside_b.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_b.setBackgroundResource(0);
                findViewById(R.id.b_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.b_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.b_outside_tab:
                mInside_b.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mInside_b.setBackgroundResource(0);
                mOutside_b.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_b.setBackgroundResource(R.drawable.btn_depth_line);
                findViewById(R.id.b_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.b_outside_action_tips).setVisibility(View.VISIBLE);
                break;

            case R.id.c_inside_tab:
                mInside_c.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mInside_c.setBackgroundResource(R.drawable.btn_depth_line);
                mOutside_c.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_c.setBackgroundResource(0);
                findViewById(R.id.c_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.c_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.c_outside_tab:
                mInside_c.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mInside_c.setBackgroundResource(0);
                mOutside_c.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_c.setBackgroundResource(R.drawable.btn_depth_line);
                findViewById(R.id.c_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.c_outside_action_tips).setVisibility(View.VISIBLE);
                break;

            case R.id.d_inside_tab:
                mInside_d.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mInside_d.setBackgroundResource(R.drawable.btn_depth_line);
                mOutside_d.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_d.setBackgroundResource(0);
                findViewById(R.id.d_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.d_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.d_outside_tab:
                mInside_d.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mInside_d.setBackgroundResource(0);
                mOutside_d.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_d.setBackgroundResource(R.drawable.btn_depth_line);
                findViewById(R.id.d_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.d_outside_action_tips).setVisibility(View.VISIBLE);
                break;

            case R.id.e_inside_tab:
                mInside_e.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mInside_e.setBackgroundResource(R.drawable.btn_depth_line);
                mOutside_e.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mOutside_e.setBackgroundResource(0);
                findViewById(R.id.e_inside_action_tips).setVisibility(View.VISIBLE);
                findViewById(R.id.e_outside_action_tips).setVisibility(View.GONE);
                break;

            case R.id.e_outside_tab:
                mInside_e.setTextColor(getResources().getColor(R.color.inside_outside_default));
                mInside_e.setBackgroundResource(0);
                mOutside_e.setTextColor(getResources().getColor(R.color.inside_outside_select));
                mOutside_e.setBackgroundResource(R.drawable.btn_depth_line);
                findViewById(R.id.e_inside_action_tips).setVisibility(View.GONE);
                findViewById(R.id.e_outside_action_tips).setVisibility(View.VISIBLE);
                break;
        }
    }
}
