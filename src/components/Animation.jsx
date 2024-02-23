import React from 'react';

const Animation = (props) => {
  return (
    <div className='animation'>
      {props.Animation === 'speaking' && <div><img src={`${process.env.PUBLIC_URL}/speaking.gif`} alt="" /></div>} 
      {props.Animation === 'listening' && <div><img src={`${process.env.PUBLIC_URL}/listening.gif`} alt="" /></div>}
      {props.Animation === null && <div>Nothing to display</div>}
    </div>
  );
};

export default Animation;
