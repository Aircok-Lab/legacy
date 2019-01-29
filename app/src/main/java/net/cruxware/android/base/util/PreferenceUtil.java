package net.cruxware.android.base.util;

import android.content.Context;
import android.content.SharedPreferences;

import java.util.Map;

/**
 * SharedPreferences 관리 유틸리티 클래스<br/>
 * [변경이력]<br/>
 * @author neon2231@cruxware.net
 * @version 1.0.0
 * @since 1.0.0
 */
public class PreferenceUtil {
	
	/**
	 * SharedPreferences에 키 값으로 String 값을 저장한다.<br/>
	 * @param context			컨텍스트
	 * @param preferences_name 	SharedPreferences의 파일명
	 * @param key				Key
	 * @param value				Value
	 * @since 1.0.0
	 */
	public static void putStringData(Context context, String preferences_name, String key, String value){
		SharedPreferences preferences = (SharedPreferences) context.getSharedPreferences(preferences_name, Context.MODE_PRIVATE);
		SharedPreferences.Editor edit = preferences.edit();
		edit.putString(key, value);
		edit.commit();
	}
	
	/**
	 * SharedPreferences에 키 값으로 boolean 값을 저장한다.<br/>
	* @param context			컨텍스트
	 * @param preferences_name 	SharedPreferences의 파일명
	 * @param key				Key
	 * @param value				Value
	 * @since 1.0.0
	 */
	public static void putBooleanData(Context context, String preferences_name, String key, boolean value){
		SharedPreferences preferences    = (SharedPreferences) context.getSharedPreferences(preferences_name, Context.MODE_PRIVATE);
		SharedPreferences.Editor edit = preferences.edit();
		edit.putBoolean(key, value);
		edit.commit();
	}

	/**
	 * SharedPreferences에 키 값으로 String 값을 얻는다.<br/>
	* @param context			컨텍스트
	 * @param preferences_name 	SharedPreferences의 파일명
	 * @param key				Key
	 * @param value				Value
	 * @since 1.0.0
	 */
	public static String getStringData(Context context, String preferences_name, String key){
		SharedPreferences preferences   = (SharedPreferences) context.getSharedPreferences(preferences_name, Context.MODE_PRIVATE);
		String value = preferences.getString(key, "");
		return value;
	}
	
	/**
	 * SharedPreferences에 키 값으로  boolean 값을 얻는다.<br/>
	 * @param context			컨텍스트
	 * @param preferences_name 	SharedPreferences의 파일명
	 * @param key				Key
	 * @param value				Value
	 * @since 1.0.0
	 */
	public static boolean getBooleanData(Context context, String preferences_name, String key){
		SharedPreferences preferences = (SharedPreferences) context.getSharedPreferences(preferences_name, Context.MODE_PRIVATE);
		boolean value = preferences.getBoolean(key, false);
		return value;
	}
	
	/**
	 * SharedPreferences에 해당 키가 저장 되어 있는지 확인 후 리턴한다.<br/>
	 * @param context			컨텍스트
	 * @param preferences_name	SharedPreferences의 파일명
	 * @param key				Key
	 * @return
	 * @since 1.0.0
	 */
	public static boolean contains(Context context, String preferences_name, String key){
		SharedPreferences preferences = (SharedPreferences) context.getSharedPreferences(preferences_name, Context.MODE_PRIVATE);
		boolean bool = preferences.contains(key);
		return bool;
	}
	
	/**
	 * SharedPreferences의 모든 데이터를 Map으로 리턴한다.<br/>
	 * @param context			컨텍스트
	 * @param preferences_name	SharedPreferences의 파일명
	 * @return
	 */
	public static Map<String, ?> getAllPreferences(Context context, String preferences_name){
		SharedPreferences preferences = (SharedPreferences) context.getSharedPreferences(preferences_name, Context.MODE_PRIVATE);
		return preferences.getAll();
	}
	
	/**
	 * SharedPreferences를 초기화 한다.<br/>
	 * @param context			컨텍스트
	 * @param preferences_name	SharedPreferences의 파일명
	 * @since 1.0.0
	 */
	public static void clearData(Context context, String preferences_name){
		SharedPreferences preferences = (SharedPreferences) context.getSharedPreferences(preferences_name, Context.MODE_PRIVATE);
		SharedPreferences.Editor edit = preferences.edit();
		edit.clear();
		edit.commit();
	}
	
	/**
	 * SharedPreferences의 해당 key의 값을 제거한다.<br/>
	 * @param context			컨텍스트
	 * @param preferences_name	SharedPreferences의 파일명
	 * @param key				Key
	 * @since 1.0.0
	 */
	public static void removeData(Context context, String preferences_name, String key){
		SharedPreferences preferences = (SharedPreferences) context.getSharedPreferences(preferences_name, Context.MODE_PRIVATE);
		SharedPreferences.Editor edit = preferences.edit();
		edit.remove(key);
		edit.commit();
	}	
}
