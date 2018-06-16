import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'

import { connect } from '../../store/connect'

import dates from '../../utils/dates'

import { dateCellSelection, slotWidth, getCellAtX, pointInBox } from '../../utils/selection'
import { classNames } from '../../utils/helpers'
import Selection, { getBoundsForNode, isEvent } from '../Selection/Selection'

import BackgroundCell from './BackgroundCell.js'

class BackgroundCells extends React.PureComponent {
  state = {
    selecting: false
  }

  componentDidMount () {
    this.props.selectable &&
      this._selectable()
  }

  componentWillUnmount () {
    this._teardownSelectable()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectable && !this.props.selectable) { this._selectable() }

    if (!nextProps.selectable && this.props.selectable) { this._teardownSelectable() }
  }

  render () {
    let { range, date: currentDate, resources, cellWrapperComponent: wrapper, accessors, monthView } = this.props
    let { selecting, startIdx, endIdx } = this.state

    return (
      <div className='chrnq-row-bg'>
        {
          range.map((date, index) => {
            const selected = selecting && index >= startIdx && index <= endIdx

            return (
              <BackgroundCell
                monthView={monthView}
                key={index}
                wrapper={wrapper}
                accessors={accessors}
                date={date}
                resources={resources}
                selected={selected}
                currentDate={currentDate}
              />
            )
          })
        }
      </div>
    )
  }

  _selectable () {
    let node = findDOMNode(this)
    let selector = this._selector = new Selection(this.props.container, {
      longPressThreshold: this.props.longPressThreshold
    })

    selector.on('selecting', box => {
      const { range } = this.props
      const { rtl } = this.props.redux

      let startIdx = -1
      let endIdx = -1

      if (!this.state.selecting) {
        this.props.onSelectStart && this.props.onSelectStart(box)
        this._initial = { x: box.x, y: box.y }
      }
      if (selector.isSelected(node)) {
        let nodeBox = getBoundsForNode(node);
        ({ startIdx, endIdx } = dateCellSelection(
          this._initial,
          nodeBox,
          box,
          range.length,
          rtl))
      }

      this.setState({
        selecting: true,
        startIdx,
        endIdx
      })
    })

    selector.on('beforeSelect', (box) => {
      if (this.props.selectable !== 'ignoreEvents') return

      return !isEvent(findDOMNode(this), box)
    })

    selector
      .on('click', point => {
        if (!isEvent(findDOMNode(this), point)) {
          let rowBox = getBoundsForNode(node)
          const { range } = this.props
          const { rtl } = this.props.redux

          if (pointInBox(rowBox, point)) {
            let width = slotWidth(getBoundsForNode(node), range.length)
            let currentCell = getCellAtX(rowBox, point.x, width, rtl, range.length)

            this._selectSlot({
              startIdx: currentCell,
              endIdx: currentCell,
              action: 'click'
            })
          }
        }

        this._initial = {}
        this.setState({ selecting: false })
      })

    selector
      .on('select', () => {
        this._selectSlot({ ...this.state, action: 'select' })
        this._initial = {}
        this.setState({ selecting: false })
        this.props.onSelectEnd && this.props.onSelectEnd(this.state)
      })
  }

  _teardownSelectable () {
    if (!this._selector) return
    this._selector.teardown()
    this._selector = null
  }

  _selectSlot ({ endIdx, startIdx, action }) {
    if (endIdx !== -1 && startIdx !== -1) {
      this.props.onSelectSlot({
        start: startIdx,
        end: endIdx,
        action
      })
    }
  }
}

BackgroundCells.propTypes = {
  redux: PropTypes.shape({
    rtl: PropTypes.bool
  }).isRequired,

  cellWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]).isRequired,
  // cellWrapperComponent: PropTypes.

  date: PropTypes.instanceOf(Date),
  resources: PropTypes.any,
  container: PropTypes.func,
  selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: PropTypes.number,

  onSelectSlot: PropTypes.func.isRequired,
  onSelectEnd: PropTypes.func,
  onSelectStart: PropTypes.func,

  range: PropTypes.arrayOf(
    PropTypes.instanceOf(Date)
  ),

  monthView: PropTypes.bool
}

const mapStateToProps = (state) => ({
  redux: {}
})

export default connect(mapStateToProps)(BackgroundCells)
