/**
 * 
 */
package net.cruxware.android.net.io;

/**
 * @author freetome
 * 
 * 
 */
public final class ByteBuffer implements java.io.Serializable {

	/**
	 * 직렬화 ID
	 */

	private static final long serialVersionUID = 3168594585386937483L;

	/**
	 * The value is used for byte storage.
	 * 
	 * @serial
	 */
	private byte value[];

	/**
	 * The count is the number of bytes in the buffer.
	 * 
	 * @serial
	 */
	private int count;

	/**
	 * A flag indicating whether the buffer is shared
	 * 
	 * @serial
	 */
	private boolean shared;

	/**
	 * byte[]를 가지지 않고, 초기 용량이 16 문자인 byte buffer 를 생성한다.
	 */
	public ByteBuffer() {
		this(16);
	}

	/**
	 * byte[]를 가지지 않고, 지정된 초기 용량을 가지는 byte buffer 를 생성한다.
	 * 
	 * @param length
	 *            the initial capacity.
	 * @exception NegativeArraySizeException
	 *                if the <code>length</code> argument is less than
	 *                <code>0</code>.
	 */
	public ByteBuffer(int length) {
		value = new byte[length];
		shared = false;
	}

	/**
	 * 지정된 byte[] 초기화된 byte buffer 를 생성한다.<br>
	 * 초기 용량은,16 에 bytes[] 길이를 더한 것입니다.
	 * 
	 * @param bytes
	 */
	public ByteBuffer(byte[] bytes) {
		this(bytes.length + 16);
		append(bytes);
	}

	/**
	 * 지정된 String의 byte 배열로 초기화해서 byte buffer를 생성한다.
	 * 
	 * @param string
	 */
	public ByteBuffer(String string) {
		this(string.getBytes());
	}

	/**
	 * 현재 byte[]로 저장된 데이터의 길이를 돌려준다. 단, buffer의 크기와는 다르다.
	 * 
	 * @return int 실제 저장된 데이터의 길이
	 */
	public synchronized int length() {
		return count;
	}

	/**
	 * 버퍼의 전체 크기를 돌려준다.
	 * 
	 * @return 버퍼의 크기를 돌려준다. ( 실제 byte[] 크기가 아니다 )
	 */
	public synchronized int capacity() {
		return value.length;
	}

	/**
	 * 데이터를 copy 한다
	 */
	private final void copy() {
		byte newValue[] = new byte[value.length];
		System.arraycopy(value, 0, newValue, 0, count);
		value = newValue;
		shared = false;
	}

	/**
	 * 용량이 지정된 최소치 이상이 되는 것을 보증합니다. 이 현재의 용량이 인수보다 작은 경우는, <br>
	 * 보다 용량의 큰 새로운 내부 배열을 할당할 수 있습니다. 새로운 용량은 다음의 2 개중 큰 편입니다.<br> # 이전의 용량의 2
	 * 배의 양에 2 를 더한 값 ,br> # minimumCapacity 인수가 정의 값이 아닌 경우, 이 메소드는 아무것도 실시하지
	 * 않고 복귀합니다.
	 * 
	 * @param minimumCapacity
	 *            보증하고 싶은 최소 용량
	 */
	public synchronized void ensureCapacity(int minimumCapacity) {
		if (minimumCapacity > value.length) {
			expandCapacity(minimumCapacity);
		}
	}

	private void expandCapacity(int minimumCapacity) {
		int newCapacity = (value.length + 1) * 2;
		if (newCapacity < 0) {
			newCapacity = Integer.MAX_VALUE;
		} else if (minimumCapacity > newCapacity) {
			newCapacity = minimumCapacity;
		}

		byte newValue[] = new byte[newCapacity];
		System.arraycopy(value, 0, newValue, 0, count);
		value = newValue;
		shared = false;
	}

