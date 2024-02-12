// Cargar el contenido del modal desde modalVictoria.html
fetch('modalVictoria.html')
  .then(response => response.text())
  .then(html => {
    // Crear un elemento div para contener el contenido del modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = html;
    // Obtener el modal del contenedor
    const modal = modalContainer.querySelector('.modal');
    // Agregar el modal al cuerpo del documento
    document.body.appendChild(modal);
    // Crear una instancia del Modal de Bootstrap
    const modalInstance = new bootstrap.Modal(modal);
    // Mostrar el modal
    modalInstance.show();
  })
  .catch(error => {
    console.error('Error al cargar el contenido del modal:', error);
  });
