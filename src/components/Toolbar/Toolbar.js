import PropTypes from 'prop-types'
import React from 'react'
import { createPortal } from 'react-dom'
import moment from 'moment'

import { connect } from '../../store/connect'
import { classNames } from '../../utils/helpers'
import { navigate, setViewByName } from '../../store/actions'

import MonthPicker from '../MonthPicker/MonthPicker.js'
import WeekPicker from '../WeekPicker/WeekPicker.js'
import DayPicker from '../DayPicker/DayPicker.js'

class Toolbar extends React.PureComponent {
  state = {
    isMounted: false,
    open: false,
    popup: {
      x: 0,
      y: 0
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.setPosition, false)
    this.setState({
      portalRef: document.querySelector('body'),
      isMounted: true
    }, this.setPosition)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setPosition, false)
  }

  onClick = () => {
    this.setState({
      open: !this.state.open
    }, () => {
      this.setPosition()
    })
  }

  setDropDownRef = (ref) => {
    this.dropdownRef = ref
  }

  render () {
    const {
      messages,
      view,
      date,
      formats,
      culture
    } = this.props.redux
    const { labelGenerators } = this.props

    const label = labelGenerators[view](date, { formats, culture })

    return (
      <div className='chrnq-toolbar'>
        <div className='chrnq-toolbar--left'>
          <span className='chrnq-btn-group'>
            <h3
              onClick={() => this.props.redux.navigate(navigate.PREVIOUS)}
            >
              {
                messages.previous || (
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' version='1.1' fill='#000000'>
                    <g id='surface1' fill='#000000'>
                      <path d='M 19.03125 4.28125 L 8.03125 15.28125 L 7.34375 16 L 8.03125 16.71875 L 19.03125 27.71875 L 20.46875 26.28125 L 10.1875 16 L 20.46875 5.71875 Z ' fill='#000000' />
                    </g>
                  </svg>

                )
              }
            </h3>
            <h3
              onClick={() => this.props.redux.navigate(navigate.NEXT)}
            >
              {
                messages.next || (
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' version='1.1' fill='#000000'>
                    <g id='surface1' fill='#000000'>
                      <path d='M 12.96875 4.28125 L 11.53125 5.71875 L 21.8125 16 L 11.53125 26.28125 L 12.96875 27.71875 L 23.96875 16.71875 L 24.65625 16 L 23.96875 15.28125 Z ' fill='#000000' />
                    </g>
                  </svg>
                )
              }
            </h3>
            <div className='chrnq-date-display'>
              { label }
              {
                this.getComponent(view, date) && (
                  <div ref={this.setDropDownRef} className='chrnq-date-display-dropdown' onClick={this.onClick}>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' version='1.1' fill='#000000'>
                      <g id='surface1' fill='#000000'><path d='M 4.21875 10.78125 L 2.78125 12.21875 L 15.28125 24.71875 L 16 25.40625 L 16.71875 24.71875 L 29.21875 12.21875 L 27.78125 10.78125 L 16 22.5625 Z ' fill='#000000' /></g>
                    </svg>
                  </div>
                )
              }
            </div>
          </span>
        </div>
        {
          this.renderPicker(view, date)
        }
        <div className='chrnq-toolbar--right'>
          <span className='chrnq-btn-group'>
            {
              this.viewNamesGroup(messages)
            }
            <span className='chrnq-toolbar-separator' />
            <h3
              onClick={() => this.props.redux.navigate(navigate.TODAY)}
            >
              {messages.today}
            </h3>
          </span>
        </div>
      </div>
    )
  }

  setPosition = () => {
    if (this.dropdownRef && this.state.open) {
      let dropDownMoveCoordinates = {}
      const dropDownCoordinates = this.dropdownRef.getBoundingClientRect()
      dropDownMoveCoordinates.left = dropDownCoordinates.left - dropDownCoordinates.width + 1
      dropDownMoveCoordinates.top = dropDownCoordinates.top + dropDownCoordinates.height

      this.setState({
        popup: {
          x: dropDownMoveCoordinates.left,
          y: dropDownMoveCoordinates.top
        }
      })
    }
  }

  onPickDate = (date) => {
    this.setState(() => ({
      open: !this.state.open
    }), () => {
      this.props.redux.navigate(date.toDate())
    })
  }

  getComponent (view, date) {
    let Component = false
    switch (view) {
      case 'month':
        Component = () => <MonthPicker year={moment(date)} onSelectMonth={this.onPickDate} />
        break
      case 'week':
        Component = () => <WeekPicker month={moment(date)} onSelectWeek={this.onPickDate} />
        break
      case 'day':
        Component = () => <DayPicker month={moment(date)} onSelectDay={this.onPickDate} />
        break
      default:
        Component = () => <DayPicker month={moment(date)} onSelectDay={this.onPickDate} />
    }

    return Component
  }

  renderPicker = (view, date) => {
    if (!this.state.isMounted || !this.state.portalRef) {
      return false
    }

    let Component = this.getComponent(view, date)

    return createPortal((
      <div className='chrnq-popup-wrapper' style={{ display: this.state.open ? 'block' : 'none' }}>
        <div className='chrnq-popup-overlay' onClick={this.onClick} />
        <div className='chrnq-popup chrnq-popup-arrow--top' style={{
          top: `${this.state.popup.y}px`,
          left: `${this.state.popup.x}px`
        }}>
          {
            this.state.open && <Component />
          }
        </div>
      </div>
    ), this.state.portalRef)
  }

  viewNamesGroup (messages) {
    const viewNames = this.props.redux.names
    const view = this.props.redux.view

    if (viewNames.length > 0) {
      return (
        viewNames.map(name =>
          <h3
            key={name}
            className={classNames({'chrnq-active': view === name})}
            onClick={() => this.props.redux.setViewByName(name)}
          >
            {messages[name] || name}
          </h3>
        )
      )
    }
  }
}

Toolbar.propTypes = {
  redux: PropTypes.shape({
    view: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.string
    ]).isRequired,
    names: PropTypes.arrayOf(PropTypes.string).isRequired,

    messages: PropTypes.object,
    date: PropTypes.instanceOf(Date),

    formats: PropTypes.any,
    culture: PropTypes.any,

    navigate: PropTypes.func.isRequired,
    setViewByName: PropTypes.func.isRequired
  }),

  labelGenerators: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  view: state.getIn([ 'props', 'view' ]),
  names: state.getIn([ 'props', 'names' ]),
  messages: state.getIn([ 'props', 'messages' ]),
  date: state.getIn([ 'props', 'date' ]),
  formats: state.getIn([ 'props', 'formats' ]).toJS(),
  culture: state.getIn([ 'props', 'culture' ])
})

const mapDispatchToProps = {
  navigate,
  setViewByName
}

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  redux: {
    ...stateProps,
    ...dispatchProps
  }
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Toolbar)
