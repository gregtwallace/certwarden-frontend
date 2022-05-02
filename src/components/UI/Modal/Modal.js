import { createPortal } from 'react-dom';
import Button from '../Button/Button';

import styles from './Modal.module.css';

const Modal = (props) => {
  return createPortal(
    <div className={`${styles.mymodal} fade show`} tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{props.title}</h5>
          </div>
          <div className='modal-body'>{props.children}</div>
          <div className='modal-footer'>
            {props.hasCancel && (
              <Button type='cancel' onClick={props.onClickCancel}>
                Cancel
              </Button>
            )}
            {props.hasConfirm && (
              <Button type='primary' onClick={props.onClickConfirm}>
                Confirm
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
