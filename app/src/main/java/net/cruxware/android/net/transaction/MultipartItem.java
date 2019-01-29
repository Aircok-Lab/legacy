package net.cruxware.android.net.transaction;


public class MultipartItem {

	protected String name;
	protected String filename;
	protected String contentType;
	protected byte[] data;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public byte[] getData() {
		return data;
	}

	public void setData(byte[] data) {
		this.data = data;
	}

	public MultipartItem(String name, String contentType) {
		this(name, null, contentType, null);
	}

	public MultipartItem(String name, String contentType, byte[] data) {
		this(name, null, contentType, data);
	}

	public MultipartItem(String name, String filename, String contentType) {
		this(name, filename, contentType, null);
	}

	public MultipartItem(String name, String filename, String contentType, byte[] data) {
		this.name = name;
		this.filename = filename;
		this.contentType = contentType;
		this.data = data;
	}
}
