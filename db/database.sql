create database if not exists simplereserve;

use simplereserve;
-- TABELA PERMISSAO --
create table permissao(
cod integer not null auto_increment,
descricao varchar (25),
cadastrarSala boolean not null default 0,
cadastrarUsuario boolean not null default 0,
editarUsuario boolean not null default 0,
arquivarUsuario boolean not null default 0,
editarSalas boolean not null default 0,
primary key (cod));

-- TABELA LOCALIZACAO --
create table localizacao(
cod integer not null auto_increment,
bloco varchar(14) not null,
andar integer not null ,
numero integer not null unique,
primary key (cod)
);

-- TABELA SALAS --
use simplereserve;
create table salas(
cod integer not null auto_increment,
descricao varchar(30),
ocupado boolean,
qtdade_lugares integer,
tipo_mesa varchar(15),
mesa_canhoto integer,
projetor boolean default 1,
arcondicionado boolean default 1,
quadro boolean default 1,
computador integer,
acessebilidade boolean default 0,
qtdade_mesa_acessivel integer,
orientacao blob, //tem que dropar isso aqui
obs varchar(100),
recursos varchar(150),
imagem_sala blob,
tipo_sala varchar(12),
localizacao integer,
primary key (cod),
foreign key (localizacao) references localizacao (cod)
);

-- TABELA AGENDA --
create table agenda(
cod integer not null auto_increment,
nome_evento varchar(85) not null,
obs varchar(30),
date date not null,
hora_inicio time not null,
hora_final time not null,
cod_usuarios integer not null auto_increment,
cod_salas integer not null auto_increment,
primary key (cod),
foreign key (cod_usuarios) references usuario(cod),
foreign key (cod_salas) references salas(cod)

);

-- TABELA USUARIO --
use simplereserve;
create table usuario(
cod integer not null auto_increment,
login integer not null,
senha char(8) not null,
nome varchar(50) not null,
email varchar(40),
permissao integer not null,
primary key (cod),
foreign key (permissao) references permissao (cod)
);