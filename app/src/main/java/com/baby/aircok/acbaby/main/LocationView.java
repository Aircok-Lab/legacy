package com.baby.aircok.acbaby.main;

import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.util.AttributeSet;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.baby.aircok.acbaby.R;
import com.baby.aircok.acbaby.common.C2Util;
import com.baby.aircok.acbaby.common.Util;
import com.baby.aircok.acbaby.common.widget.CircleStateView;

import com.baby.aircok.acbaby.common.LogUtil;

/**
 * Created by CHO on 2016. 10. 24..
 */

public class LocationView extends LinearLayout {

    private static final int OUTLINE_COLOR = Color.parseColor("#ffeeeeee");
    private CircleStateView mCircleStateView;

    public LocationView(Context context) {
        super(context);
        init();
    }
    public LocationView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }
    public LocationView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public LocationView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {
        View view = View.inflate(getContext(), R.layout.view_location, this);
        mCircleStateView = (CircleStateView) view.findViewById(R.id.circle_state);
        mCircleStateView.setOutLine(Util.getDpToPx(getContext(), 1), OUTLINE_COLOR);
    }

    public void reset() {
        setPM25(null, null, -1);
    }

    public void setPM25(String title, String location, int pm25) {
        if (title != null) {
            TextView tv_title = (TextView) findViewById(R.id.tv_title);
            tv_title.setText(title);
        }

        if (pm25 == -1) {
            findViewById(R.id.iv_add_location).setVisibility(View.VISIBLE);
            findViewById(R.id.layout_circle_state).setVisibility(View.GONE);
        }
        else {
            findViewById(R.id.iv_add_location).setVisibility(View.GONE);
            findViewById(R.id.layout_circle_state).setVisibility(View.VISIBLE);
            int point = C2Util.getTotalPoint(pm25);
            LogUtil.LOGE("pm25 : " + pm25);
            LogUtil.LOGE("point : " + point);
            mCircleStateView.setProgressColor(getDustColor(point));
            mCircleStateView.setFillColor(Color.WHITE);
            mCircleStateView.setProgress(point);
            mCircleStateView.invalidate();
            TextView tv_location = (TextView) findViewById(R.id.tv_location);
            tv_location.setText(location);

            TextView tv_dust = (TextView) findViewById(R.id.tv_dust);
            tv_dust.setText(String.valueOf(pm25));
        }
    }

    private int getDustColor(int point) {
        int color = Color.WHITE;
        if (point <= 20) {
            color = Color.parseColor("#4bccf2");
        }
        else if (point <= 40) {
            color = Color.parseColor("#75e2d4");
        }
        else if (point <= 60) {
            color = Color.parseColor("#ff9320");
        }
        else if (point <= 80) {
            color = Color.parseColor("#fdb0a9");
        }
        else if (point <= 100) {
            color = Color.parseColor("#fd5f45");
        }
        return color;
    }
}
