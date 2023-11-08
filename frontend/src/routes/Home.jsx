import React, { useState, useEffect } from 'react';
import { dbService } from '../fbase';
import { Link, useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import '../style/Home.css';

const Home = () => {
  return (
    <div className="HomeDiv">
      <Nav></Nav>
      <div className={'HomeRightDiv'}>Home</div>
    </div>
  );
};
export default Home;
