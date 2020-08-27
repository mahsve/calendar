function showAlert(message, typeMsg) {
  const idAlert = 'alert-id-'+Math.random().toString().replace('.', '');

  let contentAlert = '';
  contentAlert += '<div id='+idAlert+' class="alert alert-'+typeMsg+' alert-dismissible fade show px-3 py-2 m-0 mt-3" role="alert">';
    contentAlert += message;

    contentAlert += '<button type="button" class="d-flex align-items-center close h-100 px-3 py-2" data-dismiss="alert" aria-label="Close">';
      contentAlert += '<i class="fas fa-times small"></i>';
    contentAlert += '</button>';
  contentAlert += '</div>';

  $('#message-container').html(contentAlert);
  setTimeout(() => { $('#'+idAlert).alert('close'); }, 3000);
}