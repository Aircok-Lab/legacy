package net.cruxware.android.net.client;


import android.util.Log;

import net.cruxware.android.net.io.ByteBuffer;
import net.cruxware.android.net.transaction.HTTPHeader;
import net.cruxware.android.net.transaction.HTTPTransaction;
import net.cruxware.android.net.transaction.MultipartItem;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.HttpVersion;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.cookie.Cookie;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.http.params.HttpProtocolParams;
import org.apache.http.protocol.HTTP;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;
import java.net.UnknownHostException;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;


/**
 * 표준 HTTP 프로세서 클래스 <br/>
 * HTTP 프로토콜을 이용하는 프로세서는 해당 클래스를 상속 받아야 한다.<br/>
 * [변경이력]<br/>
 * 1.0.0: 최초생성<br/>
 * 
 * @author fmthead@cruxware.net
 * @version 1.0.1
 * @since 1.0.0
 */
public abstract class HTTPProcessor extends NetworkProcessor {

	public interface CookieDelegate {
		List<Cookie> getCookies();

		void setCookies(List<Cookie> cookies);
	}

	/**
	 * HTTP 쓰레드 풀 구동 클래스<br/>
	 * [변경이력]<br/>
	 * 1.0.0: 최초생성<br/>
	 * 
	 * @author fmthead@cruxware.net
	 * @version 1.0.1
	 * @since 1.0.0
	 */
	class HTTPRunnable implements Runnable {

		/**
		 * 전문 객체<br/>
		 * 
		 * @since 1.0.0
		 */
		private Transaction transaction;

		/**
		 * 생성자<br/>
		 * 
		 * @param transaction
		 *            전문 객체
		 * @since 1.0.0
		 */
		HTTPRunnable(Transaction transaction) {
			this.transaction = transaction;
		}

		@Override
		public void run() {
			process(transaction);
		}
	}

	/**
	 * 쓰레드 풀<br/>
	 * 
	 * @since 1.0.0
	 */
	private final ExecutorService pool;

	private CookieDelegate cookieDelegate;

	/**
	 * 생성자<br/>
	 * 
	 * @param poolSize
	 *            쓰레드 풀 사이즈
	 * @since 1.0.0
	 */
	protected HTTPProcessor(int poolSize) {
		super();
		pool = Executors.newFixedThreadPool(poolSize);
	}

	public void setCookieDelegate(CookieDelegate cookieDelegate) {
		this.cookieDelegate = cookieDelegate;
	}

	@Override
	public void shutdown() {
		pool.shutdown();
	}

	@Override
	public void send(Transaction transaction) {
		if (!transaction.isPolling() && transaction.getNetworkClient() != null) {
			try {
				transaction.getNetworkClient().onStarted(this);
			} catch (Exception e) {
			}
		}
		pool.execute(new HTTPRunnable(transaction));
	}

	/**
	 * 수신된 데이터로 전문을 생성한다.<br/>
	 * 
	 * @param sent
	 *            전송한 전문 객체
	 * @param httpHeader
	 *            HTTP header;
	 * @param bytes
	 *            수신된 데이터
	 * @return 수신된 전문 객체
	 * @throws Exception
	 *             예외
	 * @since 1.0.1
	 */
	public Transaction createTransaction(Transaction sent, HTTPHeader httpHeader, byte[] bytes) throws Exception {
		Class<? extends Transaction> clazz = Class.forName(sent.getPrefix() + getTransactionCode(sent, bytes)).asSubclass(Transaction.class);
		Transaction transaction = clazz.newInstance();
		if (transaction instanceof HTTPTransaction) {
			((HTTPTransaction) transaction).setHTTPHeader(httpHeader);
		}
		transaction.setBytes(bytes);
		return transaction;
	}

