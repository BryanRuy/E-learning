import React from 'react';
import { useState, useEffect } from 'react';
import {
	Card, CardBody, CardTitle, Row, Col, Container, Button, CardHeader, FormGroup,
	CustomInput,
	Label,
} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { postAssignment, postAssignmentFailure } from '@store/actions'
import { ArrowLeft } from 'react-feather'
import { EditorState } from 'draft-js'
import { Editor, } from 'react-draft-wysiwyg';
import UILoader from '../../@core/components/ui-loader';
import { errorAlertDialog, successAlertDialog } from '../../helpers/HelperFunctions';
import { stateToMarkdown } from "draft-js-export-markdown";

import '../../assets/scss/custom/components/_card.scss'
import '../../assets/scss/custom/components/_question.scss'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import '@styles/react/libs/editor/editor.scss'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useTranslation } from 'react-i18next';
const NewAssignment = (props) => {

	const { t } = useTranslation()
	const { newAssignmentLoading, newAssignmentError, newAssignmentSuccess } = props
	const loading = false;
	const [editorVal, setEditorVal] = useState(EditorState.createEmpty())

	const [newAssignment, setNewAssignment] = useState({
		"title": "",
		"totalMarks": 0,
		"content": "",
		"type": "coding"
	});

	const handleValidSubmit = (events, values) => {
		let content = stateToMarkdown(editorVal.getCurrentContent())
		let assignment = { ...newAssignment, content: content }
		props.postAssignment(assignment);
		// setNewAssignment(newAssignment => {
		// 	let assignment = { ...newAssignment, content: content }
		// 	props.postAssignment(assignment);
		// 	return assignment
		// })
	}


	useEffect(() => {
		if (newAssignmentError) errorAlertDialog(newAssignmentError);
		if (newAssignmentSuccess) successAlertDialog(t('Assignment has been created successfully'), () => goToAssignmentDashboard());
	}, [newAssignmentError, newAssignmentSuccess]);

	const goToAssignmentDashboard = () => {
		props.postAssignmentFailure(null)
		props.history.push({
			pathname: `/assignment-dashboard/${props.newAssignment.assignmentId}`,
			state: { assignment: props.newAssignment }
		})
	}

	const onTitleChange = e => {
		setNewAssignment({ ...newAssignment, title: e.target.value })
	}

	const onContentChange = v => {
		setEditorVal(v)
	}

	const onMarksChange = e => {
		setNewAssignment({ ...newAssignment, totalMarks: e.target.value })
	}

	const changeAssignmentType = e => {
		setNewAssignment({ ...newAssignment, type: e.target.value })
	}


	return (
		<UILoader blocking={newAssignmentLoading}>
			<React.Fragment>
				{!loading && (
					<div className='page-content'>
						<Container fluid>
							<Row>
								<Col lg={12}>
									<Card>
										<CardHeader>
											<CardTitle><Button.Ripple className="btn-icon mr-2" size="sm" onClick={() => props.history.goBack()}><ArrowLeft size={16} /></Button.Ripple>{t('Create a New Assignment')}</CardTitle>
										</CardHeader>
										<CardBody>
											<AvForm
												className='form-horizontal mt-3'
												onValidSubmit={(e, v) => {
													handleValidSubmit(e, v);
												}}
											>
												<Row>
													<Col md={4}>
														<div className='mb-3'>
															<AvField
																name='title'
																label={`${t('Assignment Title')} *`}
																value={newAssignment.title}
																onChange={onTitleChange}
																className='form-control'
																placeholder={t('Enter Assignment title')}
																type='text'
																required
															/>
														</div>
													</Col>
													<Col md={4}>
														<div className='mb-3'>
															<AvField
																name='totalMarks'
																label={t('Total Marks *')}
																onChange={onMarksChange}
																value={`${newAssignment.totalMarks}`}
																className='form-control'
																placeholder={
																	t('Total Marks')
																}
																type='number'
															/>
														</div>
													</Col>
													<Col md={4}>
														<FormGroup>
															<Label for='select-custom'>{t('Assignment Type')}</Label>
															<CustomInput type='select' name='select' id='select-custom' onChange={changeAssignmentType}>
																<option value="coding">Coding</option>
																<option value="theoretical">Theoretical</option>
															</CustomInput>
														</FormGroup>
													</Col>

												</Row>


												<Label tag='h4'>{t('Assignment Content')}</Label>
												<Editor
													editorState={editorVal}
													onEditorStateChange={onContentChange}
													wrapperClassName="wrapper-class"
													editorClassName="editor-class"
													toolbarClassName="toolbar-class" />

												<Col lg={12}>
													<div className='mt-3'>
														<button
															className='btn btn-primary waves-effect waves-light'
															type='submit'>
															{/* disabled={props.newTestLoading}> */}
															{newAssignmentLoading && <><i className="fa fa-spinner fa-spin" />&nbsp;&nbsp;</>}
															{t('Create Assignment')}
														</button>
													</div>
												</Col>

											</AvForm>
										</CardBody>
									</Card>
								</Col>
							</Row>
						</Container>
					</div>
				)}
			</React.Fragment>
		</UILoader>
	);
};

const mapStateToProps = (state) => {
	const {
		newAssignment,
		newAssignmentLoading,
		newAssignmentSuccess,
		newAssignmentError,
	} = state.Assignments;

	return {
		newAssignment,
		newAssignmentLoading,
		newAssignmentSuccess,
		newAssignmentError,
	}
}

const mapDispatchToProps = {
	postAssignment,
	postAssignmentFailure
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(NewAssignment)
)

