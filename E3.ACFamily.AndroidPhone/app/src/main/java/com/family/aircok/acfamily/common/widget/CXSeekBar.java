package com.family.aircok.acfamily.common.widget;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.View;
import android.widget.ImageView;
import android.widget.SeekBar;

import com.family.aircok.acfamily.R;
import com.family.aircok.acfamily.common.LogUtil;
import com.family.aircok.acfamily.common.Util;

import static android.R.attr.radius;
import static android.os.Build.VERSION_CODES.M;


/**
 * Created by CHO on 2016. 11. 3..
 */
public class CXSeekBar extends View {

    private static final int RES_THUMB_ID = R.drawable.bg_index_num_bg;
    private static final int COLOR_LINE = 0xFFFFFFFF;
    private static final int COLOR_TEXT = 0xFF333333;
    private static final int COLOR_TEXT_UNIT = 0xFFFFFFFF;
    private static final int TEXT_SIZE = 15;
    private static final int TEXT_SIZE_UNIT = 10;

    private static float START_ANGLE = 248.6f;
    private static float SWEEP_ANGLE = (270 - START_ANGLE) * 2;

    private float mProgress = 0;
    private float mDegree = 0;
    private int mPM25 = 0;

    private Bitmap mThumb;

    private Paint mLinePaint;

    private Paint mTextPaint;
    private Paint mUnitPaint;
    private Paint mBitmapPaint;

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
        mThumb = BitmapFactory.decodeResource(getResources(), RES_THUMB_ID);

        mLinePaint = new Paint();
        mLinePaint.setAntiAlias(true);
        mLinePaint.setStyle(Paint.Style.STROKE);
        mLinePaint.setColor(COLOR_LINE);
        mLinePaint.setStrokeWidth((int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 1.5f, getResources().getDisplayMetrics()));

        mTextPaint = new Paint();
        mTextPaint.setAntiAlias(true);
        mTextPaint.setColor(COLOR_TEXT);
        mTextPaint.setTextSize(Util.getDpToPx(getContext(), TEXT_SIZE));
        mTextPaint.setTypeface(Typeface.DEFAULT_BOLD);

        mUnitPaint = new Paint();
        mUnitPaint.setAntiAlias(true);
        mUnitPaint.setColor(COLOR_TEXT_UNIT);
        mUnitPaint.setTextSize(Util.getDpToPx(getContext(), TEXT_SIZE_UNIT));
        mUnitPaint.setTypeface(Typeface.DEFAULT_BOLD);

        mBitmapPaint = new Paint();
        mBitmapPaint.setAntiAlias(true);
    }

    public void setProgress(int progress, int pm25) {
        if (progress > 100) {
            progress = 100;
        }
        mProgress = progress;
        mDegree = SWEEP_ANGLE * (mProgress / 100);
        mPM25 = pm25;
        invalidate();
    }

    //===================== Draw //=====================//
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        float width = getWidth();
        float height = getHeight();

        if (width == 0) return;
        if (height == 0) return;

        float thumbWidth = mThumb.getWidth();
        float thumbHeight = mThumb.getHeight();
        float radius = width * 1.2f;
        float diameter = radius * 2;

        //라인 그리기
        float left = (width - diameter) / 2;
        float top = thumbHeight / 2;
        float right = left + diameter;
        float bottom = top + diameter;
        RectF rect = new RectF(left, top, right, bottom);
        canvas.drawArc(rect, 0, 360, false, mLinePaint);

        //Thumb 그리기
        double angle = Math.toRadians(START_ANGLE + mDegree);
        int x = (int) (rect.width() / 2 + Math.cos(angle) * radius);
        int y = (int) (rect.height() / 2 + Math.sin(angle) * radius);
        left = left + x - (thumbWidth / 2);
        top = top + y - (thumbHeight / 2);
        right = left + thumbWidth;
        bottom = top + thumbHeight;
        RectF thumbRect = new RectF(left, top, right, bottom);
        canvas.drawBitmap(mThumb, thumbRect.left, thumbRect.top, mBitmapPaint);

        //pm25 값 그리기
        String text = String.valueOf((int) mPM25);
        Rect textRect = new Rect();
        mTextPaint.getTextBounds(text, 0, text.length(), textRect);
        float textX = (thumbRect.width() - textRect.width()) / 2;
        float textY = ((thumbRect.height() + textRect.height()) / 2) - textRect.bottom;
        canvas.drawText(text, thumbRect.left + textX, thumbRect.top + textY, mTextPaint);

        //㎍/㎥ 그리기
        text = "㎍/㎥";
        textRect = new Rect();
        mUnitPaint.getTextBounds(text, 0, text.length(), textRect);
        textX = (thumbRect.width() - textRect.width()) / 2;
        textY = textRect.height() - textRect.bottom;
        int space = Util.getDpToPx(getContext(), 4);
        canvas.drawText(text, thumbRect.left + textX, thumbRect.bottom + textY + space, mUnitPaint);
    }
    //===================== Draw //=====================//
}
