import React, { useState, useContext } from 'react';
import { ConfigContext } from '../routes';
import Banner from './Banner';
import Styles from 'styles/Connect.css';

export default function Connect () {

  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [activeInput, setActiveInput] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const { url } = useContext(ConfigContext);

  function focus(e) {
    setActiveInput(e.target.id);
  };

  function blur(e) {
    setActiveInput('');
  };

  function changeContact(e) {
    setContact({
      ...contact,
      [e.target.id]: e.target.value
    });
  };

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  function submit() {
    setError('');
    const emptyItems = Object.keys(contact).every(item => contact[item] !== '');
    if (!emptyItems) {
      setError('Some inputs are empty, please make sure all inputs are filled out.');
      return;
    };
    if (!validateEmail(contact.email)) {
      setError('The email you entered seems to be invalid, please double check and try again');
      return;
    };
    fetch(url + '/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contact)
    }).then(response => response.json()).then(response => {
      if (response.error) {
        throw new Error(response.message)
      };
      setResponse(response.message)
    }).catch(err => {
      setError(err.message)
    });
  };

  return (
    <div>
      <Banner heading={'Contact us'} color='white' fontColor='#444'/>
      <div className={Styles.container}>
        <div className={Styles.subContainer}>
          <div className={Styles.response}>{response}</div>
          <div className={Styles.error}>{error}</div>
          <div className={Styles.doubleInput}>
            <input
              id='firstName'
              type='text'
              placeholder='First Name'
              className={activeInput === 'firstName' ? [Styles.input, Styles.focus].join(' ') : Styles.input}
              onChange={changeContact}
              value={contact.firstName}
              onFocus={focus}
              onBlur={blur}
            />
            <input
              id='lastName'
              type='text' 
              placeholder='Last Name'
              className={activeInput === 'lastName' ? [Styles.input, Styles.focus].join(' ') : Styles.input}
              value={contact.lastName}
              onChange={changeContact}
              style={{marginLeft: '20px'}}
              onFocus={focus}
              onBlur={blur}
            />
          </div>
          <input
            id='email'
            type='email' 
            placeholder='Your email'
            value={contact.email}
            onChange={changeContact}
            className={activeInput === 'email' ? [Styles.input, Styles.focus].join(' ') : Styles.input}
            style={{marginTop: '20px'}}
            onFocus={focus}
            onBlur={blur}
          />
          <textarea
            id='message' 
            type='' 
            placeholder='Have any questions or want to schedule an appointment? Let us know!'
            value={contact.message}
            onChange={changeContact}
            className={activeInput === 'message' ? [Styles.textArea, Styles.focus].join(' ') : Styles.textArea}
            style={{marginTop: '20px'}}
            onFocus={focus}
            onBlur={blur}
          />
          <div className={Styles.button} onClick={submit}>
            Send message
          </div>
        </div>
      </div>
    </div>
  );
};