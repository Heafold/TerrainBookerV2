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
  
  function confirmDelete(userId, username) {
    const modal = document.getElementById('deleteUserModal');
    const form = modal.querySelector('form');
    const paragraph = modal.querySelector('p');
  
    form.action = `/admin/users/delete/${userId}`;
    paragraph.textContent = `Êtes-vous sûr de vouloir supprimer cet utilisateur : ${username} ?`;
  
    openModal('deleteUserModal');
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
  