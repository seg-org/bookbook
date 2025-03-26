@search
Feature: Buyer's Autocomplete (US2-5)
  As a buyer
  I want the system to assist me by auto-filling book title during my search
  so that I can perform searches more efficiently when I have sufficient initial data

  Background:
    Given the buyer, about to test autocomplete, is on the search page

  Scenario Outline: Autocomplete on existing book title
    When they enter a book title <title_initial>
    Then they should see suggestions for book titles that match <title_initial>
    When they click on a suggestion <title_selected>
    Then the search field should be filled with the selected book title <title_selected>
    And the suggestion box should disappear

    Examples:
      | title_initial | title_selected                                |
      | "Mao Tse"     | "Quotations from Chairman Mao Tse-Tung"       |
      | "女子高生"    | "人妻教師が教え子の女子高生にドはまりする話"  |
      | "女子高生"    | "人妻教師が教え子の女子高生にドはまりする話2" |

  Scenario: Autocomplete on book title with no match
    When they enter a book title "Yuri Brutal Segg"
    Then they should see suggestions showing "ไม่พบข้อมูล"
