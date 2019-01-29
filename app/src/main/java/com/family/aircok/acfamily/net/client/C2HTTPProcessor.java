package com.family.aircok.acfamily.net.client;


import com.family.aircok.acfamily.net.transaction.ACTransaction;
import com.family.aircok.acfamily.net.transaction.C2HTTPTransaction;

import net.cruxware.android.net.client.HTTPProcessor;
import net.cruxware.android.net.transaction.HTTPHeader;
import net.cruxware.android.net.transaction.HTTPTransaction;
import net.cruxware.android.net.transaction.Transaction;

/**
 * Created by CHO on 2016. 10. 10..
 */

public class C2HTTPProcessor extends HTTPProcessor {

    /**
     * 싱글톤 instance<br/>
     *
     * @since 1.0.0
     */
    private static C2HTTPProcessor instance;

    /**
     * 생성자<br/>
     *
     * @param poolSize 쓰레드 풀 사이즈
     * @since 1.0.0
     */
    private C2HTTPProcessor(int poolSize) {
        super(poolSize);
    }

    /**
     * 싱글톤 생성<br/>
     *
     * @since 1.0.0
     */
    public static C2HTTPProcessor getInstance(){
        if (instance == null) {
            synchronized(C2HTTPProcessor.class) {
                if (instance == null) {
                    instance = new C2HTTPProcessor(5);
                }
            }
        }
        return instance;
    }

    /**
     * 비즈니스 로직 서버에 전문을 전송한다.<br/>
     * @param tr 전송할 전문 객체
     * @since 1.0.0
     */
    public void sendToBLServer(Transaction tr) {
        if (tr == null) {return;}
        if (!(tr instanceof Transaction)) {return;}
        instance.send(tr);
    }

    @Override
    public String getTransactionCode(Transaction sent, byte[] bytes) throws Exception {
        if (sent instanceof HTTPTransaction) {
            return sent.getClass().getName();
        }

        return "";
    }

    @Override
    public Transaction createTransaction(Transaction sent, HTTPHeader httpHeader, byte[] bytes) throws Exception {
        Class<? extends Transaction> clazz = Class.forName(getTransactionCode(sent, bytes)).asSubclass(Transaction.class);
        Transaction transaction = clazz.newInstance();
        if (transaction instanceof HTTPTransaction) {
            ((HTTPTransaction) transaction).setHTTPHeader(httpHeader);
        }
        if (transaction instanceof C2HTTPTransaction ) {
            if (sent instanceof C2HTTPTransaction) {
                ((C2HTTPTransaction) transaction).setCode(((C2HTTPTransaction) sent).getCode());
            }
        }
        if (transaction instanceof ACTransaction ) {
            if (sent instanceof ACTransaction) {
                ((ACTransaction) transaction).setCode(((ACTransaction) sent).getCode());
            }
        }
        transaction.setBytes(bytes);
        return transaction;
    }
}
