<template>
  <div id="app">
    <navigation></navigation>
    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'

export default {
  name: 'app',
  components: { Navigation }
}
</script>

<style>
body {
  margin: 5px;
  padding: 0px;
  padding-top: 70px;
  background-color: ghostwhite;
}

h1,
body,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

a {
  color: black;
  font-size: 16px;
  text-decoration: none;
}

a:hover {
  color: rebeccapurple;
  text-decoration: none;
}

label {
  font-size: 17px;
}

input {
  color: #666666
}

thead {
  color: white;
  background-color: rebeccapurple;
}

hr {
  max-width: 100%;
}

@media(max-width:767px) {
  .intro-message {
    padding-bottom: 15%;
  }

  .intro-message>h1 {
    font-size: 3em;
  }

  ul.intro-social-buttons>li {
    display: block;
    margin-bottom: 20px;
    padding: 0;
  }

  ul.intro-social-buttons>li:last-child {
    margin-bottom: 0;
  }

  .intro-divider {
    width: 100%;
  }
}

@media(max-width:1199px) {
  ul.banner-social-buttons {
    float: left;
    margin-top: 15px;
  }
}

@media(max-width:767px) {
  .banner h2 {
    font-size: 3em;
    margin: 0;
    text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.6);
  }

  ul.banner-social-buttons>li {
    display: block;
    margin-bottom: 20px;
    padding: 0;
  }

  ul.banner-social-buttons>li:last-child {
    margin-bottom: 0;
  }

  .nav-collapse.collapse {
    height: auto !important;
    overflow: visible !important;
  }
}

.container {
  width: 80%;
}

.form-control {
  border: 0.5px solid lightgray !important;
  border-radius: 5px !important;
  background-color: white;
}

.btn-primary a {
  color: white;
}

.btn-primary:hover,
.btn-primary a:hover {
  color: gold;
}

.row {
  margin: 0px;
}

.panel-heading {
  background-color: rebeccapurple !important;
  border-color: rebeccapurple !important;
}

.panel {
  position: relative;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 7px;
}

.panel-primary {
  border-color: lightgrey;
}

.panel-body article {
  text-align: left;
  font-size: 15px;
}

.panel-body a {
  font-size: 14px;
  color: dimgray;
}

.panel-body a:hover {
  color: #494949;
}

.panel-body button a {
  color: white
}

.panel-body button a:hover {
  color: gold;
}

.content {
  margin: 10%;
}

.section-heading {
  color: rebeccapurple;
}

.btn-primary {
  background-color: rebeccapurple;
  border-color: rebeccapurple;
  color: white;
}

.btn-primary:hover,
.btn-primary:active {
  background-color: rebeccapurple !important;
  border-color: rebeccapurple;
  color: white;
}

.btn-primary:hover a {
  color: white;
}

.btn-primary:active a {
  color: white;
}

.btn-circle.btn-lg {
  position: fixed;
  z-index: 1;
  right: 0.5em;
  bottom: 2em;
  border: none;
  border-radius: 50%;
  height: 60px;
  width: 60px;
  padding: 10px 16px;
  background-color: rebeccapurple;
  font-size: 20px;
  line-height: 1.33;
}

.btn-circle i {
  color: white;
}

.btn-circle i:hover {
  color: gold;
}

.btn-md {
  padding: 8px 14px;
  height: 40px;
  width: 40px;
  font-size: 15px;
}

.center-text {
  text-align: center;
}

.panel-body article {
  text-align: left;
  font-size: 15px;
}

.panel-body a {
  font-size: 14px;
  color: dimgray;
}

.panel-body a:hover {
  color: #494949;
}

.panel-body button a {
  color: white
}

.panel-body button a:hover {
  color: gold;
}

.info-container {
  border-bottom: 1px solid rebeccapurple;
  padding-bottom: 3px;
  padding-top: 2px;
}

.info-body {
  overflow-y: auto;
  height: 190px;
}

.panel {
  position: relative;
  margin-left: 15px;
  margin-right: 15px;
}

.row {
  margin: 0px;
}

.img-container>img {
  height: 40px;
  width: 40px;
}

.img-container {
  margin-left: 7px;
  margin-right: 5px;
  width: 50px;
}

.comment-panel>.panel-heading:after,
.comment-panel>.panel-heading:before {
  content: " ";
  position: absolute;
  top: 11px;
  right: 100%;
  left: -16px;
  display: block;
  border-color: transparent;
  border-style: solid solid outset;
  height: 0;
  width: 0;
  pointer-events: none;
}

.panel>.panel-heading:after {
  border-right-color: #f7f7f7;
  border-width: 7px;
  margin-left: 2px;
  margin-top: 1px;
}

.panel>.panel-heading:before {
  border-right-color: #ddd;
  border-width: 8px;
}

.panel-heading {
  font-size: 16px;
}

.panel-footer {
  background-color: #fafafa;
  color: #4a148c
}

.panel-body article {
  text-align: left;
  font-size: 15px;
}

.panel-body a {
  font-size: 14px;
  color: dimgray;
}

.panel-body a:hover {
  color: #494949;
}

.panel-body button a {
  color: white
}

.panel-body button a:hover {
  color: gold;
}

.edit,
.delete,
.check {
  cursor: pointer;
  color: white;
  font-size: 16px;
}

.edit:hover,
.delete:hover,
.check:hover {
  color: gold;
}

.search-container {
  margin-top: 30px;
  margin-bottom: 20px;
}

span.error {
  color: #9F3A38;
}

#wrapper {
  max-width: 150vw;
}

#wrapper .form-wrapper {
  text-align: center;
  z-index: 0;
  border-radius: 10px;
  background-color: white;
  padding: 2em;
}

#info-button {
  width: 30%;
  margin-bottom: 10px;
  margin-top: 10px;
}

#pwd-container .form-wrapper,
#go-home-button a {
  color: white;
}

.CodeMirror div *{
  text-align: left;
}
</style>
