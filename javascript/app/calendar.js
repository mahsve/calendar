$(function () {
  const dataConfig = {
    loadEntireCalendar: true, // Load full calendar or just the days of the selected month.
    currentDay: new Date().getDate(), // Always save the current day.
    currentMonth: new Date().getMonth(), // Always save the current month: [0 Juanary | 11 December].
    currentYear: new Date().getFullYear(), // Always save the current year.
    namesOfTheDays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    namesOfTheMonths: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  }
  
  let selectedDay = ''; // When the user clicks on a day, this is saved in this variable.
  let dataEvents  = []; // Saves all data about the event.
  let idEventEdit = ''; // When the user tries edit a event, the id is saved in this variable can to save the changes.
  let eventOption = '';
  let eventElement = '';
  let sqlQuery = { dateStart: '', dateEnd: '' }; // Deadlines for sql query.
  let monthOfTheCalendar  = dataConfig.currentMonth; // It is the month to manage in the calendar.
  let yearOfTheCalendar   = dataConfig.currentYear; // It is the year to manage in the calendar.
  
  const noEvents = (
    '<div class="border rounded bg-white text-center p-3 my-2">'+
      '<i class="fas fa-clock" style="font-size: 50px;"></i>'+
      '<p class="m-0"><b>No hay eventos</b></p>'+
    '</div>'
  );


  /* ==================== Start the primary controls ==================== */
  const toChangeDataOfTheDate = () => {
    // Change label or description of the calendar.
    $('#label-month').html(dataConfig.namesOfTheMonths[monthOfTheCalendar]);
    $('#label-year').html(yearOfTheCalendar);

    // Change values of the input of the calendar.
    $('#selected-month').val(monthOfTheCalendar);
    $('#selected-year').val(yearOfTheCalendar);

    $('#calendar-table tbody').hide();
    loadCalendar(); // It is a function to load the calendar when needed.
  };

  $('#go-today').click(() => {
    if (!(monthOfTheCalendar == dataConfig.currentMonth && yearOfTheCalendar == dataConfig.currentYear)) {
      monthOfTheCalendar = dataConfig.currentMonth;
      yearOfTheCalendar = dataConfig.currentYear;
      toChangeDataOfTheDate();
    }
  });

  $('#last-month').click(() => {
    // When the month is January, the value returns to December and subtracts 1 from the year.
    if (monthOfTheCalendar == 0) {
      monthOfTheCalendar = 11;
      yearOfTheCalendar--;
    } else {
      monthOfTheCalendar--;
    }
    toChangeDataOfTheDate();
  });

  $('#next-month').click(() => {
    // When the month is December, the value returns to January and adds 1 from the year.
    if (monthOfTheCalendar == 11) {
      monthOfTheCalendar = 0;
      yearOfTheCalendar++;
    } else {
      monthOfTheCalendar++;
    }
    toChangeDataOfTheDate();
  });

  $('#last-year').click(() => {
    yearOfTheCalendar--;
    toChangeDataOfTheDate();
  });

  $('#next-year').click(() => {
    yearOfTheCalendar++;
    toChangeDataOfTheDate();
  });
  /* ==================== End the primary controls ==================== */

  /* ==================== Start the second controls ==================== */
  $('#sh-description').dblclick(() => {
    $('#description-labels').hide();
    $('#description-inputs').show();
  });

  const toHideShDescription = accept => {
    $('#description-labels').show();
    $('#description-inputs').hide();
    if(accept) toChangeDataOfTheDate();
  }

  $('#accept-changes-move').click(() => {
    monthOfTheCalendar  = parseInt($('#selected-month').val());
    yearOfTheCalendar   = parseInt($('#selected-year').val());
    toHideShDescription(true);
  });

  $('#cancel-changes-move').click(() => {
    $('#selected-month').val(monthOfTheCalendar);
    $('#selected-year').val(yearOfTheCalendar);
    toHideShDescription(false);
  });
  /* ==================== End the second controls ==================== */


  const loadCalendar = () => {
    const dataOfTheMonth = toGetDataOfTheMonth(); // Main data about the calendar.
    let positionOfTheDayInTheWeek = 0; // This will have the position of the day in the week while creating the calendar [0 Sunday | 1 Monday | 2 Tuesday | ...].
    let calendarContent = ''; // All content of the calendar.


    // Start code | construction of the calendar.
    for (let conts = 0; conts < dataOfTheMonth.totalDays; conts++) {
      // Every time the week starts on Sunday [positionOfTheDayInTheWeek == 0] a new 'tr' will open.
      if (positionOfTheDayInTheWeek == 0) { calendarContent += '<tr>'; }


      // When the month does not start on Sunday, it is filled with the days of the last month.
      if (conts < dataOfTheMonth.dayStart && conts == 0) {
        // The total number of days of the last month to add to the calendar.
        let contsLastMonth = dataOfTheMonth.totalDaysLast - dataOfTheMonth.dayStart;

        // Save the start date to consult [ternary].
        dataConfig.loadEntireCalendar ? toSaveDatesStartEnd( (contsLastMonth + 1), 'start') : toSaveDatesStartEnd( 1, 'start'); 

        for (let l = 0; l < dataOfTheMonth.dayStart; l++) {
          contsLastMonth++;
          positionOfTheDayInTheWeek++;
          dataConfig.loadEntireCalendar ? calendarContent += componentCalendarDay(contsLastMonth, 'start') : calendarContent += '<td></td>'; // [Ternary].
        }
      } else if (conts == 0) toSaveDatesStartEnd( 1, 'start');

      // It's load the day of the month.
      calendarContent += componentCalendarDay((conts + 1), 'middle');
      
      // When the month does not end on Sunday, it is filled with the days of the next month.
      if (positionOfTheDayInTheWeek < 6 && conts == (dataOfTheMonth.totalDays - 1)) {
        // Defines new counter for the days.
        let contsNextMonth = 0;
        
        for (let l = positionOfTheDayInTheWeek; l < 6; l++) {
          contsNextMonth++;
          positionOfTheDayInTheWeek++;
          dataConfig.loadEntireCalendar ? calendarContent += componentCalendarDay(contsNextMonth, 'end'): calendarContent += '<td></td>'; // [Ternary].
        }

        // Save the deadline to consult [ternary].
        dataConfig.loadEntireCalendar ? toSaveDatesStartEnd( contsNextMonth, 'end') : toSaveDatesStartEnd( dataOfTheMonth.totalDays, 'end'); 
      } else if (conts == (dataOfTheMonth.totalDays - 1)) toSaveDatesStartEnd( dataOfTheMonth.totalDays, 'end');


      /* As long as it is not Saturday, it will advance one day in the week, 
      otherwise it will return to Sunday to start a new week [Sunday 0 | Saturday 6 ]. [Ternary]. */
      positionOfTheDayInTheWeek < 6 ? positionOfTheDayInTheWeek++ : positionOfTheDayInTheWeek = 0;

      // When the value returns to 0, the week is closed in the calendar.
      if (positionOfTheDayInTheWeek == 0) { calendarContent += '</tr>'; }
    }
    // End code | construction of the calendar.
    

    // The content is added to the calendar.
    $('#calendar-table tbody').html(calendarContent);
    $('#calendar-table tbody').show(250);
    $('.event-list-modal').click(clickDaySelected);
    consultAllEvent();
  }


  // This function returns the data about the calendar.
  const toGetDataOfTheMonth = () => {
    let newFormatMonth = functionNewFormact(monthOfTheCalendar + 1);

    return {
      dayStart: new Date(String(yearOfTheCalendar)+'/'+newFormatMonth+'/01').getDay(), // The day start the month; [ Sunday 0, Monday 1, Tuesday 2, Wednesday 3, ...].
      totalDays: new Date(parseInt(yearOfTheCalendar), parseInt(newFormatMonth), 0).getDate(), // The number of days in the month; [28, 30, 31...].
      totalDaysLast: new Date(parseInt(yearOfTheCalendar), parseInt(newFormatMonth) - 1, 0).getDate() // The number of days in the last month; [28, 30, 31...] and add it if this is required.
    };
  }

  // Convert month or Day in a string, 7 => '07' || 31 => '31'; [Ternary].
  const functionNewFormact = number => number < 10 ? '0' + String(number) : String(number);


  // Contenido
  const componentCalendarDay = (dataDay, dataType) => {
    let year  = functionNewFormact(yearOfTheCalendar);
    let month = monthOfTheCalendar + 1;
    let day   = functionNewFormact(dataDay);

    controls = toDefineDate(year, month, dataDay, dataType);
    month = controls.month;
    year = controls.year;

    let today = ( year == dataConfig.currentYear && (month - 1) == dataConfig.currentMonth && dataDay == dataConfig.currentDay ) ? 'today' : ''; // [Ternary].
    
    return (
      '<td id="td-'+year+'-'+month+'-'+day+'" class="event-list-modal '+today+' p-0" data-year="'+year+'" data-month="'+month+'" data-day="'+day+'">'+
        '<p class="text-right m-0 px-2"><i class="icon-paste fas fa-share" style="display: none; font-size: 10px;"></i> '+day+'</p>'+
        '<div id="events-'+year+'-'+month+'-'+day+'" class="overflow-auto px-2" style="height: calc(100% - 24px);"></div>'+
      '</td>'
    );
  }

  const toDefineDate = (getYear, getMonth, dataDay, dataType) => {
    let year  = getYear;
    let month = getMonth;

    if (dataType == 'start' && dataDay == 1) {
      month = functionNewFormact(month);
    } else if (dataType == 'start' && dataDay != 1) {
      month = functionNewFormact(month == 1 ? 12 : month - 1);
      year  = functionNewFormact(month == 12 ? yearOfTheCalendar - 1 : yearOfTheCalendar);
    }

    if (dataType == 'end' && dataDay > 10) {
      month = functionNewFormact(month);
    } else if (dataType == 'end') {
      month = functionNewFormact(month == 12 ? 1 : month + 1);
      year  = functionNewFormact(month == 1 ? yearOfTheCalendar + 1 : yearOfTheCalendar);
    }

    if (dataType == 'middle') {
      month = functionNewFormact(month);
      year  = functionNewFormact(year);
    }

    return { month: month, year: year };
  }

  // This function saves the date range to query in the database.
  const toSaveDatesStartEnd = (dataDay, dataType) => {
    let year  = functionNewFormact(yearOfTheCalendar);
    let month = monthOfTheCalendar + 1;
    let day   = functionNewFormact(dataDay);

    controls  = toDefineDate(year, month, dataDay, dataType);
    month     = controls.month;
    year      = controls.year;

    dataType == 'start'
    ? sqlQuery.dateStart  = year+'/'+month+'/'+day
    : sqlQuery.dateEnd    = year+'/'+month+'/'+day
  }

  

  /*
  Controls about de event
  * Register
  * Consult
  * Modify
  * Move
  * Delete
  */

  // Consult all events of the calendar
  const consultAllEvent = () => {
    let dataForm = [];
    dataForm.push({ name: 'start_day', value: sqlQuery.dateStart });
    dataForm.push({ name: 'end_day', value: sqlQuery.dateEnd });
    dataForm.push({ name: 'option', value: 'Consult all' });

    $.ajax({
      url : '../controllers/c_events.php',
      type: 'POST',
      data: dataForm,
      dataType: 'JSON',
      success: (response) => {
        $('.event-list-modal > div').empty();

        if (response) {
          for (let i in response) {
            const idAlert     = Math.random().toString().replace('.', '');
            const dateEvent   = response[i].date.replace('/', '-');

            $('#events-'+dateEvent).append(
              '<div id="badge-event-'+idAlert+'" class="badge-events bg-white border rounded px-2 mb-1" style="padding-top: 2px; padding-bottom: 2px;">'+
                '<p class="small w-100 m-0"><b>'+response[i].title+'</b></p>'+
              '</div>'
            );
          }
        }
      },
      error: (error) => {
        alert('Ha ocurrido un error, intente nuevamente o recargue la página.');
        console.log(error.statusText);
        console.log(error);
      },
      timeout: 15000
    });
  }

  function clickDaySelected () {
    let clickYear   = $(this).attr('data-year');
    let clickMonth  = $(this).attr('data-month');
    let clickDay    = $(this).attr('data-day');
    let clickDate   = new Date(clickYear+'/'+clickMonth+'/'+clickDay);
    selectedDay     = clickYear+'/'+clickMonth+'/'+clickDay; // Save the selected day.

    if (eventOption == '') {
      openModalEvents(clickDay, clickDate);
    } else if (eventOption == 'Move') {
      moveEvent();
    } else if (eventOption == 'Copy') {
      copyEvent();
    }
  }

  const openModalEvents = (clickDay, clickDate) => {
    $('#show-selected-day').html(
      dataConfig.namesOfTheDays[clickDate.getDay()]+
      ' '+clickDay+' de '+
      dataConfig.namesOfTheMonths[clickDate.getMonth()]+
      ' de '+clickDate.getFullYear()
    );
    $('#event-list-modal').modal();
    toConsultEvents();
  }

  const toConsultEvents = () => {
    let dataForm = [];
    dataForm.push({ name: 'event_date', value: selectedDay });
    dataForm.push({ name: 'option', value: 'Consult' });

    $.ajax({
      url : '../controllers/c_events.php',
      type: 'POST',
      data: dataForm,
      dataType: 'JSON',
      beforeSend: () => {
        $('#event-list-modal .modal-body').html(
          '<div class="border rounded bg-white text-center p-3 my-2">'+
            '<i class="fas fa-spinner fa-spin" style="font-size: 50px;"></i>'+
            '<p class="m-0"><b>Cargando...</b></p>'+
          '</div>'
        );
      },
      success: (response) => {
        $('#event-list-modal .modal-body').empty();

        if (response) {
          dataEvents = response;
          for (let i in response) {
            const idAlert   = Math.random().toString().replace('.', '');
            const startHour = response[i].start_hour.substr(0,5) != '00:00' ? response[i].start_hour.substr(0,5) : '';
            const endHour   = response[i].end_hour.substr(0,5) != '00:00' ? response[i].end_hour.substr(0,5) : '';

            $('#event-list-modal .modal-body').append(
              '<div id="event-'+idAlert+'" class="border rounded bg-white py-1 px-2 my-2">'+
                '<h5 class="d-flex justify-content-between align-items-center w-100 m-0 py-1">'+
                  response[i].title+

                  '<div class="dropdown">'+
                    '<button type="button" class="btn btn-sm btn-own px-1 modify-event" data-position="'+i+'" style="font-size: 12px;">'+
                      '<i class="fas fa-pencil-alt"></i>'+
                    '</button>'+
                    
                    '<button type="button" class="btn btn-sm btn-own ml-1 px-2 dropdown-toggle no-arrow" id="more-option-events" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="font-size: 12px;">'+
                      '<i class="fas fa-ellipsis-v"></i>'+
                    '</button>'+

                    '<div class="dropdown-menu dropdown-menu-right py-1" aria-labelledby="more-option-events">'+
                      '<a href="#" class="dropdown-item px-2 move-event" data-position="'+i+'" data-id="'+idAlert+'"><i class="fas fa-exchange-alt text-center" style="width: 16px;"></i> <span class="ml-1">Mover</span></a>'+
                      '<a href="#" class="dropdown-item px-2 copy-event" data-position="'+i+'"><i class="fas fa-copy text-center" style="width: 16px;"></i> <span class="ml-1">Copiar</span></a>'+
                      '<a href="#" class="dropdown-item px-2 delete-event" data-position="'+i+'" data-id="'+idAlert+'"><i class="fas fa-times text-center" style="width: 16px;"></i> <span class="ml-1">Eliminar</span></a>'+
                    '</div>'+
                  '</div>'+
                '</h5>'+

                (startHour                != '' ? '<p class="m-0 small">Hora: '+ startHour + (endHour != '' ? ' - ' : '') + endHour +'</p>' : '')+
                (response[i].description  != '' ? '<p class="border-top small m-0 mt-1 pt-1">Descripción: <i>'+response[i].description+'</i></p>' : '')+
                (response[i].address      != '' ? '<p class="border-top small m-0 mt-1 pt-1">Dirección: <i>'+response[i].address+'</i></p>' : '')+
              '</div>'
            );
          }

          // Active functions of the events.
          $('.modify-event').click(modifyEvent);
          $('.move-event').click(moveEventSelect);
          $('.copy-event').click(copyEventSelect);
          $('.delete-event').click(deleteEvent);
        } else {
          dataEvents = [];
          $('#event-list-modal .modal-body').html(noEvents);
        }
      },
      error: (error) => {
        alert('Ha ocurrido un error, intente nuevamente.');
        console.log(error);
        console.log(error.statusText);
      },
      timeout: 15000
    });
  }

  $('#new-event').click(() => {
    $('#description-event-manager').html('Registrar evento');
    $('#event-form')[0].reset();
    $('#event-form .input-form').attr('disabled', false);
    $($('.input-form')[0]).trigger('keyup');
    $('#show-event-modal').modal();
    idEventEdit = '';
  });

  function modifyEvent () {
    const position  = parseInt($(this).attr('data-position'));
    const startHour = dataEvents[position].start_hour.substr(0,5) != '00:00' ? dataEvents[position].start_hour.substr(0,5) : '';
    const endHour   = dataEvents[position].end_hour.substr(0,5) != '00:00' ? dataEvents[position].end_hour.substr(0,5) : '';

    $('#description-event-manager').html('Modificar evento');
    $('#event-form')[0].reset();
    $('#event-form .input-form').attr('disabled', false);
    $($('.input-form')[0]).trigger('keyup');
    $('#show-event-modal').modal();
    
    idEventEdit = dataEvents[position].iddates;
    $('#event-title').val(dataEvents[position].title);
    $('#event-start-hour').val(startHour);
    $('#event-end-hour').val(endHour);
    $('#event-type').val(dataEvents[position].type);
    $('#event-address').val(dataEvents[position].address);
    $('#event-description').val(dataEvents[position].description);
  }

  $('.input-form').keyup(() => {
    let paramsHour = /^([0][0-9]|[1][0-2]):([0-5][0-9])$/;
    let formCorrect = true;

    let titleEvent = $('#event-title').val();
    if (titleEvent == '') {
      formCorrect = false;
    }

    let startHour = $('#event-start-hour').val();
    if (startHour != '') {
      if (!startHour.match(paramsHour)) {
        formCorrect = false;
      }
    }

    let endHour = $('#event-end-hour').val();
    if (endHour != '' && startHour != '') {
      if (!endHour.match(paramsHour)) {
        formCorrect = false;
      }
    } else if (endHour != '' && startHour == '') {
      formCorrect = false;
    }

    formCorrect ? $('#save-event').attr('disabled', false) : $('#save-event').attr('disabled', true);
  });

  // Save new event
  $('#save-event').click(() => {
    if ($('#event-title').val() != '') {
      const dataButton = $('#save-event').html();
      const dataWidthButton = $('#save-event').width();
      const saveOption = idEventEdit == '' ? 'Register' : 'Modify';

      let dataForm = $('#event-form').serializeArray();
      dataForm.push({ name: 'id_event', value: idEventEdit });
      dataForm.push({ name: 'event_date', value: selectedDay });
      dataForm.push({ name: 'option', value: saveOption });

      $.ajax({
        url : '../controllers/c_events.php',
        type: 'POST',
        data: dataForm,
        beforeSend: () => {
          $('#event-form .input-form').attr('disabled', true);
          $('#save-event').attr('disabled', true);
          $('#save-event').width(dataWidthButton+'px');
          $('#save-event').html('<i class="fas fa-spin fa-spinner"></i>');
        },
        success: (response) => {
          if (response == 'success') {
            alert('Evento guardado exitosamente!');
            $('#show-event-modal').modal('hide');
            consultAllEvent(); // All events saved in the calendar.

            if (eventOption == '') {
              toConsultEvents(); // All events of the selected day.
            } else if (eventOption == 'Copy') {
              eventElement  = ''; // Clear the varable!.
              eventOption   = ''; // Clear the varable!.
              $('.icon-paste').hide();
              $('#event-list-modal').modal(); // Show modal again!.
            }
          } else {
            alert('Error al intentar guardar, intente nuevamente.');
          }
        },
        error: (error) => {
          alert('Ha ocurrido un error, intente nuevamente o recargue la página.');
          console.log(error.statusText);
          console.log(error);
        },
        timeout: 15000
      })
      .always(() => {
        $('#event-form .input-form').attr('disabled', false);
        $('#save-event').attr('disabled', false);
        $('#save-event').attr('style', '');
        $('#save-event').html(dataButton);
      });
    }
  });

  function moveEventSelect () {
    eventElement = this;
    eventOption = 'Move';
    $('.icon-paste').show();
    $('#event-list-modal').modal('hide');
  }

  const moveEvent = () => {
    let idEvent = $(eventElement).attr('data-id');
    let position = parseInt($(eventElement).attr('data-position'));

    if (confirm('¿Seguro que quieres mover este evento?')) {
      let dataForm = [];
      dataForm.push({ name: 'id_event', value: dataEvents[position].iddates });
      dataForm.push({ name: 'event_date', value: selectedDay });
      dataForm.push({ name: 'option', value: 'Move' });

      $.ajax({
        url : '../controllers/c_events.php',
        type: 'POST',
        data: dataForm,
        success: (response) => {
          if (response == 'success') {
            alert('Actualizado exitosamente!');
            $('#event-'+idEvent).remove(); // Remove event of the list of events of the selected day.
            consultAllEvent(); // All events saved in the calendar.

            eventElement  = ''; // Clear the varable!.
            eventOption   = ''; // Clear the varable!.
            $('.icon-paste').hide();
            $('#event-list-modal').modal(); // Show modal again!.

            // When the container is empty, this will show a massage 'No events!'.
            if ($('#event-list-modal .modal-body').html() == '')
                $('#event-list-modal .modal-body').html(noEvents);
          } else {
            alert('Error al intentar mover, intente nuevamente.');
          }
        },
        error: (error) => {
          alert('Ha ocurrido un error, intente nuevamente.');
          console.log(error.statusText);
          console.log(error);
        },
        timeout: 15000
      });
    }
  }

  function copyEventSelect () {
    eventElement = this;
    eventOption = 'Copy';
    $('.icon-paste').show();
    $('#event-list-modal').modal('hide');
  }

  const copyEvent = () => {
    const position  = parseInt($(eventElement).attr('data-position'));
    const startHour = dataEvents[position].start_hour.substr(0,5) != '00:00' ? dataEvents[position].start_hour.substr(0,5) : '';
    const endHour   = dataEvents[position].end_hour.substr(0,5) != '00:00' ? dataEvents[position].end_hour.substr(0,5) : '';

    $('#description-event-manager').html('Nuevo evento');
    $('#event-form')[0].reset();
    $('#event-form .input-form').attr('disabled', false);
    $($('.input-form')[0]).trigger('keyup');
    $('#show-event-modal').modal();
    
    idEventEdit = '';
    $('#event-title').val(dataEvents[position].title);
    $('#event-start-hour').val(startHour);
    $('#event-end-hour').val(endHour);
    $('#event-type').val(dataEvents[position].type);
    $('#event-address').val(dataEvents[position].address);
    $('#event-description').val(dataEvents[position].description);
  }

  function deleteEvent () {
    let idEvent = $(this).attr('data-id');
    let position = parseInt($(this).attr('data-position'));

    if (confirm('¿Seguro que quieres eliminar este evento?')) {
      let dataForm = [];
      dataForm.push({ name: 'id_event', value: dataEvents[position].iddates })
      dataForm.push({ name: 'option', value: 'Delete' });

      $.ajax({
        url : '../controllers/c_events.php',
        type: 'POST',
        data: dataForm,
        success: (response) => {
          if (response == 'success') {
            alert('¡Eliminado exitosamente!');
            $('#event-'+idEvent).remove(); // Remove event of the list of events of the selected day.
            consultAllEvent(); // All events saved in the calendar.

            // When the container is empty, this will show a massage 'No events!'.
            if ($('#event-list-modal .modal-body').html() == '')
                $('#event-list-modal .modal-body').html(noEvents);
          } else {
            alert('Error al intentar eliminar, intente nuevamente.');
          }
        },
        error: (error) => {
          alert('Ha ocurrido un error, intente nuevamente.');
          console.log(error.statusText);
          console.log(error);
        },
        timeout: 15000
      });
    }
  }

  // Initialize calendar
  toChangeDataOfTheDate();
});