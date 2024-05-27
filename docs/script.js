$(document).ready(function() {
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
        const hours = document.getElementById('hours').value || '0';
        const minutes = document.getElementById('minutes').value || '0';
        
        cronExpression = `*/${minutes} */${hours} * * *`;
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
  tags:
    - cron
  schedule:
    cron: "${cronExpression}"
`;
            break;
        case 'azure':
            ciCdExample = `
trigger: none

schedules:
- cron: "${cronExpression}"
  displayName: Scheduled run
  branches:
    include:
    - main

jobs:
- job: run_scheduled_task
  pool:
    vmImage: 'ubuntu-latest'
  steps:
  - checkout: self
  - script: ./scheduled-task.sh
`;
            break;
        case 'circleci':
            ciCdExample = `
version: 2.1

jobs:
  run_scheduled_task:
    docker:
      - image: 'circleci/python:3.8'
    steps:
      - checkout
      - run: ./scheduled-task.sh

workflows:
  version: 2
  scheduled_workflow:
    triggers:
      - schedule:
          cron: "${cronExpression}"
          filters:
            branches:
              only:
                - main
    jobs:
      - run_scheduled_task
`;
            break;
        case 'argocd':
            ciCdExample = `
apiVersion: argoproj.io/v1alpha1
kind: CronWorkflow
metadata:
  name: scheduled-task
spec:
  schedule: "${cronExpression}"
  workflowSpec:
    entrypoint: main
    templates:
    - name: main
      container:
        image: alpine:3.7
        command: [sh, -c]
        args: ["./scheduled-task.sh"]
`;
            break;
        case 'travis':
            ciCdExample = `
jobs:
  include:
    - stage: Scheduled Job
      script: ./scheduled-task.sh
      if: branch = main AND type = cron
      cron: "${cronExpression}"
`;
            break;
        case 'bitbucket':
            ciCdExample = `
pipelines:
  custom:
    scheduled:
      - step:
          name: Scheduled Task
          script:
            - ./scheduled-task.sh
          cron: "${cronExpression}"
`;
            break;
        case 'bamboo':
            ciCdExample = `
---
version: 2
stages:
  - Stage 1:
      jobs:
        - Run scheduled task:
            tasks:
              - script:
                  - ./scheduled-task.sh
triggers:
  - cron: '${cronExpression}'
`;
            break;
        default:
            ciCdExample = 'Unknown platform';
    }

    document.getElementById('ci-cd-example').innerText = ciCdExample;
    document.getElementById('copy-button').style.display = 'inline'; // Show the copy button
}

function copyCronExpression() {
    const cronExpression = document.getElementById('cron-expression').innerText;
    const tempInput = document.createElement('textarea');
    tempInput.value = cronExpression;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Cron Expression copied to clipboard!');
}

function copyToClipboard() {
    const copyText = document.getElementById('ci-cd-example').innerText;
    const tempInput = document.createElement('textarea');
    tempInput.value = copyText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('CI/CD Configuration copied to clipboard!');
}

function convertISTtoUTC(hour, minute, subtractHour = 5, subtractMinute = 30) {
  // Handle negative minutes
  if (minute < subtractMinute) {
    minute += 60;
    hour--;
  }

  // Subtract minutes
  let utcMinute = minute - subtractMinute;

  // Handle negative hours (borrow from hours)
  if (hour < subtractHour) {
    hour += 24;
  }

  // Subtract hours
  let utcHour = hour - subtractHour;

  // Handle negative result (ensure positive time)
  if (utcHour < 0) {
    utcHour += 24; // Add a day if result goes negative
  }
  if (utcMinute < 0) {
    utcMinute += 60; // Add an hour if result minutes are negative
  }

  return { utcHour, utcMinute };
}
