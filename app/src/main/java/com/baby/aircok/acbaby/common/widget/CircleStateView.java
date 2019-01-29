package com.baby.aircok.acbaby.common.widget;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;

/**
 * Created by CHO on 2016. 10. 24..
 */

public class CircleStateView extends View {

    private static final int STROKE_COLOR = Color.GRAY;
    private static final int FILL_COLOR = Color.RED;

    private Paint mOutLinePaint;
    private Paint mProgressPaint;
    private Paint mFillPaint;
    private int mStrokeWidth = 2;
    private int mProgress = 0;

    public CircleStateView(Context context) {
        super(context);
        init();
    }
    public CircleStateView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }
    public CircleStateView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public CircleStateView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {
        mOutLinePaint = new Paint();
        mOutLinePaint.setAntiAlias(true);
        mOutLinePaint.setStyle(Paint.Style.STROKE);
        mOutLinePaint.setColor(STROKE_COLOR);

        mFillPaint = new Paint();
        mFillPaint.setAntiAlias(true);
        mFillPaint.setStyle(Paint.Style.FILL);
        mFillPaint.setColor(Color.WHITE);

        mProgressPaint = new Paint();
        mProgressPaint.setAntiAlias(true);
        mProgressPaint.setStyle(Paint.Style.FILL);
        mProgressPaint.setColor(FILL_COLOR);
    }

    public void setOutLine(int width, int color) {
        mOutLinePaint.setStrokeWidth(width);
        mStrokeWidth = width;
        mOutLinePaint.setColor(color);
    }

    public void setFillColor(int color) {
        mFillPaint.setColor(color);
    }

    public void setProgressColor(int color) {
        mProgressPaint.setColor(color);
    }

    public void setProgress(int progress) {
        if (progress >= 0 && progress <= 100) {
            mProgress = progress;
        }
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        float width = getWidth();
        float height = getHeight();
        if (width == 0 || height == 0) {
            return;
        }

        float radius = (height / 2f) - mStrokeWidth;
        canvas.drawCircle(width / 2f, height / 2f , radius, mOutLinePaint);
        RectF rect = new RectF(mStrokeWidth, mStrokeWidth, width - mStrokeWidth, height- mStrokeWidth);
        float yHeight = mProgress / (float) 100f * rect.height();
        float angle = (float) (Math.acos((radius - yHeight) / radius) * 180 / Math.PI);
        float startAngle = 90f + angle;
        float sweepAngle = 360f- angle * 2f;
        canvas.drawArc(rect, startAngle, sweepAngle, false, mFillPaint);

        canvas.save();
        canvas.rotate(180f, width / 2f, height / 2f);
        canvas.drawArc(rect, 270f - angle, angle * 2f, false, mProgressPaint);
        canvas.restore();
    }
}
