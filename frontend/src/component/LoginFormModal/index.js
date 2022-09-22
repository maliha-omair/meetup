import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../context/Modal';
import { closeLoginModal } from '../../store/ui';
import LoginForm from './LoginForm';


function LoginFormModal() {
 
  const showModal = useSelector(state => state.ui.showLoginModal)
  const dispatch = useDispatch();

  return (
    <>
      {showModal && (
        <div>
        <Modal onClose={() => dispatch(closeLoginModal())} >
          <LoginForm />
        </Modal>
        </div>
      )}
    </>
  );
}

export default LoginFormModal;