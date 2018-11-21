const defaultMessages = {
  date: 'Datum',
  time: 'Uhrzeit',
  resource: 'Ressource',
  event: 'Termin',
  allDay: 'Ganztägig',
  week: 'Woche',
  work_week: 'Arbeitswoche',
  day: 'Tag',
  month: 'Monat',
  // previous: 'Zurück',
  // next: 'Vor',
  yesterday: 'gestern',
  tomorrow: 'morgen',
  today: 'Heute',
  agenda: 'Agenda',
  showMore: total => `+${total} mehr`
}

export function prepareMessages (msgs) {
  console.log('PrepareMessages', {
    ...msgs
  })
  return {
    ...defaultMessages,
    ...msgs
  }
}
