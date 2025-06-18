create database if not exists sr;

use sr;
-- TABELA PERMISSAO --
create table permissao(
id_permissao integer not null auto_increment,
descricao varchar (25),
cadSala boolean not null default 0,
cadUser boolean not null default 0,
edUser boolean not null default 0,
arqUser boolean not null default 0,
edSalas boolean not null default 0,
primary key (id_permissao));

-- TABELA BLOCOS --
create table blocos(
id_bloco integer not null auto_increment,
descricao varchar(15),
primary key (id_bloco)
);

-- TABELA BLOCOS --
create table andar_bloco(
id_andar integer not null auto_increment,
id_bloco integer,
descricao varchar(15),
primary key (id_andar),
foreign key (id_bloco) references blocos (id_bloco)
);

-- TABELA TIPO SALA --
create table tipo_sala(
id_tipo integer not null auto_increment,
descricao varchar(50),
primary key (id_tipo)
);

-- TABELA TIPO MESA --
create table tipo_mesa(
id_mesa integer not null auto_increment,
descricao varchar(75),
primary key (id_mesa)
);

-- TABELA SALAS --
use sr;
create table salas(
id_salas integer not null auto_increment,
nome_salas varchar(65),
descricao varchar(100),
capacidade integer not null,
tipo_mesa varchar(15) not null,
mesa_canhoto integer not null,
projetor boolean default 1 not null,
ar_cond boolean default 1 not null,
quadro boolean default 1 not null,
computador integer not null,
acess boolean default 0 not null,
mesa_acess integer not null,
id_tipo integer not null,
id_andar integer not null,
id_mesa integer not null,
imagem_sala varchar(150),
primary key (id_salas),
foreign key (id_tipo) references tipo_mesa (id_tipo),
foreign key (id_andar) references andar_bloco (id_andar),
foreign key (id_mesa) references tipo_mesa (id_mesa)
);

-- TABELA AGENDA --
create table agenda(
id_agenda integer not null auto_increment,
nome_evento varchar(35) not null,
descricao varchar(60),
data date not null,
hora_inicio time not null,
hora_final time not null,
id_user integer not null,
id_salas integer not null,
primary key (cod),
foreign key (id_user) references usuario (id_user),
foreign key (id_salas) references salas (id_salas)
);

-- TABELA USUARIO --
use sr;
create table usuario(
id_user integer not null auto_increment,
senha char(8) not null,
nome varchar(50) not null,
email varchar(50),
id_permissao integer not null,
primary key (id_user),
foreign key (id_permissao) references permissao (id_permissao)
);