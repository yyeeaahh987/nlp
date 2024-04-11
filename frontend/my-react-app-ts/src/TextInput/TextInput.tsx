import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import './TextInput.scss'

export const TextInput = (props: any) => {
  const [value, setValue] = React.useState('');
  return (
    <>
      <form className="wrapForm" autoComplete="off" onSubmit={(e) => {
        e.preventDefault();
      }}>
        <TextField
          id="standard-text"
          label="enter your message"
          className="wrapText"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
        //margin="normal"
        />
        <Button variant="contained" color="primary" className="button">
          <SendIcon
            onClick={() => {
              console.log(`onclick`)
              if (value !== '') {
                props.onClickSend(value)
              }
              setValue('')
            }}
          />
        </Button>
      </form>
    </>
  )
}



