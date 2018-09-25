# Easy to use front-end setup
Easy, lightweight front-end setup using gulp + browsersync

## What's included
This setup includes:
- Gulp
- Babel (gulp-babel)
- Sass (gulp-sass)
- Sourcemaps
- Concat
- Del
- Browsersync

## Get started
1) Download the repo contents and place them in whatever will be your project folder
2) Open terminal, navigate to the project folder and run npm install
3) If you are running this in a virtual machine but want browsersync to reload in your host machine, leave in the { usePolling: true } option in the watchers in the gulpfile. If you aren't using a virtual machine, remove them. 
4) Run gulp serve to start browsersync. Visit localhost:3000 (unless you changed your default localhost) to see served files.
