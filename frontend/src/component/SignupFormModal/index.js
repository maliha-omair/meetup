import React, { useState } from 'react';
import { useEffect } from 'react';
import { Modal } from '../../context/Modal';

import styles from "../LoginFormModal/loginFormModal.module.css"
import SignupForm from './SignUpForm';

function SignUpFormModal() {
  const [showModal, setShowModal] = useState(false);
 
  return (
    <>

      <div className={styles.navigateLink} onClick={() => {setShowModal(true)}}>Sign Up</div>
      {showModal && (
        <div>
           
        <Modal onClose={() => setShowModal(false)} onOpen= {()=>setShowModal(true)}>
          <SignupForm />
          
        </Modal>
        </div>
      )}
    </>
  );
}

export default SignUpFormModal;