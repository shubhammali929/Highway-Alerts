import React from 'react'
export default function Animation(props) {
  if(props.Animation === 'Speaking'){
    return(
      <h1>Speaking</h1>
    )
  }else if(props.Animation === 'listening'){
    return(
      <h1>Listening</h1>
    )
  }else {
    return(
        <h1>Nothing</h1>
    )
  }
}
