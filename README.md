# Drone Flight Planner

This project is an initiation of drone flight planner. Currently it supports basic features.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1.

## Currently supporting features
- Draw polylines with points 
- Clean the current polylines 
- Save flight plans with name, description, updated time and current coordinates (in local storage)
- Load previously saved flight plans and display the plan name (from local storage)
- Initiate the map
- Confirmation dialog 
- Snackbars

## How to use
### Draw drone flight plan 
- Polyline button: Toggle drawing of polyline
- Clear button: Clear current drawings

### Save and load
- Save button: Save a new or existing flight plan 
- Load button: Load an existing flight plan
- New button: Clear the current plan without saving and re-initiate the map

## To support in the future
- Map search feature
- Display flight plan order
- Configure initial coordinates
- Configure initial zoom level


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Deployed version

[Link](https://shinjjo.github.io/drone-flight-planner)

