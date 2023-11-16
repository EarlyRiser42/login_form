import React from 'react';
import '../style/Loading.css';

const Loading = ({ forComponent }) => {
  return forComponent ? (
    <div id="loading">
      <div id="loading-circle">
        <div id="loading-empty"></div>
      </div>
    </div>
  ) : (
    <div id="loadingX">
      <img src={'./X_logo.svg'} width={'80px'} height={'80px'} />
    </div>
  );
};

export default Loading;
