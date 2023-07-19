import { useState, FormEvent, useContext } from "react";

import Head from "next/head";

import styles from "../../../styles/home.module.scss";

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

import Link from "next/link";
import Logo from "../../assets/logo-red-extends.svg";
import Image from "next/image";

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if (name === "" || email === "" || password === "") {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password,
    };

    await signUp(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro agora!</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={Logo} alt="Logo" width={300} />

        <div className={styles.login}>
          <h1 style={{ color: "#000" }}>Criando sua conta</h1>

          <form onSubmit={handleSignUp}>
            <Input
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" loading={loading}>
              Cadastrar
            </Button>
          </form>

          <Link href="/">
            <a className={styles.text}>Já possui uma conta? Faça login!</a>
          </Link>
        </div>
      </div>
    </>
  );
}
