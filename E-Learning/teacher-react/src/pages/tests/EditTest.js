import React from 'react';
import { useEffect } from 'react';
import {
	Card, CardBody, CardTitle, Row, Col, Container, Button
} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Swal from 'sweetalert2';
import Questions from "../testQuestions/Questions"
import { ArrowLeft, Eye } from 'react-feather'
import { useState } from 'react'
import { putTest } from '@store/actions'
import '../../assets/scss/custom/components/_question.scss'

import UILoader from '../../@core/components/ui-loader';
import { errorAlertDialog, successAlertDialog } from '../../helpers/HelperFunctions';
import { useTranslation } from 'react-i18next';
const EditTest = (props) => {

	const { t } = useTranslation()
	const loading = false;
	const { onChangeView, updateTestLoading, updateTestError, updateTestSuccess } = props
	const [test, setTest] = useState(props.test)
	const updateQuestions = (index, deleteCount, newItem = undefined) => {

		let updatedQuestionArray = test.questions;
		if (newItem) {
			updatedQuestionArray.splice(index + 1, deleteCount, newItem)
		}
		else {
			updatedQuestionArray.splice(index, deleteCount)
		}

		setTest({
			...test,
			questions: updatedQuestionArray,
			totalMarks: updatedQuestionArray.reduce((acc, q) => acc + Number(q.marks), 0)
		})
	}

	const onFileChanged = (file, index) => {

		setTest(t => {
			file ? t.questions[index].file = file
				: delete t.questions[index].file;
			let test = {
				...t,
				questions: [...t.questions]
			}
			return test
		})
	}

	const handleValidSubmit = (events, values) => {

		const fd = new FormData();

		test.questions.forEach((q, i) => {
			if (q.file) fd.append(`question-file-${i}`, q.file, q.file.name);
			delete q.file
		})

		fd.append('test', JSON.stringify(test));
		props.putTest(fd);
	}

	const onTitleChange = (e) => {
		setTest({ ...test, title: e.target.value })
	}

	const onTimeLimitChange = (e) => {
		setTest({ ...test, timeLimit: e.target.value * 60 })
	}


	const defaultValues = {
		'option-radio': 0
	}

	useEffect(() => {
		if (updateTestError) errorAlertDialog(updateTestError, 'error');
		if (updateTestSuccess) successAlertDialog(t('Test has been updated successfully'), 'success');
	}, [updateTestError, updateTestSuccess]);


	return (
		<UILoader blocking={updateTestLoading}>
			<React.Fragment>
				{!loading && (
					<>
						<Row className="mb-2">
							<Col md="6">
								<Button.Ripple className="btn-icon" size="sm" onClick={() => props.history.goBack()}><ArrowLeft size={16} /></Button.Ripple>
								<h3 className='ml-2 d-inline m-0'>{t('Edit Test')}</h3>
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
											model={defaultValues}
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
															value={test.title}
															onChange={onTitleChange}
															className='form-control'
															placeholder={'Enter test title'}
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
															value={`${test.timeLimit / 60}`}
															onChange={onTimeLimitChange}
															className='form-control'
															placeholder={
																t('Time limit in Minutes')
															}
															type='number'
															min={10}
															required
														/>
													</div>
												</Col>
												<Col lg={4}>
													<div className='mb-3'>
														<AvField
															name='totalMarks'
															label={t('Total Marks *')}
															value={`${test.totalMarks}`}
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
															questions={test.questions}
															onChangeQuestion={updateQuestions}
															onFileChanged={onFileChanged}
															isEdit={true}
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
															{t('Edit Test')}
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
	const { updateTest, updateTestLoading, updateTestError, updateTestSuccess } = state.Tests
	return { updateTest, updateTestLoading, updateTestError, updateTestSuccess }

}

const mapDispatchToProps = {
	putTest,
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(EditTest)
)

