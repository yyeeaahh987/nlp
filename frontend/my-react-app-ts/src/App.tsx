import React, { useEffect, useState } from "react";
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import { TextInput } from "./TextInput/TextInput";
import { MessageLeft, MessageRight } from "./Message/Message";
import './App.scss'
import {sendMsgToGpt} from './Service/commonService'

export default function App() {
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    let initMessge: any = []
    initMessge.push({
      message: "hello",
      timestamp: "",
      photoURL: "",
      displayName: "bot",
      avatarDisp: false,
      direction: "left"
    })
    setMessageList(initMessge)
  }, [])

  async function onClickSend(input: any) {
    console.log(`onClickSend`, input)
    let msg:any = [...messageList]
    console.log(`msg`, msg)
    msg.push({
      message: input,
      timestamp: "",
      photoURL: "",
      displayName: "human",
      avatarDisp: false,
      direction: "right"
    })
    let result = await sendMsgToGpt(input)
    console.log(`result`,result)
    msg.push({
      message: result,
      timestamp: "",
      photoURL: "",
      displayName: "bot",
      avatarDisp: false,
      direction: "left"
    })
    setMessageList(msg)
  }
  return (
    <div className="container">
      <Paper className="paper">
        <Paper className="messagesBody">
          {
            messageList.map((eachMsg: any, index: number) => {
              if (eachMsg.direction === "right") {
                return (
                  <>
                    <React.Fragment key={index}>
                      <MessageRight
                        message={eachMsg.message}
                        timestamp={eachMsg.timestamp}
                        photoURL={eachMsg.photoURL}
                        displayName={eachMsg.displayName}
                        avatarDisp={eachMsg.avatarDisp}
                      />
                    </React.Fragment>
                  </>
                )
              } else {
                return (
                  <>
                    <React.Fragment key={index}>
                      <MessageLeft
                        message={eachMsg.message}
                        timestamp={eachMsg.timestamp}
                        photoURL={eachMsg.photoURL}
                        displayName={eachMsg.displayName}
                        avatarDisp={eachMsg.avatarDisp}
                      />
                    </React.Fragment>
                  </>
                )
              }
            })
          }
        </Paper>
        <TextInput
          onClickSend={onClickSend}
        />
      </Paper>
    </div>

  );
}
