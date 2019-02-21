import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';

const products = [];

const qualityType = {
    0: 'good',
    1: 'Bad',
    2: 'unknown'
  };

function addProducts(quantity) {
    const startId = products.length;
    for (let i = 0; i < quantity; i++) {
        const id = startId + i;
        products.push({
        building : id,
        id: id,
        name: 'Item ' + id,
        price: 2100 + i
        });
    }
}

addProducts(5);

function headerColumnClassNameFormat(row) {
    return row === 0 ? 'table-header-row0-class' : 'table-header-row1-class';
  }

class SamplePage extends React.Component {
    render() {
        return (
            <div className="app-wrapper">
                <BootstrapTable data={ products } > 
                    {/* <TableHeaderColumn row='0' rowSpan='2' dataField='building' isKey={ true } filterFormatted formatExtraData={ qualityType }
          filter={ { type: 'SelectFilter', options: qualityType } }>구분</TableHeaderColumn> */}
                    <TableHeaderColumn row='0' rowSpan='2' dataField='building' isKey={ true } className={ headerColumnClassNameFormat(0) }>구분</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField='position' className={ headerColumnClassNameFormat(0) }>측정기명</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField='id' className={ headerColumnClassNameFormat(0) }>공기질관리지수</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>온도<br />(℃)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='name' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>습도<br />(%)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='name' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>미세먼지(PM10)<br />(㎍/㎥)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='name' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>미세먼지(PM2.5)<br />(㎍/㎥</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='name' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>이산화탄소(CO2)<br />(ppm)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='name' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>포름알데히드(HCHO)<br />(ppm)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='name' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>휘발성유기화합물(VOCs)<br />(㎍/㎥)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='name' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='price' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

export default SamplePage;