module Pages.About exposing (Model, Msg, page)

import Common.Header exposing (viewHeader)
import Common.Footer exposing (viewFooter)

import Html exposing (Html, a, br, div, h1, h2, h3, h5, i, img, main_, p, section, text)
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
type alias Model =
    { showMenu: Bool
    }

type Msg
    = ClickedToggleMenu

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
    { title = "About Wayback Download — Professional Website Recovery Service"
    , body = [ viewHeader shared.storage.user "sub" "" viewMain (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1
             , viewSection2
             , viewFooter shared.year
             ]
    }

viewMain: Html Msg
viewMain =
    main_
        [ Attr.class "container mb-auto"
        ]
        [ h1
            [ Attr.class "mt-3 main-header-text-title"
            ]
            [ text "About Wayback Download" ]
        ]

viewSection1: Html Msg
viewSection1 =
    section
            [ Attr.class "padding-0-100 position-relative"
            ]
            [ div
                [ Attr.class "container"
                ]
                [ div
                    [ Attr.class "row justify-content-between"
                    ]
                    [ div
                        [ Attr.class "col-md-7 about-us-img-section"
                        ]
                        [ img
                            [ Attr.src "img/demo/groupofworks.jpg"
                            , Attr.alt ""
                            ]
                            []
                        ]
                    , div
                        [ Attr.class "col-md-4 side-text-right-container d-flex mx-auto flex-column"
                        ]
                        [ div
                            [ Attr.class "mb-auto"
                            ]
                            []
                        , h2
                            [ Attr.class "side-text-right-title f-size25"
                            ]
                            [ text "Who are we,", br []
                                []
                            , text "and what do we do?" ]
                        , p
                            [ Attr.class "side-text-right-text f-size16"
                            ]
                            [ text "We are a tech startup focused on making it as easy and fast as possible to recover a lost or deleted website. Since launching, we have helped recover thousands of websites from the Wayback Machine for business owners, developers, and SEO professionals worldwide. The Internet Archive's Wayback Machine is an amazing product, but restoring websites from there can be a tedious and lengthy process — we built Wayback Download to eliminate that hassle.", br []
                                []
                            ]
                        , div
                            [ Attr.class "mt-auto"
                            ]
                            []
                        ]
                    ]
                ]
            ]

viewSection2: Html Msg
viewSection2 =
    section
            [ Attr.class "padding-100-0 position-relative how-it-work-section"
            ]
            [ div
                [ Attr.class "container"
                ]
                [ h2
                    [ Attr.class "title-default-coodiv-two"
                    ]
                    [ text "How We Restore Websites from the Wayback Machine" ]
                , div
                    [ Attr.class "row justify-content-center mr-tp-70 how-it-work-section-row"
                    ]
                    [ div
                        [ Attr.class "col-md-4"
                        ]
                        [ div
                            [ Attr.class "how-it-works-box"
                            ]
                            [ i
                                [ Attr.class "h-flaticon-011-globe-2"
                                ]
                                []
                            , h5 []
                                [ text "Choose a package" ]
                            , p []
                                [ text "Whether you're restoring a basic website or a Wordpress website, we've got you covered!" ]
                            ]
                        ]
                    , div
                        [ Attr.class "col-md-4"
                        ]
                        [ div
                            [ Attr.class "how-it-works-box"
                            ]
                            [ i
                                [ Attr.class "h-flaticon-014-calendar"
                                ]
                                []
                            , h5 []
                                [ text "Select a timestamp" ]
                            , p []
                                [ text "Head over to the ", a
                                    [ Attr.href "https://web.archive.org/"
                                    , Attr.target "_blank"
                                    ]
                                    [ text "Internet Archive's Wayback Machine" ]
                                , text ", and find the correct snapshot." ]
                            ]
                        ]
                    , div
                        [ Attr.class "col-md-4"
                        ]
                        [ div
                            [ Attr.class "how-it-works-box"
                            ]
                            [ i
                                [ Attr.class "h-flaticon-008-upload"
                                ]
                                []
                            , h5 []
                                [ text "Upload your files" ]
                            , p []
                                [ text "That's it! All you need to do is take the restored files and upload them to the server of your choice!" ]
                            ]
                        ]
                    ]
                ]
            ]