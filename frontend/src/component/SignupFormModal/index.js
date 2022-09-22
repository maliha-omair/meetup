import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../context/Modal';
import { closeSignupModal } from '../../store/ui';

import styles from "../LoginFormModal/loginFormModal.module.css"
import SignupForm from './SignUpForm';

function SignUpFormModal() {
  const showModal = useSelector(state => state.ui.showSignupModal)
  const dispatch = useDispatch();
  return (
    <>
      {showModal && (
        <div>
           
        <Modal onClose={() => dispatch(closeSignupModal())} >
          <SignupForm />
        </Modal>
        </div>
      )}
    </>
  );
}

export default SignUpFormModal;