import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../../http";
import IRestaurante from "../../../../interfaces/IRestaurante";

export default function FormularioRestaurante() {
    const [nomeRestaurante, setNomeRestaurante] = useState("");

    const parametros = useParams();

    useEffect(() => {
        if (parametros.id) {
            http.get<IRestaurante>(`restaurantes/${parametros.id}/`).then((result) => setNomeRestaurante(result.data.nome));
        }
    }, [parametros]);

    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();

        if (parametros.id) {
            http.put(`restaurantes/${parametros.id}/`, { nome: nomeRestaurante })
                .then(() => {
                    alert("Restaurante atualizado com sucesso");
                })
                .catch((error) => {
                    alert("Erro no cadastro " + error);
                });
        } else {
            http.post("restaurantes/", { nome: nomeRestaurante })
                .then(() => {
                    alert("Restaurante cadastrado com sucesso");
                })
                .catch((error) => {
                    alert("Erro no cadastro " + error);
                });
        }
    };
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                <Typography component="h1" variant="h6">
                    Formulário de Restaurantes
                </Typography>
                <Box component="form" sx={{ width: "100%" }} onSubmit={(evento: React.FormEvent<HTMLFormElement>) => aoSubmeterForm(evento)}>
                    <TextField
                        value={nomeRestaurante}
                        onChange={(evento) => setNomeRestaurante(evento.target.value)}
                        label="Nome do Restaurante"
                        variant="standard"
                        fullWidth
                        required
                    />
                    <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">
                        Salvar
                    </Button>
                </Box>
            </Box>
        </>
    );
}
