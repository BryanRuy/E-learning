import React from 'react';

import {
    CardBody,
    Card,
    CardText,
    Row,
    Col
} from 'reactstrap';


import { connect } from 'react-redux'
import Avatar from '@components/avatar'
import { withRouter } from 'react-router-dom';
import { GET_IMAGE_URL } from '../../helpers/url_helper';
import CardReload from '../../@core/components/card-reload';

const UserInfo = (props) => {

    const { user } = props;

    return (
        <>
            {
            Object.keys(user).length > 0 && (
                <CardReload
                title=''>
                    <CardBody>
                        <Row >
                            <Col>
                                <div className='user-avatar-section'>
                                    <div className='d-flex justify-content-start'>
                                        <Avatar
                                            imgHeight='70'
                                            imgWidth='70'
                                            img={GET_IMAGE_URL(user.profilePicture)}
                                        />
                                        <div className='d-flex flex-column ml-2 mt-1'>
                                            <div className='user-info mb-1'>
                                                <h4 className='mb-0'>{user.name}</h4>
                                                <CardText tag='span'>
                                                    {user.email}
                                                </CardText>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </CardReload>
            )
            }
        </>
    );
};

// const mapStateToProps = (state) => { 
// }

// const mapDispatchToProps = {
// }

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfo))


export default UserInfo
