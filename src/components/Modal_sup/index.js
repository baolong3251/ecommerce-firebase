import React, { useState } from 'react';
import './style_Modal.scss';

const Modal_sup = ({ hideModal2, toggleModal2, children }) => {
  if (hideModal2) return null;

  return [
    <div className="modalOverlay" onClick={() => toggleModal2()} />,
    <div className="modalWrap">
      <div className="modal">
        {children}
      </div>
    </div>
  ];
}

export default Modal_sup;