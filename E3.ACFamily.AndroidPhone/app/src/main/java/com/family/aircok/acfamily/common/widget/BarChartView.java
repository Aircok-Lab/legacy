package com.family.aircok.acfamily.common.widget;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.View;

/**
 * Created by CHJ on 2017. 8. 12..
 */

public class BarChartView extends View {


    private static int DEFAULT_HLINE_HEIGHT = 1;
    private static int DEFAULT_LINE_COLOR = 0xffeeeeee;
    private static int DEFAULT_TEXT_SIZE = 10;
    private static int DEFAULT_TEXT_COLOR = 0xff969696;
    private static int DEFAULT_TEXT_RIGHT_MAR = 12;
    private static int DEFAULT_TEXT_BOTTOM_MAR = 12;
    private static int DEFAULT_BAR_WIDHT = 4;

    private int mVisibleItemCount = 12;
    private int mHLineCount = 4;
    private int mVLineCount = 0;

    private int mMinValue;
    private int mMaxValue;
    private String[] mLabels = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"};
    private int[] mValues = {0, 0, 0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    private int[] mValueColors = {Color.BLUE, Color.BLUE, Color.BLUE, Color.YELLOW, Color.YELLOW, Color.YELLOW, Color.GRAY, Color.GRAY, Color.GRAY, Color.GREEN, Color.GREEN, Color.GREEN,};
    private float mBarWidth;
    private float[] mDrawPadding;
    private RectF mContentRect = new RectF();
    private Context mContext;

    //Paint
    private Paint mPaint;

    public BarChartView(Context context) {
        super(context);
        init();
    }

    public BarChartView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public BarChartView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public BarChartView(Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {
        mBarWidth = dpToPx(DEFAULT_BAR_WIDHT);
        mDrawPadding = new float[]{dpToPx(40), dpToPx(10), dpToPx(16), dpToPx(40)};

        mPaint = new Paint();
        mPaint.setAntiAlias(true);
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setColor(DEFAULT_LINE_COLOR);
        mPaint.setStrokeWidth(dpToPx(DEFAULT_HLINE_HEIGHT));
        mPaint.setTypeface(Typeface.DEFAULT);
        setValueMeasured(0, 150);
    }

    /**
     * 그래프 표시 값을 설정한다
     * @param values
     */
    public void setValues(int[] values) {
        mValues = values;
    }

    public void setVisibleCount (int count) {
        mVisibleItemCount = count;
    }

    public void setValueColors(int[] colors) {
        mValueColors = colors;
    }

    /**
     *
     * @param labels
     */
    public void setLabels(String[] labels) {
        mLabels = labels;
    }

    /**
     * 그래프가 그려질 영역의 패딩
     * @param padding
     */
    public void setDrawPadding(float[] padding) {
        mDrawPadding = padding;
    }

    /**
     * 화면에 표시할 최소, 최대 값을 설정한다
     * @param min
     * @param max
     */
    public void setValueMeasured(int min, int max) {
        mMinValue = min;
        mMaxValue = max;
    }

    /**
     * 다시 그리기
     */
    public void refresh() {
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int width = getWidth();
        int height = getHeight();


        if (width == 0) return;
        if (height == 0) return;;

        mContentRect.set(mDrawPadding[0], mDrawPadding[1], width - mDrawPadding[2], height - mDrawPadding[3]);
        drawLine(canvas);
        drawText(canvas);
        drawBar(canvas);
    }

    private void drawLine(Canvas canvas) {
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setColor(DEFAULT_LINE_COLOR);
        mPaint.setStrokeWidth(dpToPx(DEFAULT_HLINE_HEIGHT));
        mPaint.setPathEffect(new DashPathEffect(new float[]{5, 5}, 1));

        float offset = 0;
        float x;
        float y;
        float w;
        float h;
        float space = mContentRect.height() / (mHLineCount - 1);
        for (int i = 0 ; i < mHLineCount ; i++) {
            x = mContentRect.left;
            y = mContentRect.top + offset;
            w = mContentRect.width();
            Path path = new Path();
            path.moveTo(x, y);
            path.lineTo(x + w, y);
//            canvas.drawLine(x, y, x + w, y, mPaint);
            canvas.drawPath(path, mPaint);
            offset += space;
        }
        offset = 0;
        space = mContentRect.width() / (mVLineCount - 1);
        for (int i = 0 ; i < mVLineCount ; i++) {
            x = mContentRect.left + offset;
            y = mContentRect.top;
            h = mContentRect.height();
            Path path = new Path();
            path.moveTo(x, y);
            path.lineTo(x, y + h);
            canvas.drawPath(path, mPaint);
//            canvas.drawLine(x, y, x, y + h, mPaint);
            offset += space;
        }
    }

    private void drawText(Canvas canvas) {
        mPaint.setStyle(Paint.Style.FILL);
        mPaint.setTextSize(dp2px(8.7f));
        mPaint.setColor(DEFAULT_TEXT_COLOR);
        mPaint.setPathEffect(null);
        Rect rect = new Rect();
        float offset = 0;
        float x;
        float y;

        int value = mMaxValue - mMinValue;
        int gap = value / (mHLineCount - 1);
        int valueOffset = mMaxValue;
        RectF leftRect = new RectF(0, mDrawPadding[1], mDrawPadding[0], getHeight() - mDrawPadding[3]);
        float space = leftRect.height() / (mHLineCount - 1);
        for (int i = 0 ; i < mHLineCount ; i++) {
            String label = String.valueOf(valueOffset);
            mPaint.getTextBounds(label, 0, label.length(), rect);
            x = leftRect.width() - rect.width() - dpToPx(DEFAULT_TEXT_RIGHT_MAR);
            y = leftRect.top + ((rect.height() - rect.bottom) / 2) + offset;
            canvas.drawText(label, x, y, mPaint);
            offset += space;
            valueOffset -= gap;
        }
        offset = 0;
        RectF bottomRect = new RectF(mContentRect.left, mContentRect.bottom, getWidth() - mDrawPadding[2], getHeight());
        space = bottomRect.width() / (mLabels.length);
        for (String label : mLabels) {
            mPaint.getTextBounds(label, 0, label.length(), rect);
            x = bottomRect.left + ((space - rect.width()) / 2) + offset;
            y = bottomRect.top + (rect.height() - rect.bottom) + dpToPx(DEFAULT_TEXT_BOTTOM_MAR);
            canvas.drawText(label, x, y, mPaint);
            offset += space;
        }
    }

    private void drawBar(Canvas canvas) {
        mPaint.setStyle(Paint.Style.FILL);
        mPaint.setPathEffect(null);

        float offset = 0;
        float x;
        float y;
        float w;
        float h;
        float itemWidth = mContentRect.width() / mVisibleItemCount;
        int index = 0;
        for (int value : mValues) {
            if (mValueColors.length > index) {
                mPaint.setColor(mValueColors[index]);
            }
            if (value > mMaxValue) {
                value = mMaxValue;
            }
            float progress = ((float) value / (float)mMaxValue) * 100;

            x = mContentRect.left + ((itemWidth - mBarWidth) / 2) + offset;
            h = mContentRect.height() * (progress / 100);
            y = mContentRect.top + (mContentRect.height() - h);
            w = mBarWidth;
            RectF rect = new RectF(x, y, x + w, y + h);
            canvas.drawRoundRect(rect, 100, 100, mPaint);
            offset += itemWidth;
            index++;
        }
    }

    public float dpToPx(int dp) {
        Resources resources = getContext(). getResources();
        float px = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, resources.getDisplayMetrics());
        return px;
    }

    private float dp2px(float value) {
        Resources r = getContext().getResources();
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, value, r.getDisplayMetrics());
    }
}
