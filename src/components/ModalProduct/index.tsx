import {useState, ChangeEvent} from 'react'
import Modal from 'react-modal';
import styles from './style.module.scss';
import { FiUpload } from 'react-icons/fi'

import { FiX } from 'react-icons/fi'




type OrderItemProps = {
    id: string;
}

interface ModalOrderProps{
  isOpen: boolean;
  onRequestClose: () => void;
  handleFinishOrder: (id: string) => void;
  product: OrderItemProps
  setName: any
  setPrice: any
  setDescription: any
  setBanner: any
  name: any
  price: any
  banner: any
  description: any
}

export function ModalProduct({name, price, banner, description,setBanner, isOpen, product, onRequestClose, handleFinishOrder, setName, setPrice, setDescription}: ModalOrderProps){
  
  const [avatarUrl, setAvatarUrl] = useState('');
  
  


  function handleFile(e: ChangeEvent<HTMLInputElement>){

    if(!e.target.files){
      return;
    }

    const image = e.target.files[0];

    if(!image){
      return;
    }

    if(image.type === 'image/jpeg' || image.type === 'image/png'){

      setBanner(image);
      
      setAvatarUrl(URL.createObjectURL(e.target.files[0]))
     

    }
   
  }
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

    <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={20} color="black" />
              </span>

              <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

                 
              { avatarUrl 
                 ?
                <img src={avatarUrl} alt="" />
                 :  
                <img src={banner} alt="" />
                }

            </label>

        <input 
        className={styles.Input} 
        placeholder="Ex: Moda Italiana" 
        type="text"  
        onChange={e => setName(e.target.value)} 
        value={name}
        />
        

        <input  
        className={styles.Input} 
        placeholder="Ex: 19.90"  
        type="text"  
        onChange={e => setPrice(e.target.value)} 
        value={price}/>

        <textarea 
        className={styles.textarea} 
        placeholder="Descrição"   
        onChange={e => setDescription(e.target.value)} 
        value={description}>

        </textarea>
     
     <button className={styles.buttonOrder} onClick={() => handleFinishOrder(product.id)}>
        Editar
      </button>
   


    </div>

   </Modal>
  )
}