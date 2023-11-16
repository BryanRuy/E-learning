import React from 'react';

import {
    CardBody,
    Card,
    CardText,
    Row,
    Col
} from 'reactstrap';


import { connect } from 'react-redux'
import { useEffect } from 'react';
import Avatar from '@components/avatar'
import { getStudentById } from '@store/actions';
import { getProfileImageUrl } from '../../helpers/url_helper'
import { withRouter } from 'react-router-dom';

const StudentProfile = (props) => {

    const { studentId } = props;
    const { studentProfile } = props;

    const getStudentProfile = () => {
        props.getStudentById(studentId)
    }

    useEffect(getStudentProfile, []);

    return (
        <>
            {Object.keys(studentProfile).length > 0 && (
                <Card>
                    <CardBody>
                        <Row >
                            <Col>
                                <div className='user-avatar-section'>
                                    <div className='d-flex justify-content-start'>
                                        <Avatar
                                            imgHeight='70'
                                            imgWidth='70'
                                            img={getProfileImageUrl(studentProfile.user.profilePicture)}
                                        />
                                        <div className='d-flex flex-column ml-2 mt-1'>
                                            <div className='user-info mb-1'>
                                                <h4 className='mb-0'>{studentProfile.user.name}</h4>
                                                <CardText tag='span'>
                                                    {studentProfile.user.email}
                                                </CardText>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            )}
        </>
    );
};

const mapStateToProps = (state) => {
    const { studentProfile, studentTestsLoading, studentTestsError } = state.Students;
    return { studentProfile, studentTestsLoading, studentTestsError };
}

const mapDispatchToProps = {
    getStudentById
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentProfile))