	public synchronized void setLength(int newLength) {
		if (newLength < 0) {
			throw new StringIndexOutOfBoundsException(newLength);
		}

		if (newLength > value.length) {
			expandCapacity(newLength);
		}

		if (count < newLength) {
			if (shared)
				copy();
			for (; count < newLength; count++) {
				value[count] = '\0';
			}
		} else {
			count = newLength;
			if (shared) {
				if (newLength > 0) {
					copy();
				} else {
					// If newLength is zero, assume the StringBuffer is being
					// stripped for reuse; Make new buffer of default size
					value = new byte[16];
					shared = false;
				}
			}
		}
	}

	public synchronized byte byteAt(int index) {
		if ((index < 0) || (index >= count)) {
			throw new IndexOutOfBoundsException(index
					+ " : index is 0 < index < this.length() ");
		}
		return value[index];
	}

	public synchronized void getBytes(int srcBegin, int srcEnd, byte dst[],
			int dstBegin) {
		if (srcBegin < 0) {
			throw new StringIndexOutOfBoundsException(srcBegin);
		}
		if ((srcEnd < 0) || (srcEnd > count)) {
			throw new StringIndexOutOfBoundsException(srcEnd);
		}
		if (srcBegin > srcEnd) {
			throw new StringIndexOutOfBoundsException("srcBegin > srcEnd");
		}
		System.arraycopy(value, srcBegin, dst, dstBegin, srcEnd - srcBegin);
	}

	public synchronized void setByteAt(int index, byte ch) {
		if ((index < 0) || (index >= count)) {
			throw new StringIndexOutOfBoundsException(index);
		}
		if (shared)
			copy();
		value[index] = ch;
	}

	public synchronized ByteBuffer append(Object obj) {
		if (obj instanceof byte[])
			return append((byte[]) obj);
		else if (obj instanceof ByteBuffer)
			return append((ByteBuffer) obj);
		return append(String.valueOf(obj));
	}

	public synchronized ByteBuffer append(String str) {
		return append(str.getBytes());
	}

	public synchronized ByteBuffer append(ByteBuffer sb) {
		return append(sb.toBytes());
	}
	
	
	//private static final ByteBuffer NULL = new ByteBuffer("null");

	public synchronized ByteBuffer append(byte str[]) {
		int len = str.length;
		int newcount = count + len;
		if (newcount > value.length)
			expandCapacity(newcount);
		System.arraycopy(str, 0, value, count, len);
		count = newcount;
		return this;
	}

	public synchronized ByteBuffer append(byte str[], int offset, int len) {
		int newcount = count + len;
		if (newcount > value.length)
			expandCapacity(newcount);
		System.arraycopy(str, offset, value, count, len);
		count = newcount;
		return this;
	}

	public synchronized ByteBuffer append(boolean b) {
		if (b) {
			int newcount = count + 4;
			if (newcount > value.length)
				expandCapacity(newcount);
			value[count++] = 't';
			value[count++] = 'r';
			value[count++] = 'u';
			value[count++] = 'e';
		} else {
			int newcount = count + 5;
			if (newcount > value.length)
				expandCapacity(newcount);
			value[count++] = 'f';
			value[count++] = 'a';
			value[count++] = 'l';
			value[count++] = 's';
			value[count++] = 'e';
		}
		return this;
	}

	public synchronized ByteBuffer append(byte c) {
		int newcount = count + 1;
		if (newcount > value.length)
			expandCapacity(newcount);
		value[count++] = c;
		return this;
	}

	public synchronized ByteBuffer append(char c) {
		// char 변환시 오류는 나중에 생각해 볼껏.. ( 강제로 replace 할것인지 ) 오류로 그냥 나둘것인지
		return append((byte) c);
	}

	public synchronized ByteBuffer append(int i) {
		// char 변환시 오류는 나중에 생각해 볼껏.. ( 강제로 replace 할것인지 ) 오류로 그냥 나둘것인지
		return append((byte) i);
	}

	public synchronized ByteBuffer append(long l) {
		// char 변환시 오류는 나중에 생각해 볼껏.. ( 강제로 replace 할것인지 ) 오류로 그냥 나둘것인지
		return append((byte) l);
	}

	public synchronized ByteBuffer append(float f) {
		// char 변환시 오류는 나중에 생각해 볼껏.. ( 강제로 replace 할것인지 ) 오류로 그냥 나둘것인지
		return append((byte) f);
	}

