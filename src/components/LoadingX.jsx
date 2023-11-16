import React, { useState, useEffect } from 'react';
import '../style/Loading.css';

const LoadingX = () => {
  return (
    <div id="loadingX">
      <img src={'./X_logo.svg'} alt={'X_logo'} width={'80px'} height={'80px'} />
    </div>
  );
};

export default LoadingX;
