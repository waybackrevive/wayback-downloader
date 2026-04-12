module Common.Header exposing (..)

import Common.NavBar exposing (viewNavbar)
import Domain.User exposing (User)
import Html exposing (Html, a, b, br, button, canvas, div, h3, h4, i, img, input, li, main_, nav, p, span, text, ul)
import Html.Attributes as Attr
import Html.Events exposing (onClick)

viewHeader: Maybe User -> String -> String -> Html msg -> Html msg -> msg -> Bool -> Html msg
viewHeader user type_ domain main modal clickedToggleMenu showMenu =
    div
        [ case type_ of
            "main" -> Attr.class "d-flex mx-auto flex-column moon-edition"
            "sub" -> Attr.class "d-flex mx-auto flex-column subpages-header moon-edition"
            _ -> Attr.class "subpages-header-min moon-edition"

        , Attr.id "coodiv-header"
        ]
        [ div
            [ Attr.class "bg_overlay_header"
            ]
            [ div
                [ Attr.id "particles-bg"
                ]
                [ case type_ of
                    "main" -> viewParticles
                    _ -> canvas [] []
                ]
            , div
                [ Attr.class "bg-img-header-new-moon"
                ]
                []
            , span
                [ Attr.class "header-shapes shape-02"
                ]
                []
            , span
                [ Attr.class "header-shapes shape-03"
                ]
                []
            ]
        , viewNavbar user clickedToggleMenu showMenu
        , div
            [ Attr.class "mt-auto header-top-height"
            ]
            []
        , main
        , modal
        , div
            [ Attr.class "mt-auto"
            ]
            []
        ]

viewModal: String -> Html msg
viewModal domain =
    div
        [ Attr.class "modal"
        , Attr.attribute "data-backdrop" "static"
        , Attr.attribute "data-keyboard" "false"
        , Attr.id "helpModal"
        ]
        [ div
            [ Attr.class "modal-dialog modal-lg"
            ]
            [ div
                [ Attr.class "modal-content"
                ]
                [ div
                    [ Attr.class "modal-header"
                    ]
                    [ h4
                        [ Attr.class "modal-title"
                        ]
                        [ text "Restoring a website from the Wayback Machine is simple!" ]
                    , button
                        [ Attr.class "close"
                        , Attr.attribute "data-dismiss" "modal"
                        , Attr.id "exit"
                        , Attr.type_ "button"
                        ]
                        [ text "×" ]
                    ]
                , div
                    [ Attr.class "modal-body"
                    ]
                    [ p []
                        [ b []
                            [ text "Step 1. " ]
                        , text "Navigate to the ", a
                            [ Attr.href ("https://web.archive.org/web/*/" ++ domain)
                            , Attr.id "wayback_url"
                            , Attr.target "_blank"
                            ]
                            [ text "Wayback Machine" ]
                        ]
                    , p []
                        [ b []
                            [ text "Step 2. " ]
                        , text "Select a snapshot using the date selector" ]
                    , p []
                        [ b []
                            [ text "Step 3. " ]
                        , text "Copy the URL in the bar below" ]
                    , div
                        [ Attr.id "checkoutHomeAlert"
                        , Attr.attribute "role" "alert"
                        ]
                        []
                    , div
                        [ Attr.class "col-md"
                        , Attr.id "domain-search-header"
                        ][
                        i
                            [ Attr.class "fas fa-globe"
                            ]
                            []
                        , input
                            [ Attr.id "url-checkout"
                            , Attr.name "url"
                            , Attr.placeholder "https://web.archive.org/web/20210130001414/http://example.com/"
                            , Attr.type_ "text"
                            ]
                            []
                        , span
                            [ Attr.class "inline-button-domain-order"
                            ]
                            [ button
                                [ Attr.attribute "data-placement" "left"
                                , Attr.attribute "data-toggle" "tooltip"
                                , Attr.id "transfer-btn-2"
                                , Attr.name "restore"
                                , Attr.type_ "submit"
                                , Attr.value "Restore"
                                ]
                                [ i
                                    [ Attr.class "fas fa-check"
                                    ]
                                    []
                                ]
                            ]
                        ]
                        , br []
                                  []
                              , p []
                                  [ text " If you require any assistance during this process, our", a
                                      [ Attr.href "mailto:support@wayback.download"
                                      ]
                                      [ text "support team" ]
                                  , text "would be more than happy to help you out!" ]
                                  , div
                                          [ Attr.class "modal-footer"
                                          ]
                                          [ button
                                              [ Attr.class "btn btn-danger"
                                              , Attr.attribute "data-dismiss" "modal"
                                              , Attr.id "cancel"
                                              , Attr.type_ "button"
                                              ]
                                              [ text "Cancel" ]
                                          ]
                                      ]
                              ]
                        ]

        ]

viewParticles: Html msg
viewParticles =
    canvas
        [ Attr.class "particles-js-canvas-el"
        , Attr.style "width" "100%"
        , Attr.style "height" "100%"
        , Attr.width 1908
        , Attr.height 954
        ]
        []