	/**
	 * HTTP 송수신을 처리한다.<br/>
	 * 
	 * @param transaction
	 *            전문 객체
	 * @since 1.0.0
	 */
	public void process(Transaction transaction) {
		InputStreamReader is = null;
		BufferedReader reader = null;
		try {
			if (transaction instanceof HTTPTransaction) {
				HTTPTransaction httpTransaction = (HTTPTransaction) transaction;
				DefaultHttpClient httpClient = new DefaultHttpClient();

				String multipartBoundary = null;
				if (httpTransaction.isMultipart()) {
					multipartBoundary = String.format("-----------------------------%s", UUID.randomUUID().toString());
				}

				HttpParams params = httpClient.getParams();
				HttpConnectionParams.setConnectionTimeout(params, httpTransaction.getConnectionTimeout());
				HttpConnectionParams.setSoTimeout(params, httpTransaction.getSoTimeout());
				HttpUriRequest request = null;
				if (httpTransaction.getMethod().equals("GET")) {
					HttpGet httpGet = new HttpGet(httpTransaction.getConnectionURL());
					request = httpGet;
				} else if (httpTransaction.getMethod().equals("POST")) {
					HttpPost httpPost = new HttpPost(httpTransaction.getConnectionURL());
					HttpEntity entity = null;
					if (httpTransaction.isMultipart()) {
						ByteBuffer postbody = new ByteBuffer();
						List<MultipartItem> multiparts = httpTransaction.getMultiparts();
						String str = null;
						for (MultipartItem item : multiparts) {
							str = String.format("\r\n--%s\r\n", multipartBoundary);
							// Log.d(">>>>>>>>>>", str);
							postbody.append(str.getBytes(httpTransaction.getCharset()));
							if (item.getFilename() != null) {
								str = String.format("Content-Disposition: form-data; name=\"%s\"; filename=\"%s\"\r\n", item.getName(), item.getFilename());
							} else {
								str = String.format("Content-Disposition: form-data; name=\"%s\"\r\n", item.getName());
							}
							// Log.d(">>>>>>>>>>", str);
							postbody.append(str.getBytes(httpTransaction.getCharset()));
							str = String.format("Content-Type: %s\r\n\r\n", item.getContentType());
							// Log.d(">>>>>>>>>>", str);
							postbody.append(str.getBytes(httpTransaction.getCharset()));
							// Log.d(">>>>>>>>>>", "<<< DATA(" +
							// item.getData().length + ") >>>");
							postbody.append(item.getData());
						}
						str = String.format("\r\n--%s--\r\n", multipartBoundary);
						postbody.append(str.getBytes(httpTransaction.getCharset()));
						entity = new ByteArrayEntity(postbody.toBytes());
					} else {
						entity = new ByteArrayEntity(transaction.getBytes());
					}
					httpPost.setEntity(entity);
					request = httpPost;
				} else {
					throw new Exception("Not allowed method: " + httpTransaction.getMethod());
				}
				HTTPHeader httpHeader = httpTransaction.getHTTPHeader();
				if (httpHeader != null) {
					httpHeader.markTimestamp();
					Map<String, String> headerFields = httpHeader.getHeaderFields();
					if (!headerFields.containsKey("User-Agent") && !headerFields.containsKey("user-agent") && !headerFields.containsKey("User-agent")
							&& !headerFields.containsKey("user-Agent")) {
						request.setHeader("User-Agent", getDefaultUserAgent());
					}
					if (!headerFields.containsKey("Content-Type") && !headerFields.containsKey("content-type") && !headerFields.containsKey("Content-type")
							&& !headerFields.containsKey("content-Type") && !headerFields.containsKey("ContentType")
							&& !headerFields.containsKey("contenttype") && !headerFields.containsKey("Contenttype") && !headerFields.containsKey("contentType")) {
						if (httpTransaction.isMultipart()) {
							request.setHeader("Content-Type", String.format("multipart/form-data;boundary=%s", multipartBoundary));
						} else {
							request.setHeader("Content-Type", getDefaultContentType(httpTransaction.getCharset()));
						}
					}
					Set<String> keys = headerFields.keySet();
					Iterator<String> iterator = keys.iterator();
					while (iterator.hasNext()) {
						String key = iterator.next();
						request.setHeader(key, headerFields.get(key));
						// Log.d(">>>>>>>>>>", "key = " + key);
						// Log.d(">>>>>>>>>>", "value = " +
						// headerFields.get(key));
					}
				} else {
					request.setHeader("User-Agent", getDefaultUserAgent());
					if (httpTransaction.isMultipart()) {
						request.setHeader("Content-Type", String.format("multipart/form-data;boundary=%s", multipartBoundary));
					} else {
						request.setHeader("Content-Type", getDefaultContentType(httpTransaction.getCharset()));
					}
				}

				// 쿠키 설정
				if (cookieDelegate != null) {
					List<Cookie> cookies = cookieDelegate.getCookies();
					for (Cookie cookie : cookies) {
						httpClient.getCookieStore().addCookie(cookie);
					}
				}

				HttpResponse res = httpClient.execute(request);
				StatusLine status = res.getStatusLine();
				if (status.getStatusCode() == HttpStatus.SC_OK) {

					// 쿠키 저장 처리
					if (cookieDelegate != null) {
						List<Cookie> cookies = httpClient.getCookieStore().getCookies();
						cookieDelegate.setCookies(cookies);
					}

					Map<String, String> headerFields = new HashMap<String, String>();
					Header[] headers = res.getAllHeaders();
					for (Header header : headers) {
						headerFields.put(header.getName(), header.getValue());
					}
					httpHeader = new HTTPHeader(headerFields);

					is = new InputStreamReader(res.getEntity().getContent(), httpTransaction.getCharset());
					reader = new BufferedReader(is);
					String line;
					StringBuffer response = new StringBuffer();
					while ((line = reader.readLine()) != null) {
						if (response.length() > 0) {
							response.append("\n");
						}
						response.append(line);
					}
					byte[] received = response.toString().getBytes(httpTransaction.getCharset());
					Transaction receivedTransaction = createTransaction(httpTransaction, httpHeader, received);
					if (!transaction.isPolling() && transaction.getNetworkClient() != null) {
						try {
							transaction.getNetworkClient().onEnded(this);
						} catch (Exception e) {
						}
					}
					if (transaction.getNetworkClient() != null) {
						try {
							transaction.getNetworkClient().onTransactionReceived(this, receivedTransaction);
						} catch (Exception e) {
						}
					}
				} else {
					throw new Exception();
				}
			} else {
				throw new Exception("Not allowed transaction: " + transaction.getClass().getName());
			}
		} catch (TransactionException e) {
			// Log.e(">>>>>>>>>>", e.toString(), e);
			if (!transaction.isPolling() && transaction.getNetworkClient() != null) {
				try {
					transaction.getNetworkClient().onEnded(this);
				} catch (Exception e1) {
				}
			}
			if (transaction.getNetworkClient() != null) {
				try {
					transaction.getNetworkClient().onExceptionThrown(this, e);
				} catch (Exception e1) {
				}
			}
		} catch (Exception e) {
			 Log.e(">>>>>>>>>>", e.toString(), e);
			if (!transaction.isPolling() && transaction.getNetworkClient() != null) {
				try {
					transaction.getNetworkClient().onEnded(this);
				} catch (Exception e1) {
				}
			}
			if (transaction.getNetworkClient() != null) {
				try {
					transaction.getNetworkClient().onExceptionThrown(this, new TransactionException(e));
				} catch (Exception e1) {
				}
			}
		} finally {
			try {
				if (is != null) {
					is.close();
				}
			} catch (IOException e) {
			}
			try {
				if (reader != null) {
					reader.close();
				}
			} catch (Exception e) {
			}
		}
	}

