module Pages.WebsiteRecovery exposing (Model, Msg, page)

import Common.Header exposing (viewHeader)
import Common.Footer exposing (viewFooter)
import Html exposing (Html, a, br, div, h1, h2, h3, h5, i, li, main_, p, section, text, ul)
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
    { title = "Website Recovery Service — Restore Any Lost Website | Wayback Download"
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
            [ text "Professional Website Recovery Service from the Wayback Machine" ]
        ]

viewSection1: Html msg
viewSection1 =
    section
        [ Attr.class "padding-100-0 position-relative"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ h2
                [ Attr.class "title-default-coodiv-two"
                ]
                [ text "Recover Any Deleted or Lost Website — $29 Flat Fee" ]
            , div
                [ Attr.class "row justify-content-between"
                ]
                [ div
                    [ Attr.class "col-md-7"
                    ]
                    [ p []
                        [ text "Did your website disappear? Whether it was accidentally deleted, your hosting expired, or your developer went dark — the Internet Archive's Wayback Machine has likely captured your site." ]
                    , p []
                        [ text "Wayback Download transforms those archived snapshots into a fully functional website — all HTML, CSS, JavaScript, images and fonts restored, every URL rewritten, and archive.org headers stripped clean. You receive a zip file ready to upload to any hosting platform." ]
                    , h3 [ Attr.class "side-text-right-title f-size20 mr-tp-30" ]
                        [ text "What's Included in Every Website Recovery" ]
                    , ul [ Attr.class "second-pricing-table-body mr-tp-20" ]
                        [ li [] [ text "All HTML pages recovered with original content intact" ]
                        , li [] [ text "CSS stylesheets, JavaScript, images and fonts included" ]
                        , li [] [ text "Internal links automatically rewritten to your domain" ]
                        , li [] [ text "archive.org toolbar and wrapper headers stripped" ]
                        , li [] [ text "Delivered as a clean zip file by email" ]
                        , li [] [ text "Ready to upload to cPanel, Bluehost, SiteGround, or any host" ]
                        , li [] [ text "Supports up to 20,000 pages or 10 GB per restore" ]
                        ]
                    , a
                        [ Attr.class "second-pricing-table-button"
                        , Attr.href "/"
                        ]
                        [ text "Start Recovery — $29 →" ]
                    ]
                , div
                    [ Attr.class "col-md-4"
                    ]
                    [ div
                        [ Attr.class "second-pricing-table"
                        ]
                        [ h5
                            [ Attr.class "second-pricing-table-title"
                            ]
                            [ text "HTML Recovery", br [] [], text "$29 per domain" ]
                        , ul
                            [ Attr.class "second-pricing-table-body"
                            ]
                            [ li [] [ text "First domain: $29" ]
                            , li [] [ text "Each additional domain: $19" ]
                            , li [] [ text "Results delivered within 24 hours" ]
                            , li [] [ text "All file types included" ]
                            , li [] [ text "Secure checkout via Whop" ]
                            ]
                        , a
                            [ Attr.class "second-pricing-table-button"
                            , Attr.href "/"
                            ]
                            [ text "Order Now" ]
                        ]
                    ]
                ]
            ]
        ]

viewSection2: Html msg
viewSection2 =
    section
        [ Attr.class "padding-100-0 position-relative with-top-border"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ h2
                [ Attr.class "title-default-coodiv-two"
                ]
                [ text "Why Choose Wayback Download for Website Recovery?" ]
            , div
                [ Attr.class "row justify-content-start futures-version-2"
                ]
                [ div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-bolt fa-2x mb-3"
                            ]
                            []
                        , h5 []
                            [ text "Fast Turnaround" ]
                        , p []
                            [ text "Most recoveries are completed and delivered within 24 hours. We process orders in the queue so your site comes back quickly." ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-tag fa-2x mb-3"
                            ]
                            []
                        , h5 []
                            [ text "One Flat Fee" ]
                        , p []
                            [ text "No surprise bills. Pay $29 for the first domain and $19 for each additional domain on the same order. For regular use, check our subscription plans." ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-server fa-2x mb-3"
                            ]
                            []
                        , h5 []
                            [ text "Host-Ready Files" ]
                        , p []
                            [ text "We strip all archive.org headers and rewrite every internal URL so your restored site works on any hosting — no extra configuration needed." ]
                        ]
                    ]
                ]
            , div
                [ Attr.class "row mt-4"
                ]
                [ div
                    [ Attr.class "col text-center"
                    ]
                    [ p []
                        [ text "Looking to restore multiple sites per month? See our "
                        , a [ Attr.href "/subscription" ] [ text "bulk subscription plans" ]
                        , text " — starting at $39/month for up to 12 restores."
                        ]
                    ]
                ]
            ]
        ]
