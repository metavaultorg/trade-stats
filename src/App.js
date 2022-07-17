import React, { useState, useEffect } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import cx from "classnames";
import Polygon from './views/Polygon';
import Referrals from './views/Referrals';
import Trading from './views/Trading';
import './App.css';
import darkLogoIcon from './img/logo_MVX_dark.svg';
import lightLogoIcon from './img/logo_MVX_light.svg';
import { FaTimes } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { RiMenuLine } from 'react-icons/ri';

function AppHeaderLinks({ mode, small, clickCloseIcon }) {
  return (
    <div className="App-header-links">
      {small &&
        <div className="App-header-links-header">
          <div className="App-header-menu-icon-block" onClick={() => clickCloseIcon()}>
            <FiX className="App-header-menu-icon" />
          </div>
          <NavLink exact activeClassName="active" className="App-header-link-main" to="/">
            <img src={darkLogoIcon} alt="MVX Logo" />
          </NavLink>
        </div>
      }
      <div className="App-header-link-container">
        <NavLink to="/" exact className="nav-link" activeClassName="active">Polygon</NavLink>
      </div>
    </div>
  )
}

const App = () => {
  const [mode, setMode] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(undefined);

  const slideVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 }
  }

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  useEffect(() => {
    const savedMode = window.localStorage.getItem('mode');
    const targetMode = savedMode == 'light' ? 'light' : 'dark';
    document.querySelector('body').style.backgroundColor = targetMode == 'dark' ? '#231f20' : '#f6f9ff';
    setMode(targetMode);
  }, [])

  return (
    <Switch>
      {
        mode && <div className={cx("App", mode)}>
          {isDrawerVisible &&
            <AnimatePresence>
              {isDrawerVisible &&
                <motion.div className="App-header-backdrop"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeVariants}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsDrawerVisible(!isDrawerVisible)}
                >
                </motion.div>
              }
            </AnimatePresence>
          }
          <div className="nav">
            <div className="nav-left">
              <div className="App-header-menu-icon-block" onClick={() => setIsDrawerVisible(!isDrawerVisible)}>
                {!isDrawerVisible && <RiMenuLine className="App-header-menu-icon" />}
                {isDrawerVisible && <FaTimes className="App-header-menu-icon" />}
              </div>
              <a href="https://metavault.trade" target="_blank" rel="noreferrer" className="nav-logo">
                <img width="87" src={mode == 'dark' ? darkLogoIcon : lightLogoIcon} />
              </a>
              <NavLink to="/" exact className="nav-link" activeClassName="active">Polygon</NavLink>
            </div>
            <div className="nav-right">
              <a href="https://metavault.trade" target="_blank" rel="noreferrer" className="nav-link">APP</a>
              <a href="https://docs.metavault.trade" target="_blank" rel="noreferrer" className="nav-link">DOCS</a>
            </div>
          </div>
          <AnimatePresence>
            {isDrawerVisible &&
              <motion.div
                onClick={() => setIsDrawerVisible(false)}
                className="App-header-links-container App-header-drawer"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={slideVariants}
                transition={{ duration: 0.2 }}
              >
                <AppHeaderLinks mode={mode} small clickCloseIcon={() => setIsDrawerVisible(false)} />
              </motion.div>
            }
          </AnimatePresence>
          <div className="content">
            <Route exact path="/" render={(props) => (
              <Polygon {...props} mode={mode} />
            )} />
            <Route exact path="/referrals/:chainName" render={(props) => (
              <Referrals {...props} mode={mode} />
            )} />
            <Route exact path="/trading" component={Trading} />
          </div>
        </div>
      }
    </Switch>
  )
};

export default App;
