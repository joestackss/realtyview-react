import React from 'react';
import { Whisper } from 'rsuite';

import CalendarQuickViewPopover from './CalendarQuickViewPopover';

class CalendarQuickViewTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.triggerRef = React.createRef();
  }
  
  render() {
    const { children, speaker, event, ...props } = this.props;
    return (
      <Whisper 
        {...props}
        ref={(ref) => { this.triggerRef = ref }}
        speaker={<CalendarQuickViewPopover triggerRef={() => this.triggerRef} event={event}/>} 
      >{children}</Whisper>
    );
  }
}

export default CalendarQuickViewTrigger;