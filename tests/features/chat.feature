Feature: Chat functionality (US3-1)

  Scenario: buyer adds seller to chat
    Given the buyer is on the search page
    When they click the chat button on a post
    Then they should see the chat room with seller on the chat page

  Scenario: buyer sends message to seller
    Given the buyer is on the chat page
    When they enter a message and click send
    Then they should see the message in the chat room
