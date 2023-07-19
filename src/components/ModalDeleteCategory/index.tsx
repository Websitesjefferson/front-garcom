
import Modal from 'react-modal';
import styles from './style.module.scss';

import { FiX } from 'react-icons/fi'


type OrderItemProps = {
  id: string;
}

interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  handleFinishCategory: (id: string) => void;
  categories: OrderItemProps

}

export function ModalDeleteCategory({ isOpen, categories, handleFinishCategory, onRequestClose }: ModalOrderProps) {

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#F0F0F5',
      color: '#000000',
      borderRadius: '8px',
    },
    overlay: {
      backgroundColor: '#121214e6',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >



      <div className={styles.container}>


        <p style={{ color: '#000', textAlign: 'center' }}>Tem certeza que deseja excluir essa categoria?</p>

        <div className={styles.div}>
          <button
            type='button'  
            style={{paddingInline: 10, paddingBlock: 5}} 
            onClick={() => handleFinishCategory(categories.id)}>
            Sim
          </button>

        
        <button
          type="button"
          onClick={onRequestClose}
          className="react-modal-close"
          style={{paddingInline: 10, paddingBlock: 5}}
        >
          Não
        </button>
        </div>
      </div>

    </Modal>
  )
}