// JS do Gerenciador de Usuários
// Abrir modal ao clicar no botão +
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnAddUser").addEventListener("click", function () {
    document.getElementById("addUserModal").style.display = "block";
  });
  // Fechar modal ao clicar no X
  document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("addUserModal").style.display = "none";
  });
  // Fechar modal ao clicar fora dele
  window.addEventListener("click", function (event) {
    if (event.target == document.getElementById("addUserModal")) {
      document.getElementById("addUserModal").style.display = "none";
    }
  });
  // Processar formulário (simulação)
  document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();
    // Obter valores do formulário
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    // Remover mensagem de lista vazia se existir
    const emptyRow = document.querySelector(".empty-message-row");
    if (emptyRow) {
      emptyRow.remove();
    }
    // Adicionar novo usuário à tabela
    const tbody = document.querySelector(".user-table tbody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>${senha}</td>
      <td class="actions">
        <button class="btn-action btn-edit"><i class="fas fa-edit"></i> Editar</button>
        <button class="btn-action btn-delete"><i class="fas fa-trash-alt"></i> Excluir</button>
      </td>
    `;
    tbody.appendChild(newRow);
    // Adicionar evento de exclusão
    newRow.querySelector(".btn-delete").addEventListener("click", function () {
      newRow.remove();
      // Mostrar mensagem de lista vazia se não houver mais usuários
      if (document.querySelectorAll(".user-table tbody tr").length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.className = "empty-message-row";
        emptyRow.innerHTML = `
          <td colspan="4" class="empty-message">
            Nenhum usuário cadastrado. Clique no botão <i class="fas fa-plus"></i> para adicionar.
          </td>
        `;
        tbody.appendChild(emptyRow);
      }
    });
    // Criar notificação visual
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "#4caf50";
    notification.style.color = "white";
    notification.style.padding = "15px 25px";
    notification.style.borderRadius = "8px";
    notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    notification.style.zIndex = "1000";
    notification.style.animation = "fadeIn 0.3s";
    notification.innerHTML = `<i class="fas fa-check-circle"></i> Usuário ${name} cadastrado com sucesso!`;
    document.body.appendChild(notification);
    // Fechar modal
    document.getElementById("addUserModal").style.display = "none";
    // Limpar formulário
    this.reset();
    // Remover notificação após 3 segundos
    setTimeout(() => {
      notification.style.animation = "fadeIn 0.3s reverse";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  });
});
