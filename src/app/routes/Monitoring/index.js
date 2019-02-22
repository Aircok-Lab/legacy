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
        id: id,
        buildingName: 'ethree', //add
        positionName:'3층', //add
        DeviceSN: "356170062277836",
        Date: "2019-02-18T06:44:00.000Z",
        PM10: 21,
        PM25: 15,
        CO2: 819,
        HCHO: 0,
        VOC: 8,
        Temperature: 25.7,
        Humidity: 11.2,
        Noise: null,
        E3Score: 41,
        E3Index: 3,
        PM10Index: 1,
        PM25Index: 1,
        CO2Index: 3,
        HCHOIndex: 1,
        VOCIndex: 1,
        TemperatureIndex: 6,
        HumidityIndex: 6,
        NoiseIndex: null,
        PM10Alarm: 0,
        PM25Alarm: 0,
        CO2Alarm: 0,
        HCHOAlarm: 0,
        VOCAlarm: 0,
        TemperatureAlarm: 0,
        HumidityAlarm: 1,
        NoiseAlarm: 0,
        InsertDate: "2019-02-18T06:44:44.000Z",
        pm10: '150',
        pm25: '70',
        co2: '1000',
        hcho: '100',
        voc: '500',
        temperature: '26',
        humidity: '40'
        });
    }
}

addProducts(50);

function headerColumnClassNameFormat(row) {
    return row === 0 ? 'table-header-row0-class' : 'table-header-row1-class';
  }

class SamplePage extends React.Component {
    render() {
        return (
            <div className="app-wrapper" style={{overflowy: 'hidden'}}>
                <BootstrapTable data={ products} bodyContainerClass='my-custom-class' height='500px' scrollTop={ 'Bottom' }> 
                    {/* <TableHeaderColumn row='0' rowSpan='2' dataField='building' isKey={ true } filterFormatted formatExtraData={ qualityType }
          filter={ { type: 'SelectFilter', options: qualityType } }>구분</TableHeaderColumn> */}
                    <TableHeaderColumn row='0' rowSpan='2' dataField='buildingName' isKey={ true } className={ headerColumnClassNameFormat(0) }>구분</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField='positionName' className={ headerColumnClassNameFormat(0) }>측정기명</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField='E3Score' className={ headerColumnClassNameFormat(0) }>공기질관리지수</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>온도<br />(℃)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='temperature' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='Temperature' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='TemperatureAlarm' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>습도<br />(%)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='humidity' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='Humidity' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='HumidityAlarm' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>미세먼지(PM10)<br />(㎍/㎥)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='pm10' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='PM10' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='PM10Alarm' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>미세먼지(PM2.5)<br />(㎍/㎥</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='pm25' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='PM25' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='PM25Alarm' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>이산화탄소(CO2)<br />(ppm)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='co2' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='CO2' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='CO2Alarm' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>포름알데히드(HCHO)<br />(ppm)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='hcho' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='HCHO' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='HCHOAlarm' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='3' headerAlign='center' className={ headerColumnClassNameFormat(0) }>휘발성유기화합물(VOCs)<br />(㎍/㎥)</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='voc' className={ headerColumnClassNameFormat(1) }>기준</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='VOC' className={ headerColumnClassNameFormat(1) }>현재</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='VOCAlarm' className={ headerColumnClassNameFormat(1) }>알람</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}

export default SamplePage;