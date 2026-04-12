module Pages.Knowledgebase exposing (Model, Msg, page)

import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Html exposing (Html, a, div, h1, h5, i, img, li, p, section, span, text, ul)
import Html.Attributes as Attr
import Page
import Request exposing (Request)
import Shared
import Storage exposing (Storage)
import View exposing (View)


page : Shared.Model -> Request -> Page.With Model Msg
page shared _ =
    Page.element
        { init = init
        , update = update
        , view = view shared
        , subscriptions = \_ -> Sub.none
        }

-- Init
type Msg
    = ClickedToggleMenu

type alias Model =
    { showMenu: Bool
    }

init: (Model, Cmd Msg)
init =
    (Model False, Cmd.none)


-- Update
update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )

-- View

view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "Knowledge Base | Wayback Download"
    , body = [ viewHeader shared.storage.user "other" "" (Html.text "") (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1
             , viewFooter shared.year
             ]
    }

viewSection1: Html msg
viewSection1 =
    section
        [ Attr.class "padding-100-0 position-relative"
        ]
        [ div
            [ Attr.class "body_overlay_ono"
            ]
            []
        , div
            [ Attr.class "container"
            ]
            [ div
                [ Attr.class "col-md-12 help-center-header text-center"
                ]
                [ h1
                    [ Attr.class "help-center-title"
                    ]
                    [ span []
                        [ text "Help Center" ]
                    , text "We may have already answered your questions." ]
                ]
            , div
                [ Attr.class "row question-area-page justify-content-left mr-tp-120"
                ]
                [ div
                    [ Attr.class "col-md-4 no-phone-display"
                    ]
                    [ div
                        [ Attr.class "question-area-answer-navs"
                        ]
                        [ div
                            [ Attr.class "nuhost-filter-container"
                            ]
                            []
                        , div
                            [ Attr.class "nuhost-filter-list-container min-height-auto"
                            ]
                            [ ul
                                [ Attr.id "nuhost-filter-list"
                                ]
                                [ li []
                                    [ a
                                        [ Attr.href "#restore-cpanel"
                                        ]
                                        [ text "How do I upload the restored files to cPanel?", i
                                            [ Attr.class "fas fa-angle-right"
                                            ]
                                            []
                                        ]
                                    ]
                                , li []
                                    [ a
                                        [ Attr.href "#restore-ftp"
                                        ]
                                        [ text "How do I upload the restored files to an FTP/SFTP server?", i
                                            [ Attr.class "fas fa-angle-right"
                                            ]
                                            []
                                        ]
                                    ]
                                , li []
                                    [ a
                                        [ Attr.href "#only-readme"
                                        ]
                                        [ text "Why is there only a README file in the zip?", i
                                            [ Attr.class "fas fa-angle-right"
                                            ]
                                            []
                                        ]
                                    ]
                                , li []
                                    [ a
                                        [ Attr.href "#files-missing"
                                        ]
                                        [ text "Why are some files missing?", i
                                            [ Attr.class "fas fa-angle-right"
                                            ]
                                            []
                                        ]
                                    ]
                                , li []
                                    [ a
                                        [ Attr.href "#too-long"
                                        ]
                                        [ text "Why is the restore process taking so long?", i
                                            [ Attr.class "fas fa-angle-right"
                                            ]
                                            []
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                , div
                    [ Attr.class "col-md-8"
                    ]
                    [ div
                        [ Attr.class "question-area-answer-body"
                        ]
                        [ ul []
                            [ li
                                [ Attr.id "restore-cpanel"
                                ]
                                [ span []
                                    [ text "How do I upload the restored website files to cPanel?" ]
                                , p []
                                    [ text "1. Login to your cPanel account" ]
                                , p []
                                    [ text "2. Under the \"Files\" tab, click on \"File Manager\"" ]
                                , img
                                    [ Attr.alt "cpanel_1"
                                    , Attr.class "knowledgebase-image"
                                    , Attr.src "img/knowledgebase/cpanel_1.png"
                                    ]
                                    []
                                , p []
                                    [ text "3. Find the \"public_html\" folder and click on it" ]
                                , img
                                    [ Attr.alt "cpanel_2"
                                    , Attr.class "knowledgebase-image"
                                    , Attr.src "img/knowledgebase/cpanel_2.png"
                                    ]
                                    []
                                , p []
                                    [ text "4. Click the \"Upload\" button, and select the Zip file you downloaded from our dashboard" ]
                                , img
                                    [ Attr.alt "cpanel_3"
                                    , Attr.class "knowledgebase-image"
                                    , Attr.src "img/knowledgebase/cpanel_3.png"
                                    ]
                                    []
                                , p []
                                    [ text "5. Right click on the Zip file, and click \"Extract\"" ]
                                , img
                                    [ Attr.alt "cpanel_4"
                                    , Attr.class "knowledgebase-image"
                                    , Attr.src "img/knowledgebase/cpanel_4.png"
                                    ]
                                    []
                                ]
                            , li
                                [ Attr.id "restore-ftp"
                                ]
                                [ span []
                                    [ text "How do I upload the restored website files to an FTP/SFTP server?" ]
                                , p []
                                    [ text "1. Download the", a
                                        [ Attr.href "https://filezilla-project.org/"
                                        , Attr.target "_blank"
                                        ]
                                        [ text "Filezilla Client" ]
                                    , text "if you do not already have it installed" ]
                                , img
                                    [ Attr.alt "filezilla_1"
                                    , Attr.class "knowledgebase-image"
                                    , Attr.src "img/knowledgebase/filezilla_1.png"
                                    ]
                                    []
                                , p []
                                    [ text "2. Connect to your FTP server by entering the host, username, password and port (21 for FTP or 22 for SFTP), and click on \"Quickconnect\"" ]
                                , img
                                    [ Attr.alt "filezilla_2"
                                    , Attr.class "knowledgebase-image"
                                    , Attr.src "img/knowledgebase/filezilla_2.png"
                                    ]
                                    []
                                , p []
                                    [ text "3. Locate your restored website files in the left rectangle" ]
                                , img
                                    [ Attr.alt "filezilla_3"
                                    , Attr.class "knowledgebase-image"
                                    , Attr.src "img/knowledgebase/filezilla_3.png"
                                    ]
                                    []
                                , p []
                                    [ text "4. Drag and drop them in the right rectangle in the desired folder" ]
                                ]
                            , li
                                [ Attr.id "only-readme"
                                ]
                                [ span []
                                    [ text "Why is there only a README file in the zip file?" ]
                                , p []
                                    [ text "This usually happens when the selected timestamp leads to a bad snapshot on the Internet Archive's Wayback Machine (the timestamp exist, but nothing was saved). If this happens, please make sure that the corresponding snapshot on the", a
                                        [ Attr.href "https://web.archive.org/"
                                        , Attr.target "_blank"
                                        ]
                                        [ text "Wayback Machine" ]
                                    , text "is correct." ]
                                , p []
                                    [ text "You can also", a
                                        [ Attr.href "/contact"
                                        , Attr.target "_blank"
                                        ]
                                        [ text "contact us" ]
                                    , text "for help regarding this issue." ]
                                ]
                            , li
                                [ Attr.id "files-missing"
                                ]
                                [ span []
                                    [ text "Why are some files missing?" ]
                                , p []
                                    [ text "This is usually due to a bad snapshot on Internet Archive's Wayback Machine's part. You can validate this yourself by heading to the", a
                                        [ Attr.href "https://web.archive.org/"
                                        ]
                                        [ text "Wayback Machine" ]
                                    , text ", and trying to load the missing resource. In these cases, our system tries to grab the resource but gets an HTTP 404 error." ]
                                , p []
                                    [ text "It can also happen that our queries to the Internet Archives' Wayback Machine timeout due to an increased serverload on their part. In these cases, simply", a
                                        [ Attr.href "/contact"
                                        , Attr.target "_blank"
                                        ]
                                        [ text "contact us" ]
                                    , text ", and we will gladly re-run the restore process." ]
                                ]
                            , li
                                [ Attr.id "too-long"
                                ]
                                [ span []
                                    [ text "Why is the restore process taking so long to complete?" ]
                                , p []
                                    [ text "When you submit an order, the restore job is instantly placed in a queue. While we do our best to process orders as quickly as possible, many factors may slow down the restore process (like the size of the restore, or the number of items already in the queue)." ]
                                , p []
                                    [ text "With that said, if your order still hasn't been processed after 24 hours, please", a
                                        [ Attr.href "/contact"
                                        , Attr.target "_blank"
                                        ]
                                        [ text "contact us" ]
                                    , text ", and we will investigate issue." ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]