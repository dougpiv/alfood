import { Box, Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { IPaginacao } from "../../interfaces/IPaginacao";
import IRestaurante from "../../interfaces/IRestaurante";
import style from "./ListaRestaurantes.module.scss";
import Restaurante from "./Restaurante";

const ListaRestaurantes = () => {
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
    const [proximaPagina, setProximaPagina] = useState("");
    const [voltaPagina, setVoltaPagina] = useState("");
    const [pesquisaRestaurante, setPesquisaRestaurante] = useState("");
    const [ordenaRestaurante, setOrdenaRestaurante] = useState("");

    useEffect(() => {
        //obter restaurantes
        axios
            .get<IPaginacao<IRestaurante>>("http://localhost:8000/api/v1/restaurantes/")
            .then((resposta) => {
                setRestaurantes(resposta.data.results);
                setProximaPagina(resposta.data.next);
            })
            .catch((erro) => {
                console.log(erro);
            });
    }, []);

    function verPagina(pagina: string) {
        axios
            .get<IPaginacao<IRestaurante>>(pagina)
            .then((resposta) => {
                setRestaurantes(resposta.data.results);
                setProximaPagina(resposta.data.next);
                setVoltaPagina(resposta.data.previous);
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function pesquisarRestaurante(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        axios
            .get<IPaginacao<IRestaurante>>("http://localhost:8000/api/v1/restaurantes/", {
                params: {
                    search: pesquisaRestaurante,
                    ordering: ordenaRestaurante,
                },
            })
            .then((result) => {
                console.log(result);
                setRestaurantes(result.data.results);
                setProximaPagina("");
                setVoltaPagina("");
            });
    }

    return (
        <section className={style.ListaRestaurantes}>
            <h1>
                Os restaurantes mais <em>bacanas</em>!
            </h1>
            <Box component="form" onSubmit={(evento: React.FormEvent<HTMLFormElement>) => pesquisarRestaurante(evento)}>
                <TextField onChange={(evento) => setPesquisaRestaurante(evento.target.value)} label="Nome do Restaurante" variant="standard" />
                <InputLabel id="orderby">Ordenar Por</InputLabel>
                <Select
                    labelId="orderby"
                    id="selectid"
                    label="Ordenar Por"
                    value={ordenaRestaurante}
                    onChange={(evento) => setOrdenaRestaurante(evento.target.value)}
                >
                    <MenuItem value={"id"}>Id</MenuItem>
                    <MenuItem value={"nome"}>Nome</MenuItem>
                </Select>
                <Button type="submit" variant="outlined">
                    Pesquisar
                </Button>
            </Box>
            {restaurantes?.map((item) => (
                <Restaurante restaurante={item} key={item.id} />
            ))}
            {voltaPagina && <button onClick={() => verPagina(voltaPagina)}>Página Anterior</button>}
            {proximaPagina && <button onClick={() => verPagina(proximaPagina)}>Próxima Página</button>}
        </section>
    );
};

export default ListaRestaurantes;
