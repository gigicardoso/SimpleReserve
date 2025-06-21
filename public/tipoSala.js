// JS do Gerenciador de Tipos de Sala
console.log('tipoSala.js carregado');
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnAddTipoSala').addEventListener('click', function() {
    document.getElementById('addTipoSalaModal').style.display = 'block';
  });
  // Fechar modal ao clicar no X
  document.querySelectorAll('.close').forEach(function(btn) {
    btn.addEventListener('click', function() {
      this.closest('.modal').style.display = 'none';
    });
  });
  // Fechar modal ao clicar fora dele
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
  // Adicionar evento de exclusão para os botões existentes
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function() {
      const tipoSalaId = this.getAttribute('data-id');
      if (confirm('Tem certeza que deseja excluir este tipo de sala?')) {
        fetch(`/tipoSala/${tipoSalaId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (response.ok) {
            this.closest('tr').remove();
            // Verificar se a tabela está vazia
            if (document.querySelectorAll('.tipo-sala-table tbody tr').length === 0) {
              const tbody = document.querySelector('.tipo-sala-table tbody');
              const emptyRow = document.createElement('tr');
              emptyRow.className = 'empty-message-row';
              emptyRow.innerHTML = `
                <td colspan="2" class="empty-message">
                  Nenhum tipo de sala cadastrado. Clique no botão <i class="fas fa-plus"></i> para adicionar.
                </td>
              `;
              tbody.appendChild(emptyRow);
            }
            showNotification('Tipo de sala excluído com sucesso!', 'success');
          } else {
            throw new Error('Erro ao excluir tipo de sala');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          showNotification('Erro ao excluir tipo de sala', 'error');
        });
      }
    });
  });
  // Função para mostrar notificação
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = type === 'success' ? '#84925b' : '#dc3545';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeIn 0.3s';
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    // Remover notificação após 3 segundos
    setTimeout(() => {
      notification.style.animation = 'fadeIn 0.3s reverse';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});
