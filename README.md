# Cron Expression Generator

This project provides a user-friendly interface to generate cron expressions based on user inputs. Additionally, it generates CI/CD configuration examples for various platforms based on the generated cron expressions. This project is hosted on GitHub Pages.

## Features

- **Cron Expression Generation:** Easily generate cron expressions based on user inputs for time, day, month, weekday, and timezone.
- **CI/CD Configuration Examples:** Automatically generate configuration examples for popular CI/CD platforms such as GitHub Actions, Jenkins, GitLab, Azure Pipelines, CircleCI, ArgoCD, Travis CI, Bitbucket Pipelines, and Bamboo.
- **Copy to Clipboard:** Conveniently copy the generated cron expression and CI/CD configuration to the clipboard.
- **Tooltips:** Helpful tooltips to guide users through the process.
- **Responsive Design:** Optimized for both desktop and mobile use.

## Technology Stack

- **HTML5**: Structure of the web page.
- **CSS3**: Styling of the web page, using Flexbox for layout.
- **JavaScript**: Functionality for generating cron expressions and handling user interactions.
- **jQuery**: Simplified DOM manipulation and event handling.
- **Clockpicker**: Time picker plugin for selecting specific times.
- **Moment.js**: Handling and manipulating dates and times.
- **FontAwesome**: Icons for user interface elements.

## Live Demo

Check out the live demo [here](https://k2n-rehan.github.io/Cron-Expression-Generator/).

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/k2n-rehan/Cron-Expression-Generator.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd Cron-Expression-Generator
   ```

3. **Open the project in your browser:**
   - If you are on Windows, double-click `docs/index.html` to open it in your default browser.
   - On macOS or Linux, you can use:
     ```bash
     open docs/index.html
     # or
     xdg-open docs/index.html
     ```
   
## Usage
1. Enter the desired time and timezone.
2. Select the day, month, and weekday (if applicable).
3. Choose the CI/CD platform from the dropdown.
4. Select either "Specific Time" or "Specific Interval" for scheduling.
5. Click the "Generate Cron Expression" button to create the cron expression and CI/CD configuration.
6. Use the clipboard icons to copy the generated cron expression and CI/CD configuration to your clipboard.
   
## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Contact
For any questions or suggestions, please contact [k8s.rehan@gmail.com](mailto:k8s.rehan@gmail.com).

## Acknowledgments

- [jQuery](https://jquery.com/)
- [Clockpicker](https://weareoutman.github.io/clockpicker/)
- [Moment.js](https://momentjs.com/)
- [FontAwesome](https://fontawesome.com/)
