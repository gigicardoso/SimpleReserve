// JS do bloco.hbs
// Abrir modal ao clicar no botão + 
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnAddBloco').addEventListener('click', function() {
    document.getElementById('addBlocoModal').style.display = 'block';
  });
  
  // Fechar modal ao clicar no X
  document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('addBlocoModal').style.display = 'none';
  });
  
  // Fechar modal ao clicar fora dele
  window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('addBlocoModal')) {
      document.getElementById('addBlocoModal').style.display = 'none';
    }
  });

  // Adicionar evento de exclusão para os botões existentes
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function() {
      const blocoId = this.getAttribute('data-id');
      if (confirm('Tem certeza que deseja excluir este bloco?')) {
        fetch(`/bloco/${blocoId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (response.ok) {
            this.closest('tr').remove();
            // Verificar se a tabela está vazia
            if (document.querySelectorAll('.bloco-table tbody tr').length === 0) {
              const tbody = document.querySelector('.bloco-table tbody');
              const emptyRow = document.createElement('tr');
              emptyRow.className = 'empty-message-row';
              emptyRow.innerHTML = `
                <td colspan=\"2\" class=\"empty-message\">\n                  Nenhum bloco cadastrado. Clique no botão <i class=\"fas fa-plus\"></i> para adicionar.\n                </td>\n              `;
              tbody.appendChild(emptyRow);
            }
            showNotification('Bloco excluído com sucesso!', 'success');
          } else {
            throw new Error('Erro ao excluir bloco');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          showNotification('Erro ao excluir bloco', 'error');
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
    notification.innerHTML = `<i class=\"fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}\"></i> ${message}`;
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
