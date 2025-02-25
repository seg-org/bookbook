Feature: Posts search functionality (US2-4)

  Scenario: view all posts
    Given the user is on the search page
    Then they should see all posts

  Scenario: search by book title
    Given the user is on the search page
    When they enter a book title
    Then they should see the posts with that title

  Scenario: sort price descending
    Given the user is on the search page
    When they click the sort by price button
    Then they should see the posts sorted by price in descending order
    
  Scenario: search by book title (not found)
    Given the user is on the search page
    When they enter a book title that does not exist in the database
    Then they should see a message indicating that no posts were found

   