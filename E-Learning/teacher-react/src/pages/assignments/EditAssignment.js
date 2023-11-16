import React from 'react';
import { useEffect } from 'react';
import {
    Card, CardBody, Row, Col, Button,
    FormGroup, Label, CustomInput} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { ArrowLeft, Eye } from 'react-feather'
import { useState } from 'react'
import { putAssignment } from '@store/actions'
import UILoader from '../../@core/components/ui-loader';
import { errorAlertDialog, successAlertDialog } from '../../helpers/HelperFunctions';

import { stateToMarkdown } from "draft-js-export-markdown";
import '../../assets/scss/custom/components/_question.scss'
import { useTranslation } from 'react-i18next';

const EditAssignment = (props) => {

    const {t} = useTranslation()
    const loading = false;
    const { onChangeView,
        updateAssignmentLoading,
        updateAssignmentError,
        updateAssignmentSuccess } = props

    const [assignment, setAssignment] = useState(props.assignment)
    const [editorVal, setEditorVal] = useState()

    const handleValidSubmit = (events, values) => {

        let content = stateToMarkdown(editorVal.getCurrentContent())
        setAssignment(Assignment => {
            let assignment = { ...Assignment, content: content }
            return assignment
        })
        props.putAssignment(assignment);
    }

    const onTitleChange = (e) => {
        setAssignment({ ...setAssignment, title: e.target.value })
    }


    const onContentChange = v => {
        setEditorVal(v)
    }

    const changeAssignmentType = e => {
        setAssignment({ ...assignment, type: e.target.value })
    }


    useEffect(() => {
        if (updateAssignmentError) errorAlertDialog(updateAssignmentError, 'error');
        if (updateAssignmentSuccess) successAlertDialog(t('Assignment has been updated successfully'), 'success');
    }, [updateAssignmentError, updateAssignmentSuccess]);


    return (
        <UILoader blocking={updateAssignmentLoading}>
            <React.Fragment>
                {!loading && (
                    <>
                        <Row className="mb-2">
                            <Col md="6">
                                <Button.Ripple className="btn-icon" size="sm" onClick={() => props.history.goBack()}><ArrowLeft size={16} /></Button.Ripple>
                                <h3 className='ml-2 d-inline m-0'>{t('Edit Assignment')}</h3>
                            </Col>
                            <Col className="text-right" md="6">
                                <Button.Ripple color='primary' onClick={onChangeView} >
                                    <Eye size={14} />
                                    <span className='align-middle ml-25'>{t('View')}</span>
                                </Button.Ripple>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <AvForm
                                            className='form-horizontal mt-3'
                                            onValidSubmit={(e, v) => {
                                                handleValidSubmit(e, v);
                                            }}
                                        >
                                            <Row>
                                                <Col lg={4}>
                                                    <div className='mb-3'>
                                                        <AvField
                                                            name='title'
                                                            label={`${t('Assignment Title')} *`}
                                                            value={assignment.title}
                                                            onChange={onTitleChange}
                                                            className='form-control'
                                                            placeholder={t('Enter assignment title')}
                                                            type='text'
                                                            required
                                                        />
                                                    </div>
                                                </Col>

                                                <Col lg={4}>
                                                    <div className='mb-3'>
                                                        <AvField
                                                            name='totalMarks'
                                                            label={t('Total Marks *')}
                                                            value={`${assignment.totalMarks}`}
                                                            className='form-control'
                                                            placeholder={
                                                                t('Total Marks')
                                                            }
                                                            type='number'
                                                            disabled
                                                        />
                                                    </div>
                                                </Col>

                                                <Col lg={4}>
                                                    <div className='mb-3'>

                                                        <FormGroup>
                                                            <Label for='select-custom'>{t('Assignment Type')}</Label>
                                                            <CustomInput type='select' value={assignment.type} name='select' id='select-custom' onChange={changeAssignmentType}>
                                                                <option>coding</option>
                                                                <option>theoretical</option>
                                                            </CustomInput>
                                                        </FormGroup>
                                                    </div>
                                                </Col>

                                                {/* <Card>
                                                    <CardHeader>
                                                        <CardTitle tag='h4'>Assignment Content</CardTitle>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Editor editorState={editorVal} onEditorStateChange={onContentChange} />
                                                    </CardBody>
                                                </Card> */}



                                                <Col lg={12}>
                                                    <div className='mt-3'>
                                                        <button
                                                            className='btn btn-primary waves-effect waves-light'
                                                            type='submit'>
                                                            {updateAssignmentLoading && <><i className="fa fa-spinner fa-spin" />&nbsp;&nbsp;</>}
                                                            {t('Edit Assignment')}
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </AvForm>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </React.Fragment>
        </UILoader>
    );
};

const mapStateToProps = (state) => {
    const { updateAssignment, updateAssignmentLoading, updateAssignmentError, updateAssignmentSuccess } = state.Assignments
    return { updateAssignment, updateAssignmentLoading, updateAssignmentError, updateAssignmentSuccess }

}

const mapDispatchToProps = {
    putAssignment,
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(EditAssignment)
)

