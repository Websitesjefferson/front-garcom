import { useContext, useState } from "react";
import styles from "./styles.module.scss";

import Link from "next/link";
import { RiCloseLine, RiMenu3Line } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import Logo from "../../assets/logo-white-extends.svg";

import { AuthContext, signOut } from "../../contexts/AuthContext";
import Image from "next/image";



function Menu() {
  const { signOut } = useContext(AuthContext);

  return (
    <div className={styles.containerLinks}>
      <Link href="/boxControl">
        <a>Mesas</a>
      </Link>

      <Link href="/dashboard">
        <a>Pedidos</a>
      </Link>

      <Link href="/registeredProducts">
        <a>Cardápio</a>
      </Link>

      <Link href="/category">
        <a>
          Cadastrar <br /> categoria
        </a>
      </Link>

      <Link href="/product">
        <a>
          Cadastrar <br /> produto
        </a>
      </Link>

      <div className={styles.navButton}>
        <button onClick={signOut}>
          <FiLogOut color="#FFF" size={24} />
        </button>
      </div>
    </div>
  );
}

export function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div className={styles.linksLogo}>
          <Link href="/dashboard">
            <Image src={Logo} alt="" width={300} />
          </Link>
        </div>
        <div className={styles.linksWrapper}>
          <Menu />
        </div>

        <div className={styles.navMenu}>
          {toggleMenu ? (
            <RiCloseLine
              color="white"
              size={27}
              onClick={() => setToggleMenu(false)}
            />
          ) : (
            <RiMenu3Line
              color="white"
              size={27}
              onClick={() => setToggleMenu(true)}
            />
          )}
          {toggleMenu && (
            <div className={styles.navMenuWrapper}>
              <Menu />
            </div> 
          )}
        </div>
      </div>
    </header>
  );
}
