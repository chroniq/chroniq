# Notice

Not for commercial use. If you want to use it in your project for commercial user, please contact info@incoqnito.io.

For more information check the licence.

# Chroniq

NOT FOR COMMERCIAL USE! CHECK THE LICENCE

Full featured resource calendar inspired by full calendar, big calendar and many other calendar solutions out there.

See the [Docs and Examples](https://chroniq.github.io/chroniq/)

Are you interested in using Chroniq in your product?
Please contact us at [info@incoqnito.io](mailto:info@incoqnito.io).

# Features
TBD

# Props
```typescript

type Props = {
    /*
     * for 3rd party components (append to first real DOM el)
     * */
    className?: string,
    style?: <{}>,
    /*
     * view properties
     * */
    view: string,
    onViewChange?: () => {
       view: string,
       state: <Object> 
    },
    views: Array<["month", "week", "day", "agenda"] string>,
    /*
     * date & time properties
     * */
    date: Date,
    onDateChange?: () => Array<Date>,
    minTime: Date,
    maxTime: Date,
    scrollTime: Date,
    slotDuration: number,
    slotInterval: number,
    /*
     * localization
     * */
    culture: string,
    rtl: boolean,
    /*
     * events
     * */
    events: Array<Event>,
    onSelectEvent?: () => Array<Event>,
    /*
     * resource
     * */
    resources?: Array<Resource>,
    joinedResources: Array<number | string>,
    onChangeJoinedResources?: () => ,
    activeResources: Array<number | string>,
    onChangeActiveResources?: () => ,
    /*
     * background events
     * */
    backgroundEvents?: Array<BackgroundEvent>,
    onSelectBackgroundEvent?: () => {
        event: <Event>,
        state: <Object>
    },
    /*
     * business hours
     * */
    businessHours?: Array<BusinessHour>,
    /*
     * drag & drop and resize
     * */
    onEventDrag?: () => {
        events: Array<Event>,
        state: <Object>
    },
    onEventDragBegin?: () => {
        event: <Event>,
        state: <Object>,
        id: number | string,
        resourceId: number | string,
        start: Date,
        end: Date
    },
    onEventDrop?: () => {
        events: Array<Event>,
        state: <Object>
    },
    onEventResize?: () => {
        events: Array<Event>,
        state: <Object>
    },
    snapDuration?: Date, // must be implemented
    /*
     * selection
     * */
    selectedEvents: Array<number | string>,
    onSelectSlot?: () => {
        state: <Object>,
        action: "select" | "click",
        start: Date,
        end: Date,
        resources: Array<{
            color: string,
            id: number | string
        }>,
        slots: Array<Date>
    },
    /*
     * accessors
     * */
    accessors: {
        events: EventAccessor,
        backgroundEvents: BackgroundEventAccessor
    },
    mutators: {
        events: EventMutator,
        backgroundEvents: BackgroundEventMutator
    },
    /*
     * Layout Strategies
     * */
    layoutStrategies: {
        events: LayoutStrategy,
        backgroundEvents: LayoutStrategy
    },
    /*
     * Custom Components
     * */
    components: {
        event: Array<React.Component>,
        backgroundEvent: Array<React.Component>,
        eventOverlay: Array<React.Component>,
        eventWrapper: Array<React.Component>,
        dayWrapper: Array<React.Component>,
        dateCellWrapper: Array<React.Component>,
        toolbar: Array<React.Component>,
        agenda: {
            date: React.Component,
            time: React.Component,
            event: React.Component,
            backgroundEvent: React.Component
        },
        day: {
            header: React.Component,
            event: React.Component,
            backgroundEvent: React.Component,
            eventOverlay: React.Component
        },
        week: {
            header: React.Component,
            event: React.Component,
            backgroundEvent: React.Component,
            eventOverlay: React.Component
        },
        month: {
            header: React.Component,
            dateHeader: React.Component,
            event: React.Component,
            backgroundEvent: React.Component
        }
    },
    /*
     * date formats
     * */
    formats: {
        dateFormat: string,
        dayFormat: string,
        weekdayFormat: string,
        timeGutterFormat: string,
        monthHeaderFormat: string,
        dayRangeHeaderFormat: ({ start: Date, end: Date }, culture: string, local: Date): Date,
        dayHeaderFormat: string,
        agendaHeaderFormat: string,
        selectRangeFormat: ({ start: Date, end: Date }, culture: string, local: Date): Date,
        agendaDateFormat: string,
        agendaTimeFormat: string,
        agendaTimeRangeFormat: ({ start: Date, end: Date }, culture: string, local: Date): Date,
        eventTimeRangeFormat: ({ start: Date, end: Date }, culture: string, local: Date): Date,
        eventTimeRangeStartFormat: ({ start: Date, end: Date }, culture: string, local: Date): Date,
        eventTimeRangeEndFormat: ({ start: Date, end: Date }, culture: string, local: Date): Date
    },
    /*
     * messages
     * */
    messages: {
        allDay: string | Function,
        previous: string | Function,
        next: string | Function,
        today: string | Function,
        month: string | Function,
        week: string | Function,
        day: string | Function,
        agenda: string | Function,
        date: string | Function,
        time: string | Function,
        event: string | Function,
        showMore: string | Function
    },
    /*
     * i dont know ¯\_(ツ)_/¯
     * */
    drilldownView: React.Component,
    getDrillDownView: Function,
    toolbar: Function,
    popup: boolean,
    now: Date,
    popupOffset: boolean,
    selectable: boolean,
    /*
     * deprecated props (will be removed asap)
     * */
    longPressThreshold: number,
    onDoubleClickEvent: () => {
        event: <Event>,
        state: <Object>
    }
}
```

# Types
Chroniq works with several data types of Events and Resource.
## Event
```typescript
type Event = {
    id: number | string,
    title: string,
    start: Date,
    end: Date,
    allDay?: boolean,
    color?: string,
    resourceId?: number | string | Array<number> | Array<string>
}
```
## Background Event
```typescript
type BackgroundEvent = {
    id: number | string,
    title: string,
    start: Date,
    end: Date,
    color?: string,
    resourceId?: number | string
}
```
## Business Hour
```typescript
type BusinessHour = {
    days: Array<number>,
    from: Date,
    to: date
}
```
## Resource
```typescript
type Resource = {
    id: number | string,
    title: string,
    color?: string,
    businessHours: Array<BusinessHour>
}
```

## Roadmap
- DnD Rewrite (remove old code from BigCalendar)
- move mutiple selected events through the calendar
- add prop snapDuration for dragging an specific duration
- Rendering Preview as interval Highlight event
- Rewrite Selection as internal selection event
- Implement Prop restrictTo on Events/BackgroundEvents. Restricts events to special views
- Prop fixedMonthRow

## Credits
![Incoqnito logo](https://s3.eu-central-1.amazonaws.com/incoqnito-marketing/incoqnito-colored-vertical.svg)
[https://www.incoqnito.io/](https://www.incoqnito.io/)

