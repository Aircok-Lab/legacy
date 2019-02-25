import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';

const products = [];
var index = 0;

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
    constructor(props) {
        super(props);
        this.pageScroll = this.pageScroll.bind(this);
    }

    componentDidMount(){
      this.intervalHandle = setInterval(this.pageScroll, 1000 * 10);
    }

    componentWillUnmount(){
      clearInterval(this.intervalHandle);
    }

    pageScroll() { 
      var objDiv =  document.getElementById('contain');

      objDiv.scrollTop = objDiv.scrollTop + 100;  
      if (objDiv.scrollTop == (objDiv.scrollHeight - 200)) {
        objDiv.scrollTop = 0;
      }
    }

    render() {
        
        return (
            <div className="app-wrapper" warnings={false}>
            <table className="table table-fixed">
              <thead>
                <tr>
                  <th className="col-3">First Name</th>
                  <th className="col-3">Last Name</th>
                  <th className="col-6">E-mail</th>
                </tr>
              </thead>
              <tbody  id="contain" ref="contain">
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
          
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
                <tr>
                  <td className="col-3">John</td>
                  <td className="col-3">Doe</td>
                  <td className="col-6">johndoe@email.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
    }
}

export default SamplePage;