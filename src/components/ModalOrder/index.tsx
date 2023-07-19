import Modal from 'react-modal';
import styles from './style.module.scss';

import { FiX } from 'react-icons/fi'

import { OrderItemProps } from '../../pages/dashboard'
import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useReactToPrint } from 'react-to-print';



interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  order: OrderItemProps[];
  handleFinishOrder: (id: string) => void;
}

export function ModalOrder({ isOpen, onRequestClose, order, handleFinishOrder }: ModalOrderProps) {
  const [total, setTotal] = useState(0)
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

  });



  const dateTime = order[0]?.order?.created_at; // obtém o valor da data/hora do primeiro elemento do array
  moment.locale('pt-br');
  const formattedDate = moment.utc(dateTime).local().format('DD/MM/YYYY HH:mm:ss');



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

  useEffect(() => {
    setTotal(
      order.reduce((acc, item) => acc + Number(item.product.price) * item.amount, 0)
    );
  }, [order, total]);
  const totalFormatted = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >

      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
        style={{ background: 'transparent', border: 0 }}
      >
        <FiX size={45} color="#f34748" />
      </button>

      <div className={styles.container}>

        <h2>Detalhes do pedido</h2>
        <div className={styles.printContent} ref={componentRef}>
          <span className={styles.table}>

            Mesa: <strong>{order[0].order.table}</strong>
          </span>
          <section className={styles.containerCard}>

            <div>
              {order.reduce((acc, item) => {
                const existingItem = acc.find(orderItem => orderItem.product.name === item.product.name);

                if (existingItem) {
                  // Produto já existe no pedido, atualiza a quantidade
                  existingItem.amount += item.amount;
                } else {
                  // Produto não existe no pedido, adiciona o item ao array
                  acc.push({ ...item });
                }

                return acc;
              }, []).map(item => (
                <section key={item.id} className={styles.containerItem}>
                  <span>{item.amount}x <strong>{item.product.name}</strong></span>
                  <span className={styles.description}>
                    {item.product.description}
                  </span>
                </section>
              ))}
            </div>






            <div style={{ color: '#000', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 900 }}>Data/Hora do pedido</span>  <br />{formattedDate}
            </div>


          </section>

          <h1 style={{
            color: 'black',
            fontSize: 20,
            fontWeight: 900,
            marginTop: 10
          }}> Total: {totalFormatted}</h1>
        </div>
        <button className={styles.buttonOrder} onClick={() => handleFinishOrder(order[0].order_id)}>
          Concluir pedido
        </button>

        <button className={styles.buttonPrint} onClick={handlePrint}>Imprimir pedido</button>
      </div>

    </Modal>
  )
}