	public synchronized ByteBuffer append(double d) {
		// char 변환시 오류는 나중에 생각해 볼껏.. ( 강제로 replace 할것인지 ) 오류로 그냥 나둘것인지
		return append((byte) d);
	}

	public synchronized ByteBuffer delete(int start, int end) {
		if (start < 0)
			throw new StringIndexOutOfBoundsException(start);
		if (end > count)
			end = count;
		if (start > end)
			throw new StringIndexOutOfBoundsException();

		int len = end - start;
		if (len > 0) {
			if (shared)
				copy();
			System.arraycopy(value, start + len, value, start, count - end);
			count -= len;
		}
		return this;
	}

	public synchronized ByteBuffer deleteByteAt(int index) {
		if ((index < 0) || (index >= count))
			throw new StringIndexOutOfBoundsException();
		if (shared)
			copy();
		System.arraycopy(value, index + 1, value, index, count - index - 1);
		count--;
		return this;
	}

	@SuppressWarnings("deprecation")
	public synchronized ByteBuffer replace(int start, int end, String str) {
		if (start < 0)
			throw new StringIndexOutOfBoundsException(start);
		if (end > count)
			end = count;
		if (start > end)
			throw new StringIndexOutOfBoundsException();

		int len = str.length();
		int newCount = count + len - (end - start);
		if (newCount > value.length)
			expandCapacity(newCount);
		else if (shared)
			copy();

		System.arraycopy(value, end, value, start + len, count - end);
		str.getBytes(0, len, value, start);
		count = newCount;
		return this;
	}

	public ByteBuffer replace(char oldChar, char newChar) {

		if (oldChar != newChar) {
			int len = count;
			int i = -1;
			byte[] value = this.value; /* avoid getfield opcode */
			int off = 0; /* avoid getfield opcode */

			while (++i < len) {
				if ((char) value[off + i] == oldChar) {
					break;
				}
			}
			if (i < len) {
				byte buf[] = new byte[len];
				for (int j = 0; j < i; j++) {
					buf[j] = value[off + j];
				}
				while (i < len) {
					byte c = value[off + i];
					buf[i] = (c == oldChar) ? (byte) newChar : c;
					i++;
				}
				return new ByteBuffer(buf);
			}
		}
		return this;
	}

	public synchronized String substring(int start) {
		return substring(start, count);
	}

	// 1.4 에서만 가능
	// public CharSequence subSequence(int start, int end) {
	// return this.substring(start, end);
	// }

	public synchronized String substring(int start, int end) {
		if (start < 0)
			throw new StringIndexOutOfBoundsException(start);
		if (end > count)
			throw new StringIndexOutOfBoundsException(end);
		if (start > end)
			throw new StringIndexOutOfBoundsException(end - start);
		return new String(value, start, end - start);
	}

	public synchronized ByteBuffer insert(int index, char str[], int offset,
                                          int len) {
		if ((index < 0) || (index > count))
			throw new StringIndexOutOfBoundsException();
		if ((offset < 0) || (offset + len < 0) || (offset + len > str.length))
			throw new StringIndexOutOfBoundsException(offset);
		if (len < 0)
			throw new StringIndexOutOfBoundsException(len);
		int newCount = count + len;
		if (newCount > value.length)
			expandCapacity(newCount);
		else if (shared)
			copy();
		System.arraycopy(value, index, value, index + len, count - index);
		System.arraycopy(str, offset, value, index, len);
		count = newCount;
		return this;
	}

	public synchronized ByteBuffer insert(int offset, Object obj) {
		return insert(offset, String.valueOf(obj));
	}

	@SuppressWarnings("deprecation")
	public synchronized ByteBuffer insert(int offset, String str) {
		if ((offset < 0) || (offset > count)) {
			throw new StringIndexOutOfBoundsException();
		}

		if (str == null) {
			str = String.valueOf(str);
		}
		int len = str.length();
		int newcount = count + len;
		if (newcount > value.length)
			expandCapacity(newcount);
		else if (shared)
			copy();
		System.arraycopy(value, offset, value, offset + len, count - offset);
		str.getBytes(0, len, value, offset);
		count = newcount;
		return this;
	}

