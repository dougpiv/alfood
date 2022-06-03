import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../../http";
import IPrato from "../../../../interfaces/IPrato";
import IRestaurante from "../../../../interfaces/IRestaurante";
import ITag from "../../../../interfaces/ITag";

export default function FormularioPrato() {
    const [nomePrato, setNomePrato] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tags, setTags] = useState<ITag[]>([]);
    const [tag, setTag] = useState("");
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
    const [restaurante, setRestaurante] = useState<Number>(0);
    const [imagem, setImagem] = useState<File | undefined>(undefined);
    const navigate = useNavigate();
    const parametros = useParams();

    useEffect(() => {
        if (parametros.id) {
            http.get<IPrato>(`pratos/${parametros.id}/`).then((result) => {
                setNomePrato(result.data.nome);
                setDescricao(result.data.descricao);
                setTag(result.data.tag);
                setRestaurante(result.data.restaurante);
            });
        }
    }, [parametros]);

    useEffect(() => {
        http.get<{ tags: ITag[] }>("tags/").then((result) => setTags(result.data.tags));
        http.get<IRestaurante[]>("restaurantes/").then((result) => setRestaurantes(result.data));
    }, []);

    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
        const formData = new FormData();
        formData.append("nome", nomePrato);
        formData.append("descricao", descricao);
        formData.append("restaurante", restaurante.toString());
        formData.append("tag", tag);

        if (imagem) {
            formData.append("imagem", imagem);
        }
        if (parametros.id) {
            formData.append("id", parametros.id);
            http.request({
                url: `pratos/${parametros.id}/`,
                method: "PUT",
                headers: {
                    "Content-type": "multipart/form-data",
                },
                data: formData,
            })
                .then(() => {
                    alert("Prato atualizado com sucesso");
                    navigate("/admin/pratos");
                })
                .catch((error) => {
                    alert("Erro no cadastro " + error);
                });
        } else {
            http.request({
                url: "pratos/",
                method: "POST",
                headers: {
                    "Content-type": "multipart/form-data",
                },
                data: formData,
            })
                .then(() => {
                    setDescricao("");
                    setTag("");
                    setImagem(undefined);
                    setRestaurante(0);
                    setNomePrato("");
                    alert("Prato cadastrado com sucesso");
                    navigate("/admin/pratos");
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
                    Formulário de Pratos
                </Typography>
                <Box component="form" sx={{ width: "100%" }} onSubmit={(evento: React.FormEvent<HTMLFormElement>) => aoSubmeterForm(evento)}>
                    <TextField
                        value={nomePrato}
                        onChange={(evento) => setNomePrato(evento.target.value)}
                        label="Nome do Prato"
                        variant="standard"
                        fullWidth
                        required
                        margin="dense"
                    />
                    <TextField
                        value={descricao}
                        onChange={(evento) => setDescricao(evento.target.value)}
                        label="Descrição do Prato"
                        variant="standard"
                        fullWidth
                        required
                        margin="dense"
                    />

                    <FormControl margin="dense" fullWidth>
                        <InputLabel id="select-tag">Tag</InputLabel>
                        <Select labelId="select-tag" value={tag} onChange={(evento) => setTag(evento.target.value)}>
                            {tags.map((tag) => (
                                <MenuItem value={tag.value} key={tag.id}>
                                    {tag.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl margin="dense" fullWidth>
                        <InputLabel id="select-restaurante">Restaurante</InputLabel>
                        <Select labelId="select-restaurante" value={restaurante} onChange={(evento) => setRestaurante(Number(evento.target.value))}>
                            {restaurantes.map((restaurante) => (
                                <MenuItem value={restaurante.id} key={restaurante.id}>
                                    {restaurante.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <input type="file" onChange={(evento) => setImagem(evento.target.files ? evento.target.files[0] : undefined)}></input>

                    <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">
                        Salvar
                    </Button>
                </Box>
            </Box>
        </>
    );
}
