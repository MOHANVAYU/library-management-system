# library-management-system

### to run above code first download following modules from npm:
* Express
* mongodb
* ejs
* cookie-parser
* express-session

_or you can refer package.json file_

__for connecting to mongodb first replace url with your own__

## Database
database with three collections and one document eg for each collection:
* users

  ```json
  {
    "_id": "",
    "username": "name",
    "borrowed": ""
  }
  ```
* admin

  ```json
  {
    "_id": "",
    "admin": "admin",
    "borrowed": "1234"
  }
  ```
* library

  ```json
  {
    "_id":"",
    "title": "Harry Potter and The Deathly Hollows",
    "img": "harry-potter-deathly-hallows.jpg",
    "auther": "J. K. Rowling",
    "desc": "It is the seventh and final book in the immensely popular 'Harry Potter' series written by J.K. Rowling. In this concluding installment, the story follows the now-teenage wizard, Harry Potter, and his friends Ron Weasley and Hermione Granger, as they embark on a dangerous mission to defeat Lord Voldemort, the dark wizard who seeks to conquer the wizarding world.",
    "status": true,
    "borrowed": ""
  }
  ```
 
