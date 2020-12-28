import React, { useState, useEffect } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default function DatePicker(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => setSelectedDate(props.date), [props.date]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (props.onDateChange) {
      props.onDateChange(date);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant='inline'
        format='MM/dd/yyyy'
        margin='normal'
        id='date-picker-inline'
        label='Date picker inline'
        minDate={props.minDate}
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
