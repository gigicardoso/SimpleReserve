document.addEventListener('DOMContentLoaded', function() {
  // Carrega o template de cadastro
  const templateSource = document.getElementById('cadastroBlocoTemplate').innerHTML;
  const template = Handlebars.compile(templateSource);
  const formContainer = document.getElementById('formContainer');
  
  // Injeta o formulário no container
  formContainer.innerHTML = template({});
  const formElement = document.querySelector('.form-container');
  
  // Elementos do DOM
  const btnAddBloco = document.getElementById('btnAddBloco');
  const addIcon = document.getElementById('addIcon');
  
  // Alternar visibilidade do formulário
  btnAddBloco.addEventListener('click', function() {
    const isVisible = formElement.classList.contains('show');
    
    if (isVisible) {
      formElement.classList.remove('show');
      addIcon.className = 'fas fa-plus';
      btnAddBloco.setAttribute('title', 'Adicionar bloco');
    } else {
      formElement.classList.add('show');
      addIcon.className = 'fas fa-minus';
      btnAddBloco.setAttribute('title', 'Fechar formulário');
    }
  });
  
  // Manipulação do formulário
  const blocoForm = document.getElementById('blocoForm');
  if (blocoForm) {
    blocoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      fetch(this.action, {
        method: this.method,
        body: new FormData(this)
      })
      .then(response => {
        if (response.ok) {
          showNotification('Bloco cadastrado com sucesso!', 'success');
          // Fechar formulário e recarregar a página
          formElement.classList.remove('show');
          addIcon.className = 'fas fa-plus';
          btnAddBloco.setAttribute('title', 'Adicionar bloco');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          throw new Error('Erro ao cadastrar bloco');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('Erro ao cadastrar bloco', 'error');
      });
    });
  }
  
  // Manipulação de exclusão
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const blocoId = this.getAttribute('href').split('/').pop();
      
      if (confirm('Tem certeza que deseja excluir este bloco?')) {
        fetch(`/bloco/${blocoId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (response.ok) {
            this.closest('tr').remove();
            // Verificar se a tabela está vazia
            if (document.querySelectorAll('.user-table tbody tr').length === 0) {
              const tbody = document.querySelector('.user-table tbody');
              const emptyRow = document.createElement('tr');
              emptyRow.className = 'empty-message-row';
              emptyRow.innerHTML = `
                <td colspan="2" class="empty-message">
                  Nenhum bloco cadastrado. Clique no botão <i class="fas fa-plus"></i> para adicionar.
                </td>
              `;
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
    notification.className = `notification ${type}`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'fadeIn 0.3s reverse';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});