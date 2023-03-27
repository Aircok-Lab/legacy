package com.family.aircok.acfamily.common.widget;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;

import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.Util;

import static android.R.attr.angle;

/**
 * Created by ssong on 2017. 4. 25..
 */

public class CircleChartView extends View {

    private static final int STROKE_COLOR = Color.GRAY;

    private Paint mOutLinePaint;
    private Paint mProgressPaint;
    private Paint mFillPaint;
    private Paint mTextProgress;
    private Paint mTextUnit;

    private int mStrokeWidth = 15;
    private int mPoint = 0;
    private int mPm25 = 0;

    public CircleChartView(Context context) {
        super(context);
        init();
    }

    public CircleChartView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public CircleChartView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public CircleChartView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {
        mOutLinePaint = new Paint();
        mOutLinePaint.setStrokeWidth((float) 7);
        mOutLinePaint.setAntiAlias(true);
        mOutLinePaint.setStyle(Paint.Style.STROKE);
        mOutLinePaint.setColor(getResources().getColor(R.color.circle_chart_stroke));

        mFillPaint = new Paint();
        mFillPaint.setAntiAlias(true);
        mFillPaint.setStyle(Paint.Style.FILL);
        mFillPaint.setColor(Color.WHITE);

        mProgressPaint = new Paint();
        mProgressPaint.setStrokeWidth((float) 7);
        mProgressPaint.setAntiAlias(true);
        mProgressPaint.setStyle(Paint.Style.STROKE);
        mProgressPaint.setColor(STROKE_COLOR);

        mTextProgress = new Paint();
        mTextProgress.setColor(Color.BLACK);
        mTextProgress.setTextSize(Util.getDpToPx(getContext(), 16));
        mTextProgress.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        mTextProgress.setAntiAlias(true);
        mTextProgress.setTextAlign(Paint.Align.CENTER);

        mTextUnit = new Paint();
        mTextUnit.setColor(getResources().getColor(R.color.circle_chart_stroke));
        mTextUnit.setTextSize(Util.getDpToPx(getContext(), 8));
        mTextUnit.setAntiAlias(true);
        mTextUnit.setTextAlign(Paint.Align.CENTER);
    }

    public void setProgress(int point, int pm25, int color) {
        if (point >= 0 && pm25 >= 0) {
            mPoint = point;
            mProgressPaint.setColor(color);
            mPm25 = pm25;
        } else {
            mPoint = 0;
            mProgressPaint.setColor(color);
            mPm25 = 0;
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        float width = getWidth();
        float height = getHeight();
        float startAngle = 270f;//최초 시작지점

        LogUtil.LOGE("width: " + width);
        LogUtil.LOGE("height: " + height);
        LogUtil.LOGE("mPoint: " + mPoint);
        if (width == 0 || height == 0) {
            return;
        }

        float radius = (height / 2f) - mStrokeWidth;
        canvas.drawCircle(width / 2f, height / 2f , radius, mOutLinePaint);
        RectF rect = new RectF(mStrokeWidth, mStrokeWidth, width - mStrokeWidth, height- mStrokeWidth);

        float yHeight = 0;
        yHeight = mPm25 / (float) 100f * rect.height();

//        float angle = (float) (Math.acos((radius - yHeight) / radius) * 360 / Math.PI);
        float angle = mPm25 * 3.6f;

        canvas.drawArc(rect, startAngle, angle, false, mProgressPaint);

        canvas.drawText(String.valueOf(mPm25), width/2f , height/1.9f, mTextProgress);
        canvas.drawText("㎍/㎥", width/2f , height/1.45f, mTextUnit);

        canvas.save();
        canvas.rotate(180f, width / 2f, height / 2f);
        canvas.restore();
    }
}
