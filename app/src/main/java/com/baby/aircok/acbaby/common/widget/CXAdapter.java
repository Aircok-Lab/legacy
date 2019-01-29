package com.baby.aircok.acbaby.common.widget;

import android.widget.BaseAdapter;

import java.util.Vector;

public abstract class CXAdapter extends BaseAdapter {
	
	public Vector<Object> datas = new Vector<Object>();
	
	@Override
	public int getCount() {
		if (datas == null) return 0;
		return datas.size();
	}

	@Override
	public Object getItem(int position) {
		if (position > getCount() - 1) return null;;
		return datas.elementAt(position);
	}

	@Override
	public long getItemId(int position) {
		return position;
	}
}
