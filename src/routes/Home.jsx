import React, { useState, useEffect } from 'react';
import { dbService } from '../fbase';
import { Link, useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import '../style/Home.css';

const Home = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  return (
    <div className="HomeDiv">
      <Nav isNavOpen={isNavOpen}></Nav>
      <div className={'HomeRightDiv'}>Home</div>
    </div>
  );
};
export default Home;
