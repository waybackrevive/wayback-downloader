module Pages.PbnRestoration exposing (Model, Msg, page)

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
    { title = "PBN Website Restoration — Bulk Restore from the Wayback Machine | Wayback Download"
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
            [ text "PBN & Private Blog Network Website Restoration Service" ]
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
                [ text "Restore Expired PBN Sites in Bulk from Archive.org" ]
            , div
                [ Attr.class "row justify-content-between"
                ]
                [ div
                    [ Attr.class "col-md-8"
                    ]
                    [ p []
                        [ text "Building or restoring a private blog network? Wayback Download lets you recover the full HTML content of expired domains from archived snapshots at scale — restoring them as clean, host-ready websites." ]
                    , p []
                        [ text "Our bulk subscription plans are built specifically for SEO professionals and link builders who need to restore many sites per month. With up to 100 restores per month in our Premium plan, you can rebuild your PBN assets quickly and cost-effectively." ]
                    , h3 [ Attr.class "side-text-right-title f-size20 mr-tp-30" ]
                        [ text "Why SEO Professionals Choose Wayback Download" ]
                    , ul []
                        [ li [] [ text "Flat per-site fee from $29 — or bulk subscription for volume" ]
                        , li [] [ text "Full HTML content — all pages, posts, images and CSS" ]
                        , li [] [ text "archive.org headers and footers fully stripped from every page" ]
                        , li [] [ text "Internal links rewritten — no broken paths" ]
                        , li [] [ text "Works with any hosting (cPanel, Cloudways, Vultr)" ]
                        , li [] [ text "Results within 24 hours per restore" ]
                        , li [] [ text "Handles large sites up to 20,000 pages or 10 GB" ]
                        ]
                    , a
                        [ Attr.class "second-pricing-table-button"
                        , Attr.href "/subscription"
                        ]
                        [ text "View Bulk Plans — From $39/mo →" ]
                    ]
                , div
                    [ Attr.class "col-md-3"
                    ]
                    [ div
                        [ Attr.class "second-pricing-table style-2 active"
                        ]
                        [ h5
                            [ Attr.class "second-pricing-table-title"
                            ]
                            [ text "Bulk Subscription", br [] [], text "from $39/mo" ]
                        , ul
                            [ Attr.class "second-pricing-table-body"
                            ]
                            [ li [] [ text "Basic: 12 restores/month" ]
                            , li [] [ text "Premium: 100 restores/month" ]
                            , li [] [ text "Priority processing" ]
                            , li [] [ text "Cancel any time" ]
                            ]
                        , a
                            [ Attr.class "second-pricing-table-button"
                            , Attr.href "/subscription"
                            ]
                            [ text "Get Started" ]
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
                [ text "PBN Restoration Plans" ]
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
                            [ Attr.class "fas fa-globe fa-2x mb-3"
                            ]
                            []
                        , h5 []
                            [ text "One-Time Restore" ]
                        , p []
                            [ text "Restoring a single expired domain? Pay just $29 for the first domain and $19 for each additional domain added to the same order." ]
                        , a [ Attr.href "/" ] [ text "Order now →" ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-layer-group fa-2x mb-3"
                            ]
                            []
                        , h5 []
                            [ text "Basic Plan — $39/mo" ]
                        , p []
                            [ text "Up to 12 HTML restores per month. Perfect for smaller PBNs and consistent domain acquisition workflows." ]
                        , a [ Attr.href "/subscription" ] [ text "Subscribe →" ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-rocket fa-2x mb-3"
                            ]
                            []
                        , h5 []
                            [ text "Premium Plan — $95/mo" ]
                        , p []
                            [ text "Up to 100 HTML restores per month. Built for active link builders and agencies managing large-scale PBN operations." ]
                        , a [ Attr.href "/subscription" ] [ text "Subscribe →" ]
                        ]
                    ]
                ]
            ]
        ]
