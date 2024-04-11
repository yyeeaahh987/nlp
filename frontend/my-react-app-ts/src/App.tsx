import React, { useEffect, useState } from "react";
import { createStyles, Theme } from "@mui/material/styles";
// import makeStyles from '@mui/styles';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import { TextInput } from "./TextInput/TextInput";
import { MessageLeft, MessageRight } from "./Message/Message";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import './App.scss'
import { timeStamp } from "console";
const Item = styled(Paper)(({ theme }: any) => ({
  width: "80vw",
  height: "80vh",
  maxWidth: "500px",
  maxHeight: "700px",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "relative"
}));

// const useStyles:any = makeStyles((theme: Theme) =>
//   createStyles({
//     paper: {
//       width: "80vw",
//       height: "80vh",
//       maxWidth: "500px",
//       maxHeight: "700px",
//       display: "flex",
//       alignItems: "center",
//       flexDirection: "column",
//       position: "relative"
//     },
//     paper2: {
//       width: "80vw",
//       maxWidth: "500px",
//       display: "flex",
//       alignItems: "center",
//       flexDirection: "column",
//       position: "relative"
//     },
//     container: {
//       width: "100vw",
//       height: "100vh",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center"
//     },
//     messagesBody: {
//       width: "calc( 100% - 20px )",
//       margin: 10,
//       overflowY: "scroll",
//       height: "calc( 100% - 80px )"
//     }
//   })
// );

export default function App() {
  // const classes = useStyles();
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

  function onClickSend(input: any) {
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
