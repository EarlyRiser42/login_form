import React, { useState, useEffect } from 'react';
import '../style/Loading.css';

const Loading = () => {
  return (
    <div id="loading">
      <div id="loading-circle">
        <div id="loading-empty"></div>
      </div>
    </div>
  );
};

export default Loading;