import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";

import { Header } from "../../components/Header";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { ModalOrder } from "../../components/ModalOrder";
import Modal from "react-modal";
import { AuthContext } from "../../contexts/AuthContext";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { CircularProgress } from "@mui/material";
import { socket } from "../../socket";

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
};
interface HomeProps {
  orders: OrderProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  };
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
    created_at: string;
  };
};

export default function Dashboard({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);
  const [loading, setLoading] = useState(false);
  const [modalItem, setModalItem] = useState<OrderItemProps[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const { userId } = useContext(AuthContext);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/order/detail", {
      params: {
        order_id: id,
      },
    });

    console.log(response.data);
    setModalItem(response.data);
    setModalVisible(true);
  }

  async function handleFinishItem(id: string) {
    const apiClient = setupAPIClient();
    await apiClient.put("/order/finish", {
      order_id: id,
    });

    const response = await apiClient.get("/order", {
      params: {
        order_id: id,
        company_id: userId,
      },
    });

    setOrderList(response.data?.reverse());
    setModalVisible(false);
    toast.success("Pedido concluído!");
  }

  useEffect(() => {
    handleRefreshOrders();
    socket.on("update-orders", handleRefreshOrders);

    return () => {
      socket.off("update-orders");
    };
  }, []);

  async function handleRefreshOrders() {
    const apiClient = setupAPIClient();
    setLoading(true);
    const response = await apiClient.get("/order", {
      params: {
        company_id: userId,
      },
    });
    setOrderList(response.data?.reverse());

    setLoading(false);
  }

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title>Painel</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Últimos pedidos</h1>
            <button onClick={handleRefreshOrders}>
              {loading ? (
                <CircularProgress size={25} />
              ) : (
                <FiRefreshCcw size={25} color="#41c900" />
              )}
            </button>
          </div>

          <article className={styles.listOreders}>
            {orderList.length === 0 && (
              <span className={styles.emptyList}>
                Nenhum pedido aberto foi encontrado...
              </span>
            )}

            {orderList.map((item) => (
              <section key={item.id} className={styles.orderItem}>
                <button onClick={() => handleOpenModalView(item.id)}>
                  <div className={styles.tag}></div>
                  <span>Mesa {item.table}</span>
                </button>
              </section>
            ))}
          </article>
        </main>

        {modalVisible && (
          <ModalOrder
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            order={modalItem}
            handleFinishOrder={handleFinishItem}
          />
        )}
      </div>
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
