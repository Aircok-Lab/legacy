package net.cruxware.android.base.util;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * JSON 유틸리티
 * @author fmthead@i-on.net
 * @version 1.0.0
 * @since 1.0.0
 */
public class JSONUtil 
{
	/**
	 * JSON에서 안전하게 문자열을 얻는다.
	 * @param json JSON 오브젝트
	 * @param key 키
	 * @return 값
	 * @since 1.0.0
	 */
    public static String getSafeString(JSONObject json, String key)
    {
		try {
			if (!json.isNull(key)) {
				String result = json.getString(key);
				result = result.replace("\\n", "\n");
				result = result.replace("\r", "");
				return result.trim();
			}
			return "";
		}
        catch(Exception exception)
        {
            return "";
        }
    }
    
	/**
	 * JSON에서 안전하게 JSON 오브젝트를 얻는다.
	 * @param json JSON 오브젝트
	 * @param key 키
	 * @return 값
	 * @since 1.0.0
	 */
    public static JSONObject getSafeObject(JSONObject json, String key)
    {
        try
        {
        	if (!json.isNull(key)) {
        		return json.getJSONObject(key);
        	}
        	return new JSONObject();
        }
        catch(Exception exception)
        {
            return new JSONObject();
        }
    }
    
	/**
	 * JSON에서 안전하게 JSON 배열을 얻는다.
	 * @param json JSON 오브젝트
	 * @param key 키
	 * @return 값
	 * @since 1.0.0
	 */
    public static JSONArray getSafeArray(JSONObject json, String key)
    {
        try
        {
        	if (!json.isNull(key)) {
        		return json.getJSONArray(key);
        	}
        	return new JSONArray();
        }
        catch(Exception exception)
        {
            return new JSONArray();
        }
    }

    /**
     * JSON배열에서 안전하게 JSON 오브젝트를 얻는다.
     * @param array json 배열
     * @param index	인덱스
     * @return
     */
    public static JSONObject getSafeObject(JSONArray array, int index) {
    	try
    	{
    		return array.getJSONObject(index);
    	}
    	catch(Exception exception)
    	{
    		return new JSONObject();
    	}
    }
    
    /**
     * JSON에 안전하게 값을 설정한다.
     * @param json JSON 오브젝트
     * @param key 키
     * @param value 값
	 * @since 1.0.0
     */
    public static void putSafe(JSONObject json, String key, Object value)
    {
        try
        {
            json.put(key, value);
        }
        catch(Exception exception) { }
    }
}
