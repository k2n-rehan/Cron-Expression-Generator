$(document).ready(function() {
    // Default options for start and end time
    const defaultOptions = [
        { value: '0', text: '00:00' },
        { value: '1', text: '01:00' },
        { value: '2', text: '02:00' },
        { value: '3', text: '03:00' },
        { value: '4', text: '04:00' },
        { value: '5', text: '05:00' },
        { value: '6', text: '06:00' },
        { value: '7', text: '07:00' },
        { value: '8', text: '08:00' },
        { value: '9', text: '09:00' },
        { value: '10', text: '10:00' },
        { value: '11', text: '11:00' },
        { value: '12', text: '12:00' },
        { value: '13', text: '13:00' },
        { value: '14', text: '14:00' },
        { value: '15', text: '15:00' },
        { value: '16', text: '16:00' },
        { value: '17', text: '17:00' },
        { value: '18', text: '18:00' },
        { value: '19', text: '19:00' },
        { value: '20', text: '20:00' },
        { value: '21', text: '21:00' },
        { value: '22', text: '22:00' },
        { value: '23', text: '23:00' }
    ];

    // IST-specific options for start and end time
    const istOptions = [
		{ value: '19', text: '00:30' },
		{ value: '20', text: '01:30' },
		{ value: '21', text: '02:30' },
	    { value: '22', text: '03:30' },
		{ value: '23', text: '04:30' },
        { value: '00', text: '05:30' },
        { value: '1', text: '06:30' },
        { value: '2', text: '07:30' },
        { value: '3', text: '08:30' },
        { value: '4', text: '09:30' },
        { value: '5', text: '10:30' },
        { value: '6', text: '11:30' },
        { value: '7', text: '12:30' },
        { value: '8', text: '13:30' },
        { value: '9', text: '14:30' },
        { value: '10', text: '15:30' },
        { value: '11', text: '16:30' },
        { value: '12', text: '17:30' },
        { value: '13', text: '18:30' },
        { value: '14', text: '19:30' },
        { value: '15', text: '20:30' },
        { value: '16', text: '21:30' },
        { value: '17', text: '22:30' },
        { value: '18', text: '23:30' }
    ];
	
	const estOptions = [
        { value: '4', text: '00:00' },
        { value: '5', text: '01:00' },
        { value: '6', text: '02:00' },
        { value: '7', text: '03:00' },
        { value: '8', text: '04:00' },
        { value: '9', text: '05:00' },
        { value: '10', text: '06:00' },
        { value: '11', text: '07:00' },
        { value: '12', text: '08:00' },
        { value: '13', text: '09:00' },
        { value: '14', text: '10:00' },
        { value: '15', text: '11:00' },
        { value: '16', text: '12:00' },
        { value: '17', text: '13:00' },
        { value: '18', text: '14:00' },
        { value: '19', text: '15:00' },
        { value: '20', text: '16:00' },
        { value: '21', text: '17:00' },
        { value: '22', text: '18:00' },
        { value: '23', text: '19:00' },
        { value: '00', text: '20:00' },
        { value: '1', text: '21:00' },
        { value: '2', text: '22:00' },
        { value: '3', text: '23:00' }
    ];    

    function updateTimeOptions(timeZone) {
        let options = defaultOptions;
        if (timeZone === 'Asia/Kolkata') {
            options = istOptions;
        }
		else if (timeZone === 'America/New_York') {
            options = estOptions;
        }

        // Update start time drop-down
        const startTimeSelect = $('#start-time');
        startTimeSelect.empty();
        options.forEach(option => {
            startTimeSelect.append(new Option(option.text, option.value));
        });

        // Update end time drop-down
        const endTimeSelect = $('#end-time');
        endTimeSelect.empty();
        options.forEach(option => {
            endTimeSelect.append(new Option(option.text, option.value));
        });
    }

    // Bind the change event of the time zone select element
    $('#timezone').change(function() {
        const selectedTimeZone = $(this).val();
        updateTimeOptions(selectedTimeZone);
    });

    // Initialize with default options
    updateTimeOptions($('#timezone').val());

    $('#time').clockpicker({
        autoclose: true,
        twelvehour: false,
        donetext: 'Done'
    });

    $('input[name="time-type"]').change(function() {
        if ($('#specific-time').is(':checked')) {
            $('#time-container').show();
            $('#interval-container').hide();
        } else if ($('#specific-interval').is(':checked')) {
            $('#time-container').hide();
            $('#interval-container').show();
        }
    });
});

