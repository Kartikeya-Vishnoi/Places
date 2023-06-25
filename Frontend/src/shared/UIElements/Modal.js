import ReactDOM from "react-dom";
import BackDrop from "./BackDrop";
import { CSSTransition } from "react-transition-group";
import React from "react";
import "./Modal.css";

function ModalOverlay(props) {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
}

function Modal(props) {
  return (
    <React.Fragment>
      {props.show && <BackDrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        {/* spred operator is used here to pass the props recieved by Modal to ModalOverlay */}

        <ModalOverlay {...props}/>
      </CSSTransition>
    </React.Fragment>
  );
}
export default Modal;