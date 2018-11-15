import React from 'react'
import Chroniq from '@chroniq/chroniq/lib'
import EventWrapperResourcesArray from '../../helper/EventWrapperResourcesArray'

export default () => <EventWrapperResourcesArray><Chroniq
  popup
  selectable
  withDragAndDrop
  defaultDate={new Date()}
/></EventWrapperResourcesArray>
