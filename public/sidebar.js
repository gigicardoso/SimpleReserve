document.addEventListener("DOMContentLoaded", function() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarItems = document.querySelectorAll('.sidebar-menu li');
  
  // Ativação dos itens do menu
  sidebarItems.forEach(item => {
    item.addEventListener('click', function() {
      sidebarItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      const section = this.getAttribute('data-section');
      console.log(`Seção selecionada: ${section}`);
      // Aqui você pode adicionar a lógica para carregar o conteúdo correspondente
    });
  });
  
  // Efeito de hover persistente em desktop
  function handleSidebarHover() {
    if (window.innerWidth > 768) {
      let hoverTimeout;
      
      sidebar.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        sidebar.style.width = 'var(--sidebar-width)';
      });
      
      sidebar.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          sidebar.style.width = 'var(--sidebar-collapsed-width)';
        }, 300);
      });
    }
  }
  
  // Inicializa e monitora redimensionamento
  handleSidebarHover();
  window.addEventListener('resize', handleSidebarHover);
});
