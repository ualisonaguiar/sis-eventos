CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,

	nome VARCHAR(200),
	email VARCHAR(200),
	cargo VARCHAR(150),
	unidade_sigla VARCHAR(4),
	unidade_nome VARCHAR(200)
);