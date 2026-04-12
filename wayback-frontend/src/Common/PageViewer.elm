module Common.PageViewer exposing (viewPages, numResultsPerPage, splitList, filterPages, checkRestoreContainsSearch, checkReceiptContainSearch)

import Common.Response exposing (Receipt, Restore)
import Html exposing (Html, button, li, nav, text, ul)
import Html.Attributes as Attr
import Html.Events exposing (onClick)
import List exposing (drop, take)
import String exposing (contains)


numResultsPerPage =
    5

splitList : Int -> List a -> List (List a)
splitList i list =
  case take i list of
    [] -> []
    listHead -> listHead :: splitList i (drop i list)

filterPages: Int -> List(List a) -> List a
filterPages pageNum splitLists =
    let
        sublist = (List.head (List.reverse (List.take pageNum splitLists)))
    in
    case sublist of
        Just l ->
            l

        Nothing ->
            []

checkRestoreContainsSearch: String -> Restore -> Bool
checkRestoreContainsSearch search restore =
    if (contains search restore.id) || (contains search restore.timestamp) || (contains search restore.domain) || (contains search restore.status) || (contains search restore.s3Url) || (contains search restore.transactDate) || (contains search restore.username) || (contains search restore.email) then
        True
    else
        False

checkReceiptContainSearch: String -> Receipt -> Bool
checkReceiptContainSearch search receipt =
    if (contains search receipt.id) || (contains search receipt.url) || (contains search receipt.date) || (contains search receipt.amount) then
        True
    else
        False

viewPages: msg -> msg -> (Int -> msg) -> Int -> Int -> Html msg
viewPages clickedPrevPage clickedNextPage clickedPageNum currentPage numPages =
    nav
        [ Attr.attribute "aria-label" "Page navigation example"
        ]
        [ ul
          [ Attr.class "pagination justify-content-center"
          ]
          (List.map (viewPage clickedPrevPage clickedNextPage clickedPageNum currentPage numPages) (List.range 0 (numPages + 1)))
        ]

viewPage: msg -> msg -> (Int -> msg) -> Int -> Int -> Int -> Html msg
viewPage clickedPrevPage clickedNextPage clickedPageNum currentPage numPages pageNum=
    if pageNum == 0 then
        li
            [ if currentPage == 1 then
                Attr.class "page-item disabled"
              else
                Attr.class "page-item"
            ]
            [ button
              [ Attr.class "page-link"
              , Attr.tabindex -1
              , onClick clickedPrevPage
              ]
              [ text "Previous" ]
            ]
    else if pageNum == (numPages + 1) then
        li
            [ if currentPage == numPages then
                Attr.class "page-item disabled"
              else
                Attr.class "page-item"
            ]
            [ button
              [ Attr.class "page-link"
              , onClick clickedNextPage
              ]
              [ text "Next" ]
            ]
    else
        li
            [ (if currentPage == pageNum then
                    Attr.class "page-item active"
               else
                    Attr.class "page-item"
              )
            ]
            [ button
              [ Attr.class "page-link"
              , onClick (clickedPageNum pageNum)
              ]
              [ text (String.fromInt pageNum) ]
            ]