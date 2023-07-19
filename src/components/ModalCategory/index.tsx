
import Modal from 'react-modal';
import styles from './style.module.scss';

import { FiX } from 'react-icons/fi'


type OrderItemProps = {
    id: string;
}

interface ModalOrderProps{
  isOpen: boolean;
  onRequestClose: () => void;
  handleFinishOrder: (id: string) => void;
  categories: OrderItemProps
  category: any
  setCategory: any

}

export function ModalCategory({category, setCategory,  isOpen, categories, handleFinishOrder, onRequestClose}: ModalOrderProps){
  
  const customStyles = {
    content:{
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

  return(
   <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
   >

    <button
    type="button"
    onClick={onRequestClose}
    className="react-modal-close"
    style={{ background: 'transparent', border:0 }}
    >
      <FiX size={45} color="#f34748" />
    </button>

    <div className={styles.container}>

      
      
        <input  
        className={styles.Input} 
        placeholder="Ex Pizza"  
        type="text"  
        onChange={e => setCategory(e.target.value)} 
        value={category}/>

   
     
     <button className={styles.buttonOrder} onClick={() => handleFinishOrder(categories.id)}>
        Editar
      </button>
   


    </div>

   </Modal>
  )
}