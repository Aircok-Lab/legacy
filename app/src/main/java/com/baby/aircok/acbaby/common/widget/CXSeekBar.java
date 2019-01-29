package com.baby.aircok.acbaby.common.widget;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Build;
import android.util.AttributeSet;
import android.widget.ImageView;

import com.baby.aircok.acbaby.R;


/**
 * Created by CHO on 2016. 11. 3..
 */

public class CXSeekBar extends ImageView {

    private static final int DEFAULT_POINT_RESID = R.drawable.ic_gauge_imom;
    private Bitmap mPointBitmap;
    private Paint mPaint;
    private float mProgress = 0;
    private float mDegree = 0;

    public CXSeekBar(Context context) {
        super(context);
        init();
    }

    public CXSeekBar(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public CXSeekBar(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public CXSeekBar(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {
        mPaint = new Paint();
        mPaint.setAntiAlias(true);
        mPaint.setStyle(Paint.Style.STROKE);
        setPointResId(DEFAULT_POINT_RESID);
    }

    public void setPointResId(int resId) {
        mPointBitmap = BitmapFactory.decodeResource(getResources(), resId);
        invalidate();
    }

    public void setProgress(float progress) {
        if (progress >= 0 && progress <= 100) {
            mProgress = progress;
            mDegree = 180 * (progress / 100);
            invalidate();
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        if (getWidth() <= 0 || getHeight() <= 0) {
            return;
        }
        float width = getWidth();
        float height = getHeight();
        int centerX = (int) (width / 2);
        int centerY = getPaddingTop();
        int radius = (int) ((width - getPaddingLeft() - getPaddingRight()) / 2);
        double angleInRadian = Math.toRadians(180 - mDegree);
        int x = (int) (centerX + Math.cos(angleInRadian) * radius);
        int y = (int) (centerY + Math.sin(angleInRadian) * radius);
        canvas.drawBitmap(mPointBitmap, x - (mPointBitmap.getWidth() / 2), y - (mPointBitmap.getHeight() / 2), mPaint);
    }
}