	private String getDefaultContentType(String charset) {
		return "application/x-www-form-urlencoded;charset=" + charset;
	}

	private String getDefaultUserAgent() {
		return "Profile/Java-1.6 Configuration/CruxwareClientNetworkEngine-1.0.1";
	}

	public DefaultHttpClient getHttpClient() {
		try {
			KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
			trustStore.load(null, null);

			SSLSocketFactory sf = new CustomSSLSocketFactory(trustStore);
			sf.setHostnameVerifier(SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);

			HttpParams params = new BasicHttpParams();
			HttpProtocolParams.setVersion(params, HttpVersion.HTTP_1_1);
			HttpProtocolParams.setContentCharset(params, HTTP.UTF_8);

			SchemeRegistry registry = new SchemeRegistry();
			registry.register(new Scheme("http", PlainSocketFactory.getSocketFactory(), 80));
			registry.register(new Scheme("https", sf, 443));

			ClientConnectionManager ccm = new ThreadSafeClientConnManager(params, registry);

			return new DefaultHttpClient(ccm, params);
		} catch (Exception e) {
			return new DefaultHttpClient();
		}
	}

	public class CustomSSLSocketFactory extends SSLSocketFactory {
		SSLContext sslContext = SSLContext.getInstance("TLS");

		public CustomSSLSocketFactory(KeyStore trustStore) throws KeyManagementException, UnrecoverableKeyException, NoSuchAlgorithmException,
				KeyStoreException {
			super(trustStore);
			TrustManager tm = new X509TrustManager() {

				@Override
				public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
					// Log.d(">>>>>", "authType = " + authType);
				}

				@Override
				public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
					// Log.d(">>>>>", "authType = " + authType);
				}

				@Override
				public X509Certificate[] getAcceptedIssuers() {
					return null;
				}
			};
			sslContext.init(null, new TrustManager[] { tm }, null);
		}

		@Override
		public Socket createSocket(Socket socket, String host, int port, boolean autoClose) throws IOException, UnknownHostException {
			return sslContext.getSocketFactory().createSocket(socket, host, port, autoClose);
		}

		@Override
		public Socket createSocket() throws IOException {
			return sslContext.getSocketFactory().createSocket();
		}
	}

	public static BasicCookieStore getCookieStore(String cookies, String domain) {
		System.out.println("cookies : " + cookies);
		System.out.println("domain : " + domain);
		BasicCookieStore cs = new BasicCookieStore();
		try {
			String[] cookieValues = cookies.split(";");
			BasicClientCookie cookie;
			for (int i = 0; i < cookieValues.length; i++) {
				String[] split = cookieValues[i].split("=");
				if (split.length == 2) {
					cookie = new BasicClientCookie(split[0], split[1]);
				} else {
					cookie = new BasicClientCookie(split[0], null);
				}
				cookie.setDomain(domain);
				cs.addCookie(cookie);
			}
		} catch (Exception e) {
		}
		return cs;
	}
}
