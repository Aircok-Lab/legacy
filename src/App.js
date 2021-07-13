import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview'

const domain = 'http://smart.aircok.com:13701/'
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexPage: { uri: domain + '?ver=2' }
        };
    }
    onWebViewMessage = event => {
        console.log('onWebViewMessage', JSON.parse(event.nativeEvent.data))
        let msgData;
        try {
            msgData = JSON.parse(event.nativeEvent.data) || {}
        } catch (error) {
            console.error(error)
            return
        }
        this[msgData.targetFunc].apply(this, [msgData]);
    }

    /**
     * 영화목록을 받아와서 화면에 전달한다.
     */
    getMovieList = msgData => {
        const option = {
            method: 'GET',
            timeout: 60000
        }
        let url = domain + msgData.data.url

        fetch(url, option)
            .then(res => {
                return res.json()
            })
            .then(response => {
                console.log('<====== response', response)
                msgData.isSuccessfull = true
                msgData.data = response
                this.appWebview.postMessage(JSON.stringify(msgData), '*');
            })
            .catch(error => {
                console.log(error)
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    style={styles.webview}
                    source={this.state.indexPage}
                    originWhitelist={['*']}
                    ref={webview => this.appWebview = webview}
                    onMessage={this.onWebViewMessage}
                    javaScriptEnabled={true}
                    useWebKit={true}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30
    },
    webview: {
        flex: 1
    }
});