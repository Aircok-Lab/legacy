import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';

class SamplePage extends React.Component {

    render() {
        return (
            <div className="app-wrapper">
                <ContainerHeader match={this.props.match} title='대기질센서 결과 확인'/>
                <div className="d-flex justify-content-center">
                    <h1><IntlMessages id="pages.samplePage.description"/></h1>
                </div>

            </div>
        );
    }
}

export default SamplePage;