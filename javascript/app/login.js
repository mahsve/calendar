$(function () {
  $('#login-button').click(function () {
    const contentButton = $('#login-button').html();

    let dataForm = $('#form-login').serializeArray();
    dataForm.push({name: 'option', value: 'Login'});

    if ($('#username').val() != '' && $('#password').val() != '') {
      $.ajax({
        url: 'controllers/c_login.php',
        type: 'post',
        data: dataForm,
        beforeSend: function () {
          $('#form-login input').attr('disabled', true);
          $('#login-button').attr('disabled', true);
          $('#login-button').html('<i class="fas fa-spin fa-spinner"></i><span class="mx-1">Cargando...</span>');
        },
        success: function (response) {
          if (response == 'inicio de sesión exitoso') {
            location.href = 'views/';
          } else if (response == 'usuario/contraseña incorrecta') {
            showAlert('<i class="fas fa-user-times mr-2"></i> Usuario y/o contraseña erronea.', 'danger');
            $('#password').val('');
          } else {
            showAlert('<i class="fas fa-times mr-2"></i> Error al procesar la solicitud.', 'danger');
          }
        },
        error: function (error) {
          showAlert('<i class="fas fa-times mr-2"></i> Ha ocurrido un error.', 'danger');
          console.log(error.statusText);
        },
        timeout: 15000,
      })
      .always(function() {
        $('#form-login input').attr('disabled', false);
        $('#login-button').attr('disabled', false);
        $('#login-button').html(contentButton);
      });
    } else {
      showAlert('<i class="fas fa-exclamation mr-2"></i> Los campos no pueden estar vacíos.', 'warning');
    }
  });
});