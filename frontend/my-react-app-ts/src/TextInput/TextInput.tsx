import React,{useState,useEffect} from 'react'
import TextField from '@mui/material/TextField';
import { createStyles, Theme } from "@mui/material/styles";
import { Box, ThemeProvider } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import './TextInput.scss'

  export const TextInput = (props:any) => {
    const [value, setValue] = React.useState(''); 
      return (
          <>
              <form className="wrapForm"  noValidate autoComplete="off">
              <TextField
                  id="standard-text"
                  label="enter your message"
                  className="wrapText"
                  value={value}
                  onChange={(e)=>{
                    setValue(e.target.value)
                  }}
                  //margin="normal"
              />
              <Button variant="contained" color="primary" className="button"
              onClick={()=>{
                console.log(`onclick`)
                if(value !==''){
                    props.onClickSend(value)
                }
                setValue('')
              }}
              >
                  <SendIcon />
              </Button>
              </form>
          </>
      )
  }
  
  
  
  