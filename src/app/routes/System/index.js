import React, {cloneElement, Component} from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderIcon from '@material-ui/icons/Folder';
import Grid from '@material-ui/core/Grid';

function generate(element) {
    return [0, 1, 2].map(value =>
      cloneElement(element, {
        key: value,
      }),
    );
}

class SystemPage extends React.Component {
    state = {
        dense: false,
        secondary: false
    };

    render() {
        const {
            dense,
            secondary
        } = this.state;
        return (
            <div className="app-wrapper">
                <ContainerHeader match={this.props.match} title='시스템 관리'/>
                
                <div className="row">
                    <div className="col-md-12">
                        <h2>1. 설정</h2>

                        <div className="row">
                            <div className="col-md-12">
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <h3 className="text-gray lighten-2 my-3">
                                        Text only
                                        </h3>
                                        <div className="jr-card p-0 m-1">
                                        <List dense={dense}>
                                            {generate(
                                            <ListItem button>
                                                <ListItemText
                                                primary="Single-line item"
                                                secondary={secondary ? 'Secondary text' : null}
                                                />
                                            </ListItem>,
                                            )}
                                        </List>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <h3 className="text-gray lighten-2 my-3">
                                        Icon with text
                                        </h3>
                                        <div className="jr-card p-0 m-1">
                                        <List dense={dense}>
                                            {generate(
                                            <ListItem button>
                                                <ListItemIcon>
                                                <FolderIcon/>
                                                </ListItemIcon>
                                                <ListItemText
                                                primary="Single-line item"
                                                secondary={secondary ? 'Secondary text' : null}
                                                />
                                            </ListItem>,
                                            )}
                                        </List>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <h2>2. 센서 기준 설정</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default SystemPage;