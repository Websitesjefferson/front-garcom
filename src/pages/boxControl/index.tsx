import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";

import { Header } from "../../components/Header";
import { FiRefreshCcw } from "react-icons/fi";

import { setupAPIClient } from "../../services/api";

import { ModalOrderBox } from "../../components/ModalOrderBox";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { AuthContext } from "../../contexts/AuthContext";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { CircularProgress } from "@mui/material";
import { socket } from "../../socket";

export type OrderProps = {
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

  async function handleOpenModalView(items: OrderProps[]) {
    const apiClient = setupAPIClient();
    const orders = await Promise.all(
      items.map(async (order) => {
        const response = await apiClient.get("/order/detail", {
          params: {
            order_id: order.id,
          },
        });

        return response.data;
      })
    );

    setModalItem(orders);
    setModalVisible(true);
  }

  function groupBy(array, key) {
    return array.reduce((acc, item) => {
      if (!acc[item[key]]) acc[item[key]] = [];
      acc[item[key]].push(item);
      return acc;
    }, {});
  }

  async function handleFinishItem(id: string) {
    const apiClient = setupAPIClient();
    await apiClient.delete("/order", {
      params: {
        order_id: id,
      },
    });
    await handleRefreshOrders();
    setModalVisible(false);
    toast.success("Concluído!");
  }
  async function handleRefreshOrders() {
    const apiClient = setupAPIClient();
    setLoading(true);
    const response = await apiClient.get("/order/box", {
      params: {
        company_id: userId,
      },
    });
    const ordersGrouped = groupBy(response.data, "table");
    const listOrders: Array<any> = Object.values(ordersGrouped).map(
      (orders) => orders
    );
    setOrderList(listOrders);
    setLoading(false);
  }

  useEffect(() => {
    handleRefreshOrders();
    socket.on("update-orders", handleRefreshOrders);

    return () => {
      socket.off("update-orders");
    };
  }, []);

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title>Mesas</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Mesas</h1>
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
              <span className={styles.emptyList}>Nenhuma mesa aberta...</span>
            )}

            <div className={styles.card}>
              {orderList.map((item) => (
                <section key={item[0].id} className={styles.orderItem}>
                  <button onClick={() => handleOpenModalView(Object(item))}>
                    <div className={styles.tag}></div>
                    <span>Mesa {item[0].table}</span>
                  </button>
                </section>
              ))}
            </div>
          </article>
        </main>

        {modalVisible && (
          <ModalOrderBox
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
