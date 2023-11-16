import React from 'react';
import { useState, useEffect } from 'react';
import {
	Card, CardBody, CardTitle, Row, Col, Container, Button, CardHeader
} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Questions from "../testQuestions/Questions"
import { postTest ,postTestFailure} from '@store/actions'
import { ArrowLeft } from 'react-feather'
import '../../assets/scss/custom/components/_question.scss'

import '../../assets/scss/custom/components/_card.scss'
import UILoader from '../../@core/components/ui-loader';
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
import { errorAlertDialog, successAlertDialog } from '../../helpers/HelperFunctions';
import { useTranslation } from 'react-i18next';
const NewTest = (props) => {

	const {t} = useTranslation()
	const { newTestLoading, newTestError , newTestSuccess} = props
	const loading = false;

	const [newTest, setNewTest] = useState({
		"title": "",
		"totalMarks": 0,
		"timeLimit": 60,
		questions: []
	});

	const updateQuestions = (index, deleteCount, newItem = undefined) => {

		let updatedQuestionArray = newTest.questions;
		if (newItem) {
			updatedQuestionArray.splice(index + 1, deleteCount, newItem)
		}
		else {
			updatedQuestionArray.splice(index, deleteCount)
		}

		setNewTest({
			...newTest,
			questions: updatedQuestionArray,
			totalMarks: updatedQuestionArray.reduce((acc, q) => acc + Number(q.marks), 0)
		})
	}

	const onFileChanged = (file, index) => {

		setNewTest(newTest => {
			file ? newTest.questions[index].file = file
				: delete newTest.questions[index].file;
			let test = {
				...newTest,
				questions: [...newTest.questions]
			}
			return test
		})
	}

	const handleValidSubmit = (events, values) => {
		// Converting minutes to seconds
		let timeLimit = newTest.timeLimit * 60;
		let completeTest = { ...newTest, timeLimit };

		const fd = new FormData();

		completeTest.questions.forEach((q, i) => {
			if (q.file) fd.append(`question-file-${i}`, q.file, q.file.name);
			delete q.file
		})

		fd.append('test', JSON.stringify(completeTest));

		props.postTest(fd);
	}

	useEffect(() => {
		if (newTestError) errorAlertDialog(newTestError);
		if (newTestSuccess) {
			successAlertDialog(t('Test has been created successfully'), ()=>goToTestDashboard());
		}
	}, [props.newTestError, props.newTestSuccess]);

	const goToTestDashboard = () =>{
		props.postTestFailure(null)
		props.history.push({
			pathname: `/test-dashboard/${props.newTest.testId}`,
            state: { test:  props.newTest }
        })
	}

	


	const onTitleChange = (e) => {
		setNewTest({ ...newTest, title: e.target.value })
	}

	const onTimeLimitChange = (e) => {
		setNewTest({ ...newTest, timeLimit: e.target.value })
	}


	return (
		<UILoader blocking={newTestLoading}>
			<React.Fragment>
				{!loading && (
					<div className='page-content'>
						<Container fluid>
							<Row>
								<Col lg={12}>
									<Card>
										<CardHeader>
											<CardTitle><Button.Ripple className="btn-icon mr-2" size="sm" onClick={() => props.history.goBack()}><ArrowLeft size={16} /></Button.Ripple>{t('Create a New Test')}</CardTitle>
										</CardHeader>
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
																label={t('Test Title *')}
																value={newTest.title}
																onChange={onTitleChange}
																className='form-control'
																placeholder={t('Enter test title')}
																type='text'
																required
															/>
														</div>
													</Col>

													<Col lg={4}>
														<div className='mb-3'>
															<AvField
																name='timeLimit'
																label={t('Time Limit *')}
																value={newTest.timeLimit}
																onChange={onTimeLimitChange}
																className='form-control'
																placeholder={
																	t('Time limit in Minutes')
																}
																type='number'
																min={10}
																max={600}
																required
															/>
														</div>
													</Col>
													<Col lg={4}>
														<div className='mb-3'>
															<AvField
																name='totalMarks'
																label={t('Total Marks *')}
																value={`${newTest.totalMarks}`}
																className='form-control'
																placeholder={
																	t('Total Marks')
																}
																type='number'
																disabled
															/>
														</div>
													</Col>

													<>
														{
															<Questions
																questions={newTest.questions}
																onChangeQuestion={updateQuestions}
																onFileChanged={onFileChanged}
															/>
														}
													</>

													<Col lg={12}>
														<div className='mt-3'>
															<button
																className='btn btn-primary waves-effect waves-light'
																type='submit'>
																{/* disabled={props.newTestLoading}> */}
																{props.newTestLoading && <><i className="fa fa-spinner fa-spin" />&nbsp;&nbsp;</>}
																{t('Create Test')}
															</button>
														</div>
													</Col>
												</Row>
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
		newTest,
		newTestLoading,
		newTestSuccess,
		newTestError,
	} = state.Tests;

	return {
		newTest,
		newTestLoading,
		newTestSuccess,
		newTestError,
	}
}

const mapDispatchToProps = {
	postTest,postTestFailure
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(NewTest)
)