	public synchronized ByteBuffer insert(int offset, byte str[]) {
		if ((offset < 0) || (offset > count)) {
			throw new StringIndexOutOfBoundsException();
		}
		int len = str.length;
		int newcount = count + len;
		if (newcount > value.length)
			expandCapacity(newcount);
		else if (shared)
			copy();
		System.arraycopy(value, offset, value, offset + len, count - offset);
		System.arraycopy(str, 0, value, offset, len);
		count = newcount;
		return this;
	}

	public ByteBuffer insert(int offset, boolean b) {
		return insert(offset, String.valueOf(b));
	}

	public synchronized ByteBuffer insert(int offset, byte c) {
		int newcount = count + 1;
		if (newcount > value.length)
			expandCapacity(newcount);
		else if (shared)
			copy();
		System.arraycopy(value, offset, value, offset + 1, count - offset);
		value[offset] = c;
		count = newcount;
		return this;
	}

	public ByteBuffer insert(int offset, int i) {
		return insert(offset, String.valueOf(i));
	}

	public ByteBuffer insert(int offset, long l) {
		return insert(offset, String.valueOf(l));
	}

	public ByteBuffer insert(int offset, float f) {
		return insert(offset, String.valueOf(f));
	}

	public ByteBuffer insert(int offset, double d) {
		return insert(offset, String.valueOf(d));
	}

	public int indexOf(String str) {
		return indexOf(str, 0);
	}

	/**
	 * byte[] 이 문자열인 경우만 사용할 것,
	 * 
	 * @param str
	 * @param fromIndex
	 * @return 주어진 문자열의 최초 위치를 찾아서, 돌려준다.
	 */
	public synchronized int indexOf(String str, int fromIndex) {
		return new String(value).indexOf(str, fromIndex);
	}

	/**
	 * byte[] 이 문자열인 경우만 사용할 것,
	 * 
	 * @param str
	 * @return int 마지막 해당 문자열의 위치를 돌려준다.
	 */
	public synchronized int lastIndexOf(String str) {
		return lastIndexOf(str, count);
	}

	public synchronized int lastIndexOf(String str, int fromIndex) {
		return new String(value).lastIndexOf(str, fromIndex);
	}

	public synchronized ByteBuffer reverse() {
		if (shared)
			copy();
		int n = count - 1;
		for (int j = (n - 1) >> 1; j >= 0; --j) {
			byte temp = value[j];
			value[j] = value[n - j];
			value[n - j] = temp;
		}
		return this;
	}

	public String toString() {
		byte[] tmp = new byte[length()];
		this.getBytes(0, length(), tmp, 0);
		return new String(tmp);
	}

	public byte[] toBytes() {
		byte[] rtn = new byte[length()];
		this.getBytes(0, rtn.length, rtn, 0);
		return rtn;
	}

	final void setShared() {
		shared = true;
	}

	final byte[] getValue() {
		return value;
	}

	private synchronized void readObject(java.io.ObjectInputStream s)
			throws java.io.IOException, ClassNotFoundException {
		s.defaultReadObject();
		value = (byte[]) value.clone();
		shared = false;
	}

	public String toHexString() {
		return toHexFormat(toBytes());
	}

	private String toHexFormat(byte[] b) {
		return toHexFormat(b, 0, b.length - 1);
	}

	String toHexFormat(byte[] b, int beginidx, int endidx) {
		int count = 1;
		String hex = "";
		StringBuffer sb = new StringBuffer(b.length * 2 + 1);
		int lastIdx = (b.length - 1 < endidx) ? b.length - 1 : endidx;
		for (int i = beginidx; i <= lastIdx; i++) {
			hex = Integer.toHexString(b[i]);
			if (hex.length() == 1)
				hex = "0" + hex;
			else if (hex.length() == 8)
				hex = hex.substring(6);

			sb.append(hex.toUpperCase() + " ");

			if ((count % 16) == 0)
				sb.append("\n");
			else if ((count % 8) == 0)
				sb.append(" ");

			count++;
		}
		return sb.toString();
	}

}
