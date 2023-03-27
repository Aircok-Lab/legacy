package com.ethree.iot.cons;

public class ResponseBaseDTO<T> {

    public static class Builder<T>{
    	
    	private  String stStr = null;
    	private  String edStr = null;
        private  T items = null;
    	
        /*======= 필수 =======*/
    	public Builder(ServiceResponseCodeWithAPI serviceResponseCode) {
    		this.stStr = serviceResponseCode.getStStr();
    		this.edStr = serviceResponseCode.getEdStr();
    	}
    	/*======= 필수 =======*/
    	
    	/*======= 옵션 =======*/
    	public Builder<T> items(final T items) {
    		this.items = items;
    		return this;
    	}
    	/*======= 옵션 =======*/
    	
    	public String build(){
    		return this.stStr + this.items.toString() + this.edStr;
    	}
    }
    
    public enum ServiceResponseCodeWithAPI {
    	
        INSERT_DEVICE("/device", "POST", "$$aircok:s$$OK|","$$aircok:e$$"),
        SELECT_DEVICE("/device", "POST", "$$aircok:s$$","$$aircok:e$$"),
        NO_DEVICE("/device", "POST", "$$aircok:s$$NO|","$$aircok:e$$");
    	
    	private String endPoint;
    	private String method;
    	private String stStr;
    	private String edStr;

        ServiceResponseCodeWithAPI(final String endPoint, final String method, final String stStr, final String edStr) {
        	this.endPoint=endPoint;
        	this.method=method;
        	this.stStr=stStr;
        	this.edStr=edStr;
        }

		public String getEndPoint() {
			return endPoint;
		}

		public String getMethod() {
			return method;
		}

		public String getStStr() {
			return stStr;
		}

		public String getEdStr() {
			return edStr;
		}

    }
    
    
}
