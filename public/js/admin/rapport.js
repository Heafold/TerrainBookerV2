function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    }
  }
  
  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  function confirmDelete(rapportId) {
    const modal = document.getElementById('deleteRapportModal');
    const form = modal.querySelector('form');
    const paragraph = modal.querySelector('p');
  
    form.action = `/admin/rapports/delete/${rapportId}`;
    paragraph.textContent = `Êtes-vous sûr de vouloir supprimer cette réservation ?`;
  
    openModal('deleteRapportModal');
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    var closeButtons = document.querySelectorAll('.closeButton');
    closeButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        closeModal(btn.closest('.modal').id);
      });
    });
  
    window.addEventListener('click', function(event) {
      if (event.target.className === 'modal') {
        closeModal(event.target.id);
      }
    });
  });
  