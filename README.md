[![GitHub stars](https://img.shields.io/github/stars/pu6ki/elsyser-web-client.svg?style=flat-square)](https://github.com/pu6ki/elsyser-web-client/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/pu6ki/elsyser-web-client.svg?style=flat-square)](https://github.com/pu6ki/elsyser-web-client/network)
[![GitHub issues](https://img.shields.io/github/issues/pu6ki/elsyser-web-client.svg?style=flat-square)](https://github.com/pu6ki/elsyser-web-client/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/pu6ki/elsyser-web-client/master/LICENSE)

![Logo](https://raw.githubusercontent.com/pu6ki/elsyser-web-client/master/static/logos/tues_building_with_logo.jpg)

# [elsyser-web-client](https://elsyser.aerobatic.io)
This is the web client for the [ELSYSER API](https://github.com/pu6ki/elsyser/). This is a students' platform for [ELSYS, Sofia](http://elsys-bg.org).

## Prerequisites

- [NodeJS v7.0.0](https://nodejs.org/en/)
- npm 3.10.8

## Tech

**elsyser-web-client** uses a number of open-source projects to work properly:

* [jQuery](https://github.com/jquery/jquery) - New Wave JavaScript
* [handlebars](https://github.com/wycats/handlebars.js/) - Semantic templates for JavaScript
* [handlebars-intl](https://github.com/yahoo/handlebars-intl) - Handlebars helpers for internationalization.
* [toastr](https://github.com/CodeSeven/toastr) - JavaScript library for representative notifications
* [navigo](https://github.com/krasimir/navigo) - Minimalistic JavaScript router
* [AlertifyJS](https://github.com/MohammadYounes/AlertifyJS) - A JavaScript framework for developing pretty browser dialogs and notifications
* [Bootstrap](https://github.com/twbs/bootstrap) - Framework for developing responsive UI on the web
* [Jasmine](https://jasmine.github.io/) - Testing framework
* [live-server](https://github.com/tapio/live-server) - A small HTTP web server with live reload
* [Visual Studio Code](https://github.com/Microsoft/vscode)

## Getting started

How to copy this project to your local machine and run it:

1. Download a copy from GitHub:

    ```
    $ git clone https://github.com/pu6ki/elsyser-web-client.git
    $ cd elsyser-web-client/
    ```

2. Install Bower dependencies:

    ```
    $ bower install
    ```

3. Run the live server:

    ```
    $ npm install -g live-server
    $ live-server
    ```

## Tutorial

1. `$ live-server`
2. Visit http://127.0.0.1:8080/
3. Click "Register" to create your school account.
    ![Register page](https://raw.githubusercontent.com/pu6ki/elsyser-web-client/master/static/readme_images/register-page.png)
4. Then log in with your credentials.
    ![Login page](https://raw.githubusercontent.com/pu6ki/elsyser-web-client/master/static/readme_images/login-page.png)
5. Everything about you and your class is one click away!
    ![Navigation bar](https://raw.githubusercontent.com/pu6ki/elsyser-web-client/master/static/readme_images/home-page.png)
    - Upcoming exams
    - Latest news with live comments
    - Assigned homeworks
    - Materials for each topic
    - Profile info
    - TBA

## Author

[matir8](https://github.com/matir8) - I am a student in 10th grade in ELSYS.
I am developing this client, which is consuming RESTful services from [the ELSYSER API](https://github.com/pu6ki/elsyser),
which is developed by my schoolmate [wencakisa](https://github.com/wencakisa).
Logo is designed by [Vladimir Vladinov](https://github.com/thehughmungus).

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
