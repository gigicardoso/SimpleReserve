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
qtdade_lugares integer not null,
tipo_mesa varchar(15) not null,
mesa_canhoto integer not null,
projetor boolean default 1 not null,
arcondicionado boolean default 1 not null,
quadro boolean default 1 not null,
computador integer not null,
acessibilidade boolean default 0 not null,
qtdade_mesa_acessivel integer not null,
obs varchar(100),
recursos varchar(150),
imagem_sala blob,
tipo_sala varchar(12) not null,
localizacao integer not null,
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
cod_usuarios integer not null,
cod_salas integer not null,
primary key (cod),
foreign key (cod_usuarios) references usuario(cod),
foreign key (cod_salas) references salas(cod)

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