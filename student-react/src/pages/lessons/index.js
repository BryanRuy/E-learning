import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import {
    Card, CardBody, Row, Col,
    Collapse,
    Navbar,
    Button,
    CardTitle,
    CardHeader, Badge
} from 'reactstrap'
import { useTranslation } from 'react-i18next';
// ** Store & Actions
import { connect } from 'react-redux'
import { getUserTopics, getUserTopicLessons, selectTopic, selectLesson, getLesson, completedLesson } from './store/actions'
import { withRouter } from 'react-router';
import { GET_BLOG_IMAGE_URL } from '../../helpers/url_helper'
import './style.scss'
import ReactMarkdown from 'react-markdown'
import { render } from 'react-dom'
import { PlayCircle, Menu, X, ChevronUp, ChevronDown } from 'react-feather'
import UILoader from '../../@core/components/ui-loader';
import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import { BLOG_API_URL } from '../../helpers/url_helper'

const AppLessons = (props) => {

    const {t} = useTranslation()
    const lessonRef = React.createRef()
    const lessonContentRef = React.createRef()
    const [isFullScreen, setFullScreen] = useState(false)
    const [isOpen, setIsOpen] = useState(false);

    const [isOpenLessons, setIsOpenLessons] = useState(false);

    const toggleLessons = () => setIsOpenLessons(!isOpenLessons);

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        props.getUserTopics()
    }, [])

    useEffect(() => {
        if (Object.keys(props.selectedTopic).length > 0) {
            props.getUserTopicLessons(props.selectedTopic.id)
            setIsOpenLessons(false)
        }
    }, [props.selectedTopic])

    useEffect(() => {
        setIsOpenLessons(false)
        if (props.selectedLesson) {
            let lesson = props.lessons.find(l => l.id == props.selectedLesson)
            if (lesson && !lesson.isFull) {
                props.getLesson(props.selectedLesson)
            }
        }

    }, [props.selectedLesson])

    useEffect(() => {
        if (props.topics.length > 0 && Object.keys(props.selectedTopic).length == 0) {
            props.selectTopic(props.topics[0])
        }
    }, [props.topics])

    useEffect(() => {
        if (props.lessons.length > 0 && !props.selectedLesson) {
            props.selectLesson(props.lessons[0].id)
        } else if (props.lessons.length > 0 && props.selectedLesson) {
            props.getLesson(props.selectedLesson)
        }

    }, [props.lessons])

    const renderLesson = (content) => {
        if (content) {
            let uploadPath = `${BLOG_API_URL}/uploads/`;
            let markdown = String(content).replaceAll("/uploads/", uploadPath);
            let fun = () => {
                if (lessonContentRef.current) {
                    render(<ReactMarkdown>{markdown}</ReactMarkdown>, lessonContentRef.current)
                    window.scrollTo(0, 0)
                    lessonRef.current.scrollTo(0, 0)
                } else {
                    setTimeout(fun, 100)
                }
            }
            setTimeout(fun, 200)
        }
    }


    const activeLesson = () => {
        let lesson = props.lessons.find(l => l.id == props.selectedLesson)
        if (!lesson) return
        return <UILoader blocking={props.lessonsLoading || props.oneLessonLoading}>
            {
                Object.keys(props.selectedTopic).length > 0 &&
                <Card
                    className={`active-lesson-container ${isOpenLessons ? 'hide' : ''} ${isFullScreen ? 'active' : ''}`}
                >
                    <CardHeader>
                        <CardTitle>{lesson.title}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {
                            props.lessons.length == 0 &&
                            Object.keys(props.selectedTopic).length > 0 &&
                            !props.lessonsLoading &&
                            !props.lessonsError &&
                            <NotFound />
                        }
                        {
                            !props.lessonsLoading &&
                            props.lessonsError &&
                            <div className="pt-5 pb-5 mt-5 mb-5  text-center">
                                {props.lessonsError}
                            </div>
                        }
                        <div
                            ref={lessonRef}
                            className="active-lesson"
                        >
                            {
                                lesson.videoUrl &&
                                <div className="lesson-video mt-2 mb-2">
                                    <iframe
                                        src={lesson.videoUrl}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    >
                                    </iframe>
                                </div>
                            }
                            {
                                lesson.content &&
                                <div
                                    ref={lessonContentRef}
                                    className={"active-lesson-content"}
                                >
                                    {
                                        props.oneLessonError &&
                                        <NotFound />
                                    }
                                    {
                                        renderLesson(lesson.content)
                                    }
                                </div>
                            }
                        </div>
                        {
                            lesson.isFull &&
                            <div className="text-right p-1">
                                {
                                    !lesson.studentLessons[0].isCompleted > 0 ?
                                        <Button.Ripple
                                            color='primary'
                                            onClick={() => {
                                                props.completedLesson({
                                                    studentLessonId: lesson.studentLessons[0].id,
                                                    isCompleted: true
                                                })
                                            }}
                                        >
                                           {t('Mark As Completed')}
                                        </Button.Ripple> :
                                        <Badge color='success'>
                                            {t('Completed')}
                                        </Badge>
                                }
                            </div>
                        }
                    </CardBody>
                </Card>
            }
            {
                props.lessons.length > 1 &&
                <div className={`other-lessons ${isOpenLessons ? 'active' : 'm-2'}`}>
                    <div className="heading" onClick={toggleLessons}>
                        <h4 className="p-2 m-0">
                            {t('Other Lessons')}
                        </h4>
                        <div className="mr-1">
                            {
                                isOpenLessons
                                    ? <ChevronDown size={20} />
                                    : <ChevronUp size={20} />
                            }
                        </div>
                    </div>
                    {
                        isOpenLessons &&
                        <Collapse isOpen={isOpenLessons}>
                            <div className="lesson-list">
                                {
                                    props.lessons.filter(ls => ls.id != props.selectedLesson).map((l, index) => {
                                        if (l.id == props.selectedLesson.id) return
                                        return <div key={'lesson-key-' + index} className="lesson-item">
                                            <div>
                                                <div className="heading">
                                                    {l.title}
                                                </div>
                                                <div className="description">
                                                    {l.description}
                                                </div>
                                            </div>
                                            <div className="icon">
                                                <PlayCircle
                                                    color="#9135ab" width={25} height={25}
                                                    onClick={() => {
                                                        props.selectLesson(l.id)
                                                        setIsOpenLessons(false)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </Collapse>
                    }
                </div>
            }
        </UILoader>

    }

    return (
        <Fragment >
            <UILoader blocking={props.topicsLoading || props.lessonCompleteLoading} className="ui-loader">
                <Card>
                    <CardBody className="p-0">
                        {
                            props.topics.length == 0 &&
                            !props.topicsLoading &&
                            !props.topicsError &&
                            <NotFound />
                        }
                        {
                            !props.topicsLoading &&
                            props.topicsError &&
                            <NoNetwork />
                        }
                        {
                            !props.topicsError &&
                            props.topics.length > 0 &&
                            <Row className="full-height">
                                {
                                    !isFullScreen &&
                                    <Col lg={3} sm='12' md='12'
                                        className={`pr-lg-0 ${isFullScreen ? "" : "topic-list-shadow"}`}
                                    >
                                        {
                                            isFullScreen ?
                                                <Menu
                                                    className="ml-2 mt-2"
                                                    width={20}
                                                    height={20}
                                                    onClick={() => setFullScreen(false)}
                                                />
                                                :
                                                <Navbar expand="lg" className="p-0">
                                                    {
                                                        !isOpen &&
                                                        <Menu
                                                            className="m-2 d-md-block d-lg-none"
                                                            width={20}
                                                            height={20}
                                                            onClick={toggle}
                                                        />
                                                    }
                                                    <Collapse isOpen={isOpen || isFullScreen} navbar>
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle>{t('Topics')}</CardTitle>
                                                                {
                                                                    !props.topicsLoading
                                                                    &&
                                                                    <div className="text-right pl-3">
                                                                        {
                                                                            isOpen &&
                                                                            <X
                                                                                className="d-lg-none"
                                                                                width={20} height={20}
                                                                                onClick={toggle}
                                                                            />
                                                                        }
                                                                        {
                                                                            !isFullScreen &&
                                                                            <X
                                                                                className="d-none d-md-none d-lg-block"
                                                                                width={20} height={20}
                                                                                onClick={() => setFullScreen(true)}
                                                                            />
                                                                        }
                                                                    </div>
                                                                }
                                                            </CardHeader>
                                                            <CardBody className="p-0">
                                                                {
                                                                    props.topics.length > 0 &&
                                                                    <div className="topics-list">
                                                                        {
                                                                            props.topics.map((t, index) =>
                                                                                <div
                                                                                    key={'topic-key-' + index}
                                                                                    className={`topics-container ${t.id == props.selectedTopic.id ? 'active' : ""}`}
                                                                                    onClick={() => {
                                                                                        props.selectTopic(t)
                                                                                        if (isOpen)
                                                                                            setIsOpen(false)
                                                                                    }}
                                                                                >
                                                                                    <img className="topic-image" src={GET_BLOG_IMAGE_URL(t.image.formats.thumbnail.url)} alt={""} />
                                                                                    <div className="topic-content">
                                                                                        <div className="heading">
                                                                                            {t.title}
                                                                                        </div>
                                                                                        <div className="description">
                                                                                            {t.description}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                }
                                                            </CardBody>
                                                        </Card>
                                                    </Collapse>
                                                </Navbar>
                                        }
                                    </Col>
                                }
                                <Col lg={isFullScreen ? 12 : 9} md='12' sm='12'>
                                    <div className="d-lg-flex">
                                        {
                                            isFullScreen &&
                                            <div>
                                                <Menu
                                                    className="mt-2 mb-2 ml-1 mr-1"
                                                    size={20}
                                                    onClick={() => setFullScreen(false)}
                                                />
                                            </div>
                                        }
                                        {
                                            activeLesson()
                                        }
                                    </div>
                                </Col>
                            </Row>
                        }

                    </CardBody>
                </Card>
            </UILoader >
        </Fragment >
    )
}

const mapStateToProps = (state) => {

    const {
        topics,
        topicsLoading,
        topicsError,
        lessons,
        lessonsLoading,
        lessonsError,
        selectedTopic,
        selectedLesson,
        oneLessonLoading,
        oneLessonError,
        lessonCompleteLoading,
        lessonCompleteError

    } = state.Lessons;
    return {
        topics,
        topicsLoading,
        topicsError,
        lessons,
        lessonsLoading,
        lessonsError,
        selectedTopic,
        selectedLesson,
        oneLessonLoading,
        oneLessonError,
        lessonCompleteLoading,
        lessonCompleteError
    }
}

export default withRouter(
    connect(mapStateToProps, {
        getUserTopics,
        getUserTopicLessons,
        selectTopic, selectLesson,
        getLesson, completedLesson
    })(AppLessons)
)
