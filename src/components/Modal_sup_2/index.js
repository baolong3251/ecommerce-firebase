import React, { useState } from 'react';
import './style_Modal.scss';

const Modal_sup_2 = ({ hideModal3, toggleModal3, children }) => {
  if (hideModal3) return null;

  return [
    <div className="modalOverlay" onClick={() => toggleModal3()} />,
    <div className="modalWrap">
      <div className="modal">
        {children}
      </div>
    </div>
  ];
}

export default Modal_sup_2;