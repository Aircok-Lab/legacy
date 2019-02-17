import React, {cloneElement, Component} from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import CardBox from 'components/CardBox/index';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const data = [
    [1, '', '', '', '', ''],
    [2, '', '', '', '', ''],
    [3, '', '', '', '', ''],
    [4, '', '', '', '', ''],
    [5, '', '', '', '', '']
];

class DevicePage extends React.Component {
    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    render() {
        return (
            <div className="app-wrapper">
                <ContainerHeader match={this.props.match} title='측정기 관리'/>
                
                <div className="row">
                    <div className="col-md-3">
                    
                        <List dense={false}>
                            <ListItem button>
                                <ListItemIcon>
                                    <FolderIcon/>
                                </ListItemIcon>
                                <ListItemText>대전오류사옥</ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <FolderIcon/>
                                </ListItemIcon>
                                <ListItemText>광천사옥</ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <FolderIcon/>
                                </ListItemIcon>
                                <ListItemText>강서사옥</ListItemText>
                            </ListItem>
                        </List>

                        <div style={{marginTop: '500px'}}>
                            <Button variant="raised" color="primary" className="jr-btn text-white" onClick={this.handleClickOpen}>건물 등록</Button>
                            <Button variant="raised" color="primary" className="jr-btn text-white">층 등록</Button>
                            <Button variant="raised" className="jr-btn bg-info text-white">수정</Button>
                        </div>

                    </div>
                    <div className="col-md-9">
                    
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
                                                    <TableCell>측정기명</TableCell>
                                                    <TableCell>측정주기</TableCell>
                                                    <TableCell>S/N</TableCell>
                                                    <TableCell>제품군</TableCell>
                                                    <TableCell>Phone번호</TableCell>
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
                                                            <TableCell>{n[4]}</TableCell>
                                                            <TableCell>{n[5]}</TableCell>
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

                <Dialog open={this.state.open} onClose={this.handleRequestClose}>
                    <DialogTitle>건물 등록</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            
                        </DialogContentText>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3" style={{lineHeight: '40px'}}>
                                    <label>건물명</label>
                                </div>
                                <div className="col-md-9">
                                    <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label=""
                                    type="email"
                                    fullWidth
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3" style={{lineHeight: '40px'}}>
                                    <label>주소</label>
                                </div>
                                <div className="col-md-9">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <TextField
                                            autoFocus
                                            margin="dense"
                                            id="name"
                                            label=""
                                            type="email"
                                            fullWidth
                                            />
                                        </div>
                                        <div className="col-md-4" style={{lineHeight: '40px'}}>
                                            <Button variant="raised" className="jr-btn jr-btn-xs bg-white text-black">좌표검색</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3" style={{lineHeight: '40px'}}>
                                    <label>위도</label>
                                </div>
                                <div className="col-md-9">
                                    <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label=""
                                    type="email"
                                    fullWidth
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3" style={{lineHeight: '40px'}}>
                                    <label>경도</label>
                                </div>
                                <div className="col-md-9">
                                    <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label=""
                                    type="email"
                                    fullWidth
                                    />
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="raised" color="primary" className="jr-btn text-white">OK</Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

export default DevicePage;