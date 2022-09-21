import React, { useState } from 'react';
import { useEffect } from 'react';
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';
import styles from "../LoginFormModal/loginFormModal.module.css"

function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);
 
  return (
    <>

      <div className={styles.navigateLink} onClick={() => {setShowModal(true)}}>Log In</div>
      {showModal && (
        <div>
           
        <Modal onClose={() => setShowModal(false)} onOpen= {()=>setShowModal(true)}>
          <LoginForm />
        </Modal>
        </div>
      )}
    </>
  );
}

export default LoginFormModal;