module Pages.ExpiredDomainRecovery exposing (Model, Msg, page)

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
    { title = "Expired Domain Recovery — Restore a Deleted Domain Website | Wayback Download"
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
            [ text "Recover Your Expired Domain Website from Archive.org" ]
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
                [ text "Restore an Expired Domain Website in Minutes" ]
            , div
                [ Attr.class "row justify-content-between"
                ]
                [ div
                    [ Attr.class "col-md-8"
                    ]
                    [ p []
                        [ text "When a domain expires and the website goes offline, its content is often still preserved in the Internet Archive's Wayback Machine. Wayback Download lets you recover that content as a clean, host-ready website — ready to re-launch on the original domain or a new one." ]
                    , p []
                        [ text "Whether your domain lapsed by accident, you're rebuilding an old project, or you've re-registered an expired domain and want its original content back — we restore the full archived version: all pages, stylesheets, images, and JavaScript." ]
                    , h3 [ Attr.class "side-text-right-title f-size20 mr-tp-30" ]
                        [ text "Common Expired Domain Recovery Use Cases" ]
                    , ul [ Attr.class "second-pricing-table-body mr-tp-20" ]
                        [ li [] [ text "Re-registered your old expired domain and want the site back" ]
                        , li [] [ text "Acquired an expired domain that had valuable content" ]
                        , li [] [ text "Business domain expired during a lapse — need site restored fast" ]
                        , li [] [ text "Lost access to hosting and need content from the archived version" ]
                        , li [] [ text "Rebuilding an old project from scratch using the archived files" ]
                        ]
                    , a
                        [ Attr.class "second-pricing-table-button"
                        , Attr.href "/"
                        ]
                        [ text "Recover Your Domain — $29 →" ]
                    ]
                , div
                    [ Attr.class "col-md-3"
                    ]
                    [ div
                        [ Attr.class "second-pricing-table"
                        ]
                        [ h5
                            [ Attr.class "second-pricing-table-title"
                            ]
                            [ text "Domain Recovery", br [] [], text "from $29" ]
                        , ul
                            [ Attr.class "second-pricing-table-body"
                            ]
                            [ li [] [ text "Single domain: $29" ]
                            , li [] [ text "Each additional: $19" ]
                            , li [] [ text "Delivered within 24 hours" ]
                            , li [] [ text "All assets included" ]
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
                [ text "How Expired Domain Recovery Works" ]
            , div
                [ Attr.class "row justify-content-start futures-version-2 mr-tp-30"
                ]
                [ div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-search fa-2x mb-3"
                            ]
                            []
                        , h5 []
                            [ text "1. Find the Archived Snapshot" ]
                        , p []
                            [ text "Enter your expired domain on the homepage. We check the Wayback Machine for all snapshots taken before the domain went offline. You pick the date." ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-cogs fa-2x mb-3"
                            ]
                            []
                        , h5 []
                            [ text "2. We Restore the Files" ]
                        , p []
                            [ text "Our system downloads all pages, assets and fonts from the archive, rewrites all internal links, and strips the archive.org wrapper, clean and ready." ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-upload fa-2x mb-3"
                            ]
                            []
                        , h5 []
                            [ text "3. Upload & Go Live Again" ]
                        , p []
                            [ text "Point your domain DNS to any host and upload the zip file. Your expired domain website is back online — no developer needed." ]
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
                        [ text "Restoring multiple expired domains regularly? Our "
                        , a [ Attr.href "/subscription" ] [ text "bulk subscription" ]
                        , text " covers up to 100 restores per month — perfect for domain buyers and SEO professionals."
                        ]
                    ]
                ]
            ]
        ]
