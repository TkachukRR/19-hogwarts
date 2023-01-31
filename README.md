# 19-hogwarts
https://tkachukrr.github.io/19-hogwarts/

Roman_Tkaczuk;

TkachukRR@gmail.com



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
