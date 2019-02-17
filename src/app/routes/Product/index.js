import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import CardBox from 'components/CardBox/index';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const data = [
    [1, '에어콕 스마트 I', '2.1.0', '1분'],
    [2, '에어콕 스마트 O', '2.0.0', '1분']
];

class ProductPage extends React.Component {

    render() {
        return (
            <div className="app-wrapper">
                <ContainerHeader match={this.props.match} title='제품군 관리'/>
                
                <div className="row">
                    <div className="col-md-12">
                    
                        <div className="animated slideInUpTiny animation-duration-3">
                            <div className="row mb-md-4">
                                <CardBox styleName="col-12" cardStyle="p-0" heading="" headerOutside>

                                    <div className="row">
                                        <div className="col-md-4 offset-md-4">
                                            <h2 className="text-center">측정기 목록</h2>
                                        </div>
                                        <div className="col-md-4 text-right">
                                            <Button variant="raised" color="primary" className="jr-btn text-white">등록</Button>
                                            <Button variant="raised" className="jr-btn bg-info text-white">수정</Button>
                                            <Button variant="raised" className="jr-btn bg-danger text-white">삭제</Button>
                                        </div>
                                    </div>
                                    
                                    <div className="table-responsive-material">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{paddingRight: '24px', width: '30px'}}>
                                                        <Checkbox color="primary"
                                                            checked=""
                                                            // onChange=""
                                                            value=""
                                                        />
                                                    </TableCell>
                                                    <TableCell>번호</TableCell>
                                                    <TableCell>제품군 명</TableCell>
                                                    <TableCell>펌웨어 버전</TableCell>
                                                    <TableCell>측정 주기</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.map(n => {
                                                    return (
                                                        <TableRow key={n[0]}>
                                                            <TableCell style={{paddingRight: '24px', width: '30px'}}>
                                                                <Checkbox color="primary"
                                                                    checked=""
                                                                    // onChange=""
                                                                    value=""
                                                                />
                                                            </TableCell>
                                                            <TableCell>{n[0]}</TableCell>
                                                            <TableCell>{n[1]}</TableCell>
                                                            <TableCell>{n[2]}</TableCell>
                                                            <TableCell>{n[3]}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>

                                </CardBox>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default ProductPage;