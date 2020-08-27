$(function () {
  const dataConfig = {
    loadEntireCalendar: true, // Load full calendar or just the days of the selected month.
    currentDay: new Date().getDate(), // Always save the current day.
    currentMonth: new Date().getMonth(), // Always save the current month: [0 Juanary | 11 December].
    currentYear: new Date().getFullYear(), // Always save the current year.
    namesOfTheDays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    namesOfTheMonths: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  }
  
  let sqlQuery = { dateStart: '', dateEnd: '' }; // Deadlines for sql query.
  let monthOfTheCalendar  = dataConfig.currentMonth; // It's the month to manage in the calendar.
  let yearOfTheCalendar   = dataConfig.currentYear; // It's the year to manage in the calendar.



  /* ==================== Start the primary controls ==================== */
  const toChangeDataOfTheDate = () => {
    // Change label or description of the calendar.
    $('#label-month').html(dataConfig.namesOfTheMonths[monthOfTheCalendar]);
    $('#label-year').html(yearOfTheCalendar);

    // Change values of the input of the calendar.
    $('#selected-month').val(monthOfTheCalendar);
    $('#selected-year').val(yearOfTheCalendar);

    loadCalendar(); // It's a function to load the calendar when needed.
  };

  $('#go-today').click(() => {
    monthOfTheCalendar = dataConfig.currentMonth;
    yearOfTheCalendar = dataConfig.currentYear;
    toChangeDataOfTheDate();
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
  /* ==================== End the primary controls ==================== */

  /* ==================== Start the second controls ==================== */
  $('#sh-description').dblclick(() => {
    $('#description-labels').hide();
    $('#description-inputs').show();
  });

  const toHideShDescription = () => {
    $('#description-labels').show();
    $('#description-inputs').hide();
    toChangeDataOfTheDate();
  }

  $('#accept-changes-move').click(() => {
    monthOfTheCalendar  = parseInt($('#selected-month').val());
    yearOfTheCalendar   = parseInt($('#selected-year').val());
    toHideShDescription();
  });

  $('#cancel-changes-move').click(() => {
    toHideShDescription();
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
    
    let component = '';
    component += '<td id="td-'+year+'-'+month+'-'+day+'" class="events-control '+today+' p-0" data-year="'+year+'" data-month="'+month+'" data-day="'+day+'">';
      component += '<div id="container-'+year+'-'+month+'-'+day+'" class="py-1 px-2 overflow-auto">';
        component += '<p class="text-right">'+day+'</p>';
      component += '</div>';
    component += '</td>';
    return component;
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


  // Initialize calendar
  toChangeDataOfTheDate();
});