# 19-hogwarts
https://tkachukrr.github.io/19-hogwarts/


Intro
For this task, we will use a free API that provides Harry Potter data: https://hp-api.herokuapp.com/
You can find there the documentation along with available HTTP endpoints and sample responses.

Functionalities
The goal is to write an application that will communicate with this API and have the following functionalities:

There should be 6 buttons on the top of the page:

'All students' - fetch data for characters who are Hogwarts students during the book series
'Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw' - fetch data for characters in a certain house
'Favorites' - navigates to a subpage with characters saved in cookies/local storage


Once data are fetched, display a table containing columns:

Name
Date of birth
House
Wizard
Ancestry
Is student/staff


Three first columns should be sortable, both ascending and descending.
Clicking on any record should open a modal containing the selected character's data and image.
Modal should have a button for adding/removing character to Favorites. Data should be saved in cookies/local storage.
Favorites subpage should display a rectangular card for each saved character.
Each card should contain:

Image
Name
Button for removing from Favorites


For a default, 3 cards should be displayed in a row, but the user should be able to change the number of cards in a row (you can use buttons for that e.g. 1/3/5 cards in a row or some switch/input).


Requirements

The application should be written in VanillaJS. Do not use any frameworks, we want to test your JS knowledge.
Do not use libraries (e.g. Bootstrap) for styling. You can use CSS / SCSS / SASS.
We do not expect the app to look outstanding, but we want to see your styling skills.
The application should be responsive to all resolutions.
Tests are much appreciated, but not necessary.
You can use TypeScript, but it is not required
It is allowed to use NodeJS and NPM for setting up local hosting and / or compiling SASS / SCSS files.
Please put your solution in a private repository on Github and invite reviewer@profil-software.com as a collaborator (any role with at least read-only access to code) -> https://docs.github.com/en / github / setting-up-and-managing-your-github-user-account / inviting-collaborators-to-a-personal-repository
