package com.baby.aircok.acbaby.net.client;

import android.os.Handler;

import net.cruxware.android.net.client.NetworkClient;
import net.cruxware.android.net.client.NetworkProcessor;
import net.cruxware.android.net.transaction.Transaction;
import net.cruxware.android.net.transaction.TransactionException;

/**
 * Created by CHO on 2016. 10. 31..
 */

public class ProcessorManager implements NetworkClient {


    private static ProcessorManager mInstance;
    private C2HTTPProcessor mProcessor;
    private C2NetworkClient mClient;

    public interface C2NetworkClient {
        void onExceptionThrownOnUiThread(NetworkProcessor networkProcessor, TransactionException e);
        void onTransactionReceivedOnUiThread(NetworkProcessor networkProcessor, Transaction transaction);
    }

    public static ProcessorManager getInstance(){
        if (mInstance == null) {
            synchronized(ProcessorManager.class) {
                if (mInstance == null) {
                    mInstance = new ProcessorManager();
                }
            }
        }
        return mInstance;
    }

    private ProcessorManager() {
        mProcessor = C2HTTPProcessor.getInstance();
    }

    public void sendToBLServer(C2NetworkClient client, Transaction tr) {
        if (tr == null) {return;}
        if (!(tr instanceof Transaction)) {return;}
        this.mClient = client;
        tr.setNetworkClient(this);
        mProcessor.send(tr);
    }

    @Override
    public void onConnected(NetworkProcessor networkProcessor) {
        // 아무것도 처리할 필요 없음
    }

    @Override
    public void onDisconnected(NetworkProcessor networkProcessor) {
        // 아무것도 처리할 필요 없음
    }

    @Override
    public void onStarted(NetworkProcessor networkProcessor) {}
    @Override
    public void onEnded(NetworkProcessor networkProcessor) {}

    @Override
    public void onExceptionThrown(final NetworkProcessor networkProcessor, final TransactionException e) {
        Handler handler = new Handler();
        handler.post(new Runnable() {
            @Override
            public void run() {
                if (mClient != null) {
                    mClient.onExceptionThrownOnUiThread(networkProcessor, e);
                }
            }
        });
    }

    @Override
    public void onTransactionReceived(final NetworkProcessor networkProcessor, final Transaction transaction) {
        Handler handler = new Handler();
        handler.post(new Runnable() {
            @Override
            public void run() {
                if (mClient != null) {
                    mClient.onTransactionReceivedOnUiThread(networkProcessor, transaction);
                }
            }
        });
    }
}
