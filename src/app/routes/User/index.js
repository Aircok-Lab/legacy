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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

const data = [
    [1, '', '', '', '', '', '', ''],
    [2, '', '', '', '', '', '', ''],
    [3, '', '', '', '', '', '', ''],
    [4, '', '', '', '', '', '', ''],
    [5, '', '', '', '', '', '', ''],
    [6, '', '', '', '', '', '', ''],
    [7, '', '', '', '', '', '', '']
];

const userStates = [
    {
      value: 0,
      label: '상태'
    },
    {
      value: 1,
      label: '승인요청중'
    },
    {
      value: 2,
      label: '승인완료'
    }
];

class UserPage extends React.Component {
    state = {
        open: false,
        userState: 0
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    render() {
        const {
            userState
        } = this.state;
        return (
            <div className="app-wrapper">
                <ContainerHeader match={this.props.match} title='사용자 관리'/>
                
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

                    </div>
                    <div className="col-md-9">
                    
                        <div className="animated slideInUpTiny animation-duration-3">
                            <div className="row mb-md-4">
                                <CardBox styleName="col-12" cardStyle="p-0" heading="" headerOutside>

                                    <div className="row">
                                        <div className="col-md-2">
                                            <FormControl className="w-100">
                                                <Select
                                                    value={userState}
                                                    onChange={(event) => this.setState({userState: event.target.value})}
                                                    input={<Input id="userState"/>}
                                                >
                                                    {userStates.map(userState => (
                                                    <MenuItem
                                                        key={userState.value}
                                                        value={userState.value}
                                                    >
                                                        {userState.label}
                                                    </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="col-md-4 offset-md-2">
                                            <h2 className="text-center">사용자 목록</h2>
                                        </div>
                                        <div className="col-md-4 text-right">
                                            <Button variant="raised" className="jr-btn bg-success text-white">승인</Button>
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
                                                    <TableCell>구분</TableCell>
                                                    <TableCell>아이디</TableCell>
                                                    <TableCell>이름</TableCell>
                                                    <TableCell>이메일</TableCell>
                                                    <TableCell>소속(부서)</TableCell>
                                                    <TableCell>전화번호</TableCell>
                                                    <TableCell>상태</TableCell>
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
                                                            <TableCell>{n[6]}</TableCell>
                                                            <TableCell>{n[7]}</TableCell>
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

export default UserPage;