function generateCron() {
    const timeType = document.querySelector('input[name="time-type"]:checked').value;

    let cronExpression;
    if (timeType === 'specific-time') {
        const timeInput = document.getElementById('time').value || '*';
        const [hourStr, minuteStr] = timeInput.split(':');
        let hour = hourStr ? parseInt(hourStr) : '*';
        let minute = minuteStr ? parseInt(minuteStr) : '*';

        const day = document.getElementById('day').value || '*';
        const month = document.getElementById('month').value || '*';
        const weekday = document.getElementById('weekday').value || '*';
        const timezone = document.getElementById('timezone').value;

        // Convert hour based on selected time zone
        if (hour !== '*' && minute !== '*') {
            switch (timezone) {
                case 'Asia/Kolkata':
                    const { utcHour, utcMinute } = convertISTtoUTC(hour, minute);
                    hour = utcHour;
                    minute = utcMinute;
                    break;
                case 'America/New_York':
                    hour = (hour + 5 + 23) % 24;
                    break;
                case 'UTC':
                default:
                    // No conversion needed for UTC
                    break;
            }
        }

        // Include the day, month, and weekday values in the cron expression
        cronExpression = `${minute} ${hour} ${day} ${month} ${weekday}`;
    } else if (timeType === 'specific-interval') {
        const day = document.getElementById('day').value || '*';
        const month = document.getElementById('month').value || '*';
        const weekday = document.getElementById('weekday').value || '*';
        
        const hours = document.getElementById('hours').value || '0';
        const minutes = document.getElementById('minutes').value || '0';
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        
        const [startHour, startMinute] = startTime.split(':');
        const [endHour, endMinute] = endTime.split(':');
        
        if (hours > 0) {
            cronExpression = `${minutes} ${startHour}-${endHour}/${hours} ${day} ${month} ${weekday}`;
        } 
		else if (hours == 0) {
            cronExpression = `${minutes} ${startHour}-${endHour} ${day} ${month} ${weekday}`;
        }
    }

    document.getElementById('cron-expression').innerText = cronExpression;
    document.getElementById('copy-cron-icon').style.display = 'inline'; // Show the icon

    // Generate CI/CD configuration examples based on the cron expression
    const platform = document.getElementById('platform').value;
    let ciCdExample;

    switch (platform) {
        case 'github':
            ciCdExample = `
name: Scheduled Job

on:
  schedule:
    - cron: '${cronExpression}'

jobs:
  run-scheduled-task:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Run scheduled task
      run: ./scheduled-task.sh
`;
            break;
        case 'jenkins':
            ciCdExample = `
pipeline {
    triggers {
        cron('${cronExpression}')
    }
    agent any
    stages {
        stage('Run scheduled task') {
            steps {
                sh './scheduled-task.sh'
            }
        }
    }
}
`;
            break;
        case 'gitlab':
            ciCdExample = `
job:
  script:
    - ./scheduled-task.sh
  only:
    - schedules
`;
            break;
        default:
            ciCdExample = 'Unsupported platform selected.';
            break;
    }

    document.getElementById('ci-cd-example').innerText = ciCdExample;
    document.getElementById('copy-button').style.display = 'block'; // Show the copy button
}

function copyCronExpression() {
    const cronExpression = document.getElementById('cron-expression').innerText;
    const tempInput = document.createElement('input');
    tempInput.value = cronExpression;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Cron expression copied to clipboard');
}

function copyToClipboard() {
    const ciCdExample = document.getElementById('ci-cd-example').innerText;
    const tempInput = document.createElement('textarea');
    tempInput.value = ciCdExample;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('CI/CD configuration copied to clipboard');
}

function convertISTtoUTC(hour, minute) {
    let utcHour = hour - 5;
    let utcMinute = minute - 30;

    if (utcMinute < 0) {
        utcMinute += 60;
        utcHour -= 1;
    }
    if (utcHour < 0) {
        utcHour += 24;
    }

    return { utcHour, utcMinute };
}
