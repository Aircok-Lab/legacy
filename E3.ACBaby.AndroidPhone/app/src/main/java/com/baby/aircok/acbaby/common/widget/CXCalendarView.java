package com.baby.aircok.acbaby.common.widget;

import android.content.Context;
import android.os.Build;
import android.support.annotation.AttrRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.annotation.StyleRes;
import android.util.AttributeSet;
import android.view.View;
import android.widget.LinearLayout;

import java.util.Calendar;
import java.util.Vector;

/**
 * Created by CHJ on 2017. 6. 28..
 */

public class CXCalendarView extends LinearLayout {

    private static final int WEEK_VIEW_COUNT = 7;
    private static final int DAY_VIEW_COUNT = 42;

    private OnDayClickListener mListener;
    private CalendarAdapter mAdapter;
    private Calendar mCalendar;
    private Vector<LinearLayout> mRows = new Vector<>();
    private Vector<Calendar> mDayInfos = new Vector<>();
    private int mFirstWeek = Calendar.SUNDAY;

    public interface OnDayClickListener {
        void onDayClick(View view, int position, Calendar calendar);
    }

    public static abstract class CalendarAdapter {
        public CalendarAdapter() {}
        public abstract int getWeekViewId();
        public abstract void setWeekView(View view, int week);
        public abstract int getDayViewId();
        public abstract void setDayView(View view, int position, Calendar calendar);
    }

    public CXCalendarView(@NonNull Context context) {
        super(context);
        init();
    }
    public CXCalendarView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public CXCalendarView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public CXCalendarView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr, @StyleRes int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    private void init() {
        setOrientation(VERTICAL);

        // Week 레이아웃 추가(요일까지 포함 7개)
        for (int i = 0 ; i < WEEK_VIEW_COUNT ; i++) {
            LinearLayout week = createWeekView();

            //요일
            if (i == 0) {
                addView(week, new LayoutParams(-1, -2));
            }
            else {
                addView(week, new LayoutParams(-1, 0, 1));
            }
            mRows.add(week);
        }
    }

    public void setCalendarAdapter(CalendarAdapter adapter) {
        mAdapter = adapter;
        initLayout();
    }

    public void setCalendar(Calendar calendar) {
        mCalendar = (Calendar) calendar.clone();
        refresh();
    }

    public void refresh() {
        if (mAdapter == null) {
            return;
        }
        if (mCalendar == null) {
            return;
        }
        mDayInfos.clear();

        int year = mCalendar.get(Calendar.YEAR);
        int month = mCalendar.get(Calendar.MONTH);
        mCalendar.set(year, month, 1);
        mCalendar.setFirstDayOfWeek(mFirstWeek);

        //1일의 요일
        int dayOfWeek = mCalendar.get(Calendar.DAY_OF_WEEK);
        //마지막날
        int maxOfMonth = mCalendar.getActualMaximum(Calendar.DAY_OF_MONTH);

        mCalendar.add(Calendar.DAY_OF_MONTH, mFirstWeek - dayOfWeek);

        //이전달
        int seekDay;
        for(;;) {
            seekDay = mCalendar.get(Calendar.DAY_OF_WEEK);
            if(dayOfWeek == seekDay) {
                break;
            }
            mDayInfos.add((Calendar) mCalendar.clone());
            mCalendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        //현재
        for(int i = 0; i < maxOfMonth; i++) {
            //하루 증가
            mDayInfos.add((Calendar) mCalendar.clone());
            mCalendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        //다음달
        for(;;) {
            if(mDayInfos.size() != DAY_VIEW_COUNT) {
                mDayInfos.add((Calendar) mCalendar.clone());
            }
            else {
                break;
            }
            //하루 증가
            mCalendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        //Data설정
        LinearLayout layout = mRows.get(0);
        for (int i = 0 ; i < layout.getChildCount() ; i++) {
            View view = layout.getChildAt(i);
            mAdapter.setWeekView(view, i);
        }

        int index = 0;
        for (int i = 1 ; i < mRows.size() ; i++) {
            layout = mRows.get(i);
            for (int j = 0 ; j < layout.getChildCount() ; j++) {
                final Calendar calendar = mDayInfos.get(index);
                final View view = layout.getChildAt(j);
                final int position = index;
                view.setOnClickListener(new OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (mListener != null) {
                            mListener.onDayClick(view, position, calendar);
                        }
                    }
                });

                mAdapter.setDayView(view, i, calendar);
                index++;
            }
        }
    }

    /**
     * 시작요일 설정(ex : Calendar.MONDAY, Calendar.SUNDAY)
     * @param value
     */
    public void setFirstDayOfWeek(int value) {
        mFirstWeek = value;
    }

    public void setOnDayClickListener(OnDayClickListener listener) {
        mListener = listener;
    }

    private LinearLayout createWeekView() {
        LinearLayout layout = new LinearLayout(getContext());
        layout.setOrientation(HORIZONTAL);
        return layout;
    }

    private void initLayout() {
        if (mAdapter == null) {
            return;
        }

        //Day 뷰 추가
        int i = 0;
        for (LinearLayout layout : mRows) {
            for (int j = 0 ; j < 7 ; j++) {
                View view;
                if (i == 0) {
                    view = View.inflate(getContext(), mAdapter.getWeekViewId(), null);
                }
                else {
                    view = View.inflate(getContext(), mAdapter.getDayViewId(), null);
                }
                layout.addView(view, new LayoutParams(0, -1, 1));
            }
            i++;
        }

        refresh();
    }
}
