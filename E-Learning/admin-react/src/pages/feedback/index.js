import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Col,
    Input,
    Form,
    Button,
    CustomInput,
    Label
} from 'reactstrap'
import React from 'react'

const Feedback = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle tag='h4'>Feedback</CardTitle>
            </CardHeader>

            <CardBody>
                <Form>
                    <FormGroup row>
                        <Label sm='3' for='name'>
                            Name
                        </Label>
                        <Col sm='9'>
                            <Input type='text' name='name' id='name' placeholder=' Name' />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm='3' for='Email'>
                            Email
                        </Label>
                        <Col sm='9'>
                            <Input type='email' name='Email' id='Email' placeholder='Email' />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm='3' for='mobile'>
                            Reviews
                        </Label>
                        <Col sm='9'>
                            <Input type='text' name='review' id='review' placeholder='Review' />
                        </Col>
                    </FormGroup>



                    <FormGroup className='mb-0' row>
                        <Col className='d-flex' md={{ size: 9, offset: 3 }}>
                            <Button.Ripple className='mr-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
                                Submit
                            </Button.Ripple>
                        </Col>
                    </FormGroup>
                </Form>
            </CardBody>
        </Card>
    )
}
export default Feedback
