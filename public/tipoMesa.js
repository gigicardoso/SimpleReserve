// Abrir modal ao clicar no botão + 
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnAddMesa').addEventListener('click', function() {
    document.getElementById('addMesaModal').style.display = 'block';
  });
  
  // Fechar modal ao clicar no X
  document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('addMesaModal').style.display = 'none';
  });
  
  // Fechar modal ao clicar fora dele
  window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('addMesaModal')) {
      document.getElementById('addMesaModal').style.display = 'none';
    }
  });

  // Adicionar evento de exclusão para os botões existentes
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function() {
      const mesaId = this.getAttribute('data-id');
      if (confirm('Tem certeza que deseja excluir este tipo de mesa?')) {
        fetch(`/tipoMesa/${mesaId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (response.ok) {
            this.closest('tr').remove();
            // Verificar se a tabela está vazia
            if (document.querySelectorAll('.mesa-table tbody tr').length === 0) {
              const tbody = document.querySelector('.mesa-table tbody');
              const emptyRow = document.createElement('tr');
              emptyRow.className = 'empty-message-row';
              emptyRow.innerHTML = `
                <td colspan="2" class="empty-message">
                  Nenhum tipo de mesa cadastrado. Clique no botão <i class="fas fa-plus"></i> para adicionar.
                </td>
              `;
              tbody.appendChild(emptyRow);
            }
            showNotification('Tipo de mesa excluído com sucesso!', 'success');
          } else {
            throw new Error('Erro ao excluir tipo de mesa');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          showNotification('Erro ao excluir tipo de mesa', 'error');
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
