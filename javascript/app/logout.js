$(function () {
  $('#button-logout').click(function () {
    if (window.confirm('¿Estas seguro que quieres cerrar sesión?')) {
      const contentButton = $('#button-logout').html();
      const dataForm = [{name: 'option', value: 'Logout'}];

      $.ajax({
        url : '../controllers/c_login.php',
        type: 'post',
        data: dataForm,
        beforeSend: function () {
          $('#button-logout').attr('disabled', true);
          $('#button-logout').html('<i class="fas fa-spin fa-spinner"></i>');
        },
        success: function (response) {
          if (response == 'sesión finalizada') {
            location.reload();
          }
        },
        error: function (error) {
          showAlert('<i class="fas fa-times mr-2"></i> Ha ocurrido un error.', 'danger');
          console.log(error.statusText);
        },
        timeout: 5000
      })
      .always(function () {
        $('#button-logout').attr('disabled', false);
        $('#button-logout').html(contentButton);
      });
    }
  });
});