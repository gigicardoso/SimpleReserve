var express = require("express");
var router = express.Router();
const path = require("path");
const db = require("../db/db");
const tipoSalaController = require("../controllers/tipoSalaController");
const tipoMesaController = require("../controllers/tipoMesaController");
const blocosController = require("../controllers/blocosController");
const andarBlocoController = require("../controllers/andarBlocoController");
const usuariosController = require("../controllers/usuariosController");

/* Rota para Home */
router.get("/", (req, res) => {
  res.render("index", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isAgenda: true,
  });
});

// Para login
router.get("/login", (req, res) => {
  res.render(path.join(__dirname, "..", "views", "login.hbs"), {
    layout: "layout",
    showSidebar: false,
    showLogo: false,
  });
});

// Rota para cadastro de usuário
router.get("/cadastrousuario", (req, res) => {
  res.render("cadastroUsuarios", {
    layout: "layout",
    showSidebar: false, // não mostrar sidebar
    showLogo: false,    // não mostrar logo
    isCadastroUsuario: true,
  });
});

router.post("/cadastrousuario", usuariosController.criarUsuario);

router.get("/adm", (req, res) => {
  res.render("adm/gerenciadorAdm", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

// Listagem de tipos de mesa
router.get("/tipoMesa", tipoMesaController.listarMesas);

// Exclusão de tipo de mesa
router.get("/excluirMesa/:id", tipoMesaController.deletarMesa);

// Edição de tipo de mesa
router.get("/editarMesa/:id", tipoMesaController.formEditarMesa);
router.post("/editarMesa/:id", tipoMesaController.atualizarMesa);

// Listagem de tipos de sala
router.get("/tipoSala", tipoSalaController.listarTipoSalas);

// Exclusão de tipo de sala
router.get("/excluirTipoSala/:id", tipoSalaController.deletarTipoSala);

// Edição de tipo de sala
router.get("/editarTipoSala/:id", tipoSalaController.formEditarTipoSala);
router.post("/editarTipoSala/:id", tipoSalaController.atualizarTipoSala);



//Listagem de blocos
router.get("/bloco", blocosController.listarBlocos);

//Exclusão de andar
router.get("/excluirBloco/:id", blocosController.deletarBloco);

//Edição de andar
router.get("/editarBloco/:id", blocosController.formEditarBloco);
router.post("/editarBloco/:id", blocosController.atualizarBloco);


//Listagem de andares
router.get("/andares", andarBlocoController.listarAndar);

//Exclusão de andar
router.get("/excluirAndar/:id", andarBlocoController.deletarAndar);

//Edição de andar
router.get("/editarAndar/:id", andarBlocoController.formEditarAndar);
router.post("/editarAndar/:id", andarBlocoController.atualizarAndar);

// Listar andares por bloco
router.get("/andares/:id_bloco", andarBlocoController.getAndaresPorBloco);

//Cadastro de andar
router.get("/andar", andarBlocoController.formCadastroAndar);
router.post("/andar", andarBlocoController.criarAndar);

// Listar usuários 
router.get("/usuariosadm", usuariosController.listarUsuarios);

// Excluir usuário
router.get("/excluirUsuario/:id", usuariosController.deletarUsuario);

// Edição de usuário
router.get("/editarUsuario/:id", usuariosController.formEditarUsuario);
router.post("/editarUsuario/:id", usuariosController.atualizarUsuario);

router.get("/reservasadm", (req, res) => {
  res.render("adm/reservas", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/salas", (req, res) => {
  res.render("adm/salas", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isGerenciador: true,
  });
});

router.get("/reservasDoDia", (req, res) => {
  res.render("reservasDoDia", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isReservasDia: true,
  });
});


// Rotas para tela de cadastro de bloco
router.get("/adicionabloco", (req, res) => {
  res.render("adm/adicionabloco", {
    layout: "layout",
    showSidebar: true,
    showLogo: true,
    isAdicionarBloco: true,
    breadcrumb: [
      { title: 'Gerenciador ADM', path: '/adm' },
      { title: 'Blocos', path: '/bloco' },
      { title: 'Adicionar Bloco', path: '/adicionabloco' }
    ]
  });
});



// Rota para tela dedicada de cadastro de andar (em /mais/adicionaandar) usando Sequelize
const { sequelize } = require("../db/db");

router.get("/mais/adicionaandar", (req, res) => {
  sequelize.query('SELECT * FROM blocos', { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      res.render("mais/adicionaAndar", {
        layout: "layout",
        showSidebar: true,
        showLogo: true,
        blocos: results,
        isAdicionarAndar: true,
        breadcrumb: [
          { title: 'Gerenciador ADM', path: '/adm' },
          { title: 'Andares', path: '/andares' },
          { title: 'Adicionar Andar', path: '/mais/adicionaandar' }
        ]
      });
    })
    .catch(err => {
      res.status(500).send('Erro ao buscar blocos');
    });

});

router.get("/mais/adicionamesa", (req, res) => {
  sequelize.query('SELECT * FROM blocos', { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      res.render("mais/adicionaMesa", {
        layout: "layout",
        showSidebar: true,
        showLogo: true,
        blocos: results,
        isAdicionarAndar: true,
        breadcrumb: [
          { title: 'Gerenciador ADM', path: '/adm' },
          { title: 'Tipos de Mesa', path: '/tipoMesa' },
          { title: 'Adicionar Tipo', path: '/mais/adicionamesa' }
        ]
      });
    })
    .catch(err => {
      res.status(500).send('Erro ao buscar cadastro de tipo de mesa');
    });

});

router.get("/mais/adicionasala", (req, res) => {
  sequelize.query('SELECT * FROM blocos', { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      res.render("mais/adicionaSala", {
        layout: "layout",
        showSidebar: true,
        showLogo: true,
        blocos: results,
        isAdicionarAndar: true,
        breadcrumb: [
          { title: 'Gerenciador ADM', path: '/adm' },
          { title: 'Tipos de Sala', path: '/tipoSala' },
          { title: 'Adicionar Tipo', path: '/mais/adicionasala' }
        ]
      });
    })
    .catch(err => {
      res.status(500).send('Erro ao buscar cadastro de Sala');
    });

});

//Edição de andares
router.get("/editarAndar/:id", andarBlocoController.formEditarAndar);
router.post("/editarAndar/:id", andarBlocoController.atualizarAndar);

//Edição dos blocos
router.get("/editarBloco/:id", blocosController.formEditarBloco);
router.post("/editarBloco/:id", blocosController.atualizarBloco);

// ...rotas POST para criação de tipoSala, tipoMesa e bloco...
router.post("/tipoSala", tipoSalaController.criarTipoSala);
router.post("/tipoMesa", tipoMesaController.criarMesa);
router.post("/bloco", blocosController.criarBloco);

module.exports = router;
