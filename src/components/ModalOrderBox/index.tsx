import Modal from "react-modal";
import styles from "./style.module.scss";
import { FiX } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import { OrderItemProps } from "../../pages/dashboard";
import { useState, useEffect, useRef } from "react";
import moment from "moment";

interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  order: OrderItemProps[];
  handleFinishOrder: (id: string) => void;
}

export function ModalOrderBox({
  isOpen,
  onRequestClose,
  order,
  handleFinishOrder,
}: ModalOrderProps) {
  const [total, setTotal] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

  });

  const dateTime = order[0]?.order?.created_at; // obtém o valor da data/hora do primeiro elemento do array
  moment.locale('pt-br');
  const formattedDate = moment.utc(dateTime).local().format('DD/MM/YYYY HH:mm:ss');


  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#F0F0F5",
      color: "#000000",
      borderRadius: "8px",
    },
    overlay: {
      backgroundColor: "#121214e6",
    },
  };

  useEffect(() => {

    const groups = order.map((items) => {
      return items;
    });



    const listaPedidos = groups.flatMap((arrayPedidos) => {
      return arrayPedidos;
    });
    setOrderList(listaPedidos);
    setTotal(
      listaPedidos.reduce(
        (acc, item) => acc + Number(item.product.price) * item.amount,
        0
      )
    );
    // listadearrayPedidos
    //     arrayPedidos
    //       Pedido
    // setTotal(
    //   order.reduce(
    //     (acc, item) => acc + Number(item.product.price) * item.amount,
    //     0
    //   )
    // );
  }, [order]);


  const totalFormatted = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
        style={{ background: "transparent", border: 0 }}
      >
        <FiX size={45} color="#f34748" />
      </button>

      <div className={styles.container}>
        <h2>Detalhes da mesa</h2>
        <div className={styles.printContent} ref={componentRef}>
          <span className={styles.table}>
            Mesa:{" "}
            <strong>{orderList?.length > 0 && orderList[0].order.table}</strong>
          </span>
          <section className={styles.containerCard} >
            {orderList.reduce((acc, item) => {
              const existingItem = acc.find(orderItem => orderItem.product.name === item.product.name);

              if (existingItem) {
                // Produto já existe no pedido, atualiza a quantidade
                existingItem.amount += item.amount;
              } else {
                // Produto não existe no pedido, adiciona o item ao array
                acc.push({ ...item });
              }

              return acc;
            }, []).flatMap((item) => {
              const Price = parseFloat(item.product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
              console.log("render", item);
              return (
                <section key={item.id} className={styles.containerItem}>
                  <span>
                    {item.amount}x <strong>{item.product?.name}</strong>
                  </span>

                  <span>{Price}</span>

                </section>

              );
            })}
            <div style={{ color: '#000', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 800 }}>Data/Hora</span>  <br />{formattedDate}
            </div>
            <h1 style={{ color: "black", marginBlock: 10 }}> Total: {totalFormatted}</h1>

          </section>
        </div>
        <button
          className={styles.buttonOrder}
          onClick={() => handleFinishOrder(orderList[0].order_id)}
        >
          Fechar mesa
        </button>

        <button className={styles.buttonPrint} onClick={handlePrint}>Imprimir conta</button>
      </div>
    </Modal>
  );
}
