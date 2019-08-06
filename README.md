# Web-automate-gulp
Automate the fronted code task with Gulp

Uses Node.js, Gulp, BrowserSync for Sass compiling, task running and Browser Syncing.


## Requirements
- Node.js - Install node.js. If you have “homebrew” - $ brew install node
- Gulp.js - Install gulp globally - $ npm install gulp -g
- BrowserSync - Install BrowserSync - $ npm install -g browser-sync

## Installation
- CD into the theme directory and run $ npm install to fetch all required dependencies.
- For BrowserSync update proxy server in gulpfile.js to match your local environment.
- CD into the theme directory and run “gulp” to start gulp watching, compiling and Browser Syncing.

## Theme folder structure SOURCE

##SCSS/LESS
- Variables – Place all  color and repeatedly used property in variable file  
- Mixins – Reusable function
- Base - reset/normalize plus HTML element styling.
- Layout -grid systems.
- Component — discrete, reusable UI elements.
- State — styles that deal with client-side changes to components.
- Theme — page whole page style (look and feel)
- Single merge file

##SCRIPT
- libraries (Such as jquery, angularjs, gAnalytics and so on…)
- plugins (Typically jquery plugins)
- Custom scrript files

##images
- Uncompressed images
- sprite - sprite images 



## Theme folder structure BUILD

##CSS
- Component — discrete, reusable UI elements.
- Theme — purely visual styling (“look-and-feel”) for a component.
- Single merge CSS file


##SCRIPT
- libraries (Such as jquery, angularjs, gAnalytics and so on…)
- plugins (Typically jquery plugins)
- Custom valideted minified script files

##images
- Compressed images
- sprite - generated sprite images + CSS file
