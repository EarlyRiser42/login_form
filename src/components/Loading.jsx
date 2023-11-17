import React from 'react';
import '../style/Loading.css';

const Loading = ({ forComponent }) => {
  return forComponent ? (
    <div className={'loading'} />
  ) : (
    <div id="loadingX">
      <img src={'./X_logo.svg'} width={'80px'} height={'80px'} />
    </div>
  );
};

export default Loading;
