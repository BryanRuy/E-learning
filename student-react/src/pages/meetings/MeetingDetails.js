import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const MeetingDetails = (props) => {
    return (
        <div>
            
        </div>
    )
}

MeetingDetails.propTypes = {
    props: PropTypes
}

const mapStateToProps = (state) => {
    const { } = state.Chat;
}

const mapDispatchToProps = {
    action1
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MeetingDetails))
