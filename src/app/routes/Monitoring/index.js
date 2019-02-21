import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';

class SamplePage extends React.Component {

    render() {
        return (
            <div className="app-wrapper">
                <table className="table table-bordered text-center">
                    <thead className="text-white bg-lightgreen">
                    <tr>
                        <th className="bg-darkgreen align-middle">구분</th>
                        <th className="bg-darkgreen align-middle">측정기명</th>
                        <th className="bg-darkgreen align-middle"> 공기질관리지수</th>
                        <th className="bg-darkgreen align-middle"> 온도</br>(℃)</th>
                        <th className="bg-darkgreen align-middle"> 습도</br>(%)</th>
                        <th className="bg-darkgreen align-middle"> 공기질관리지수</th>
                        <th className="bg-darkgreen align-middle"> 공기질관리지수</th>
                        <th className="bg-darkgreen align-middle"> 공기질관리지수</th>
                        {/* <th className="darkgreen">
                            <tr>
                                <p>온도</p>
                                <p>(℃)</p>
                            </tr>
                            <tr>
                                <td>기준</td>
                                <td>현재</td>
                                <td>알람</td>
                            </tr>
                        </th>
                        <th className="col-sm-1">
                            <tr>
                                <p>습도</p>
                                <p>(%)</p>
                            </tr>
                            <tr>
                                <td>기준</td>
                                <td>현재</td>
                                <td>알람</td>
                            </tr>
                        </th>
                        <th className="col-sm-1">
                            <tr>
                                <p>미세먼지(PM10)</p>
                                <p>(㎍/㎥)</p>
                            </tr>
                            <tr>
                                <td>기준</td>
                                <td>현재</td>
                                <td>알람</td>
                            </tr>
                        </th>
                        <th className="col-sm-1">
                            <tr>
                                <p>초미세먼지(PM2.5)</p>
                                <p>(㎍/㎥)</p>
                            </tr>
                            <tr>
                                <td>기준</td>
                                <td>현재</td>
                                <td>알람</td>
                            </tr>
                        </th>
                        <th className="col-sm-1">
                            <tr>
                                <p>이산화탄소(CO2)</p>
                                <p>(ppm)</p>
                            </tr>
                            <tr>
                                <td>기준</td>
                                <td>현재</td>
                                <td>알람</td>
                            </tr>
                        </th>
                        <th className="col-sm-1">
                            <tr>
                                <p>포름알데히드(HCHO)</p>
                                <p>(ppm)</p>
                            </tr>
                            <tr>
                                <td>기준</td>
                                <td>현재</td>
                                <td>알람</td>
                            </tr>
                        </th>
                        <th className="col-sm-1">
                            <tr>
                                <p>휘발성유기화합물(VOCs)</p>
                                <p>(㎍/㎥)</p>
                            </tr>
                            <tr>
                                <td>기준</td>
                                <td>현재</td>
                                <td>알람</td>
                            </tr>
                        </th> */}
                    </tr>
                    </thead>
                    <tbody>
                    {/* <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>john@example.com</td>
                    </tr>
                    <tr>
                        <td>Mary</td>
                        <td>Moe</td>
                        <td>mary@example.com</td>
                    </tr>
                    <tr>
                        <td>July</td>
                        <td>Dooley</td>
                        <td>july@example.com</td>
                    </tr> */}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default SamplePage;