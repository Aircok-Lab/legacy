package com.family.aircok.acfamily.common;

import android.app.Activity;
import android.widget.Toast;

import com.family.aircok.acfamily.R;


/**
 * Created by CHO on 2016. 11. 1..
 */

public class BackPressCloseHandler {
    private long backKeyPressedTime = 0;
    private Toast toast;

    private Activity activity;

    public BackPressCloseHandler(Activity context) {
        this.activity = context;
    }

    public void onBackPressed() {
        if (System.currentTimeMillis() > backKeyPressedTime + 2000) {
            backKeyPressedTime = System.currentTimeMillis();
            showGuide();
            return;
        }
        if (System.currentTimeMillis() <= backKeyPressedTime + 2000) {
            activity.finish();
            toast.cancel();
        }
    }

    public void showGuide() {
        toast = Toast.makeText(activity, activity.getString(R.string.common_app_close), Toast.LENGTH_SHORT);
        toast.show();
    }
}
