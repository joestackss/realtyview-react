import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Bus from '../../utils/Bus';
import './index.scss';


export default () => {
  let [visibility, setVisibility] = useState(false);
  let [message, setMessage] = useState('');
  let [title, setTitle] = useState('');
  let [type, setType] = useState('');

  useEffect(() => {
    Bus.addListener('flash', ({message, title, type}) => {
        setVisibility(true);
        setMessage(message);
        setTitle(title);
        setType(type);
        setTimeout(() => {
          setVisibility(false);
        }, 4000);
    });
  }, []);

  return (
    visibility && (
      <div className={classNames({
        FlashMessage: true,
        success: type === "success",
        error: type === "error"
      })}>
        <label>{title}</label>
        <p>{message}</p>
      </div>
    )
  )
}
