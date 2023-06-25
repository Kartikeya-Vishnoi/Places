import { Link } from "react-router-dom";
import "./MainNavigation.css"

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import React from "react";
import SideDrawer from "./SideDrawer";
import { useState } from "react";
import BackDrop from "../UIElements/BackDrop";

function MainNavigation() {
  const[Drawerisopen,SetDrawerisopen]=useState(false);
  function opendrawerhandler(){
    SetDrawerisopen(true);
  }
  function closedrawerhandler(){
    SetDrawerisopen(false);
  }

  return (
    <React.Fragment>
      {Drawerisopen && <BackDrop onClick={closedrawerhandler}/>}
      {<SideDrawer show={Drawerisopen} onClick={closedrawerhandler}>
      <nav className="main-navigation__drawer-nav">
      <NavLinks/>
      </nav>
      </SideDrawer>
      }
      <MainHeader>
      <button className="main-navigation__menu-btn" onClick={opendrawerhandler}>
        <span />
        <span />
        <span />
      </button>

      <h1 className="main-navigation__title">
        <Link to="/">Your Places </Link>
      </h1>

      <nav className="main-navigation__header-nav"><NavLinks/></nav>
    </MainHeader>
    </React.Fragment>
  );
}

export default MainNavigation;