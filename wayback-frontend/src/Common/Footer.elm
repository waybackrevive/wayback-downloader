module Common.Footer exposing (viewFooter)

import Shared
import Html exposing (Html, a, div, img, li, section, span, text, ul)
import Html.Attributes as Attr

viewFooter: Int -> Html msg
viewFooter year =
    section
        [ Attr.class "footer-section"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ div
                [ Attr.class "mr-tp-40 row justify-content-between footer-area-under"
                ]
                [ div
                    [ Attr.class "col-md-4"
                    ]
                    [ a
                        [ Attr.href "#"
                        ]
                        [ img
                            [ Attr.alt "Wayback Machine Downloader"
                            , Attr.class "footer-logo-blue"
                            , Attr.src "/img/header/logo-w.png"
                            ]
                            []
                        ]
                    ]
                , div
                    [ Attr.class "col-md-4 row"
                    ]
                    [ ul
                        [ Attr.class "under-footer-ullist text-right"
                        ]
                        [ li []
                            [ a
                                [ Attr.href "/privacy"
                                ]
                                [ text "Privacy policy" ]
                            ]
                        , li []
                            [ a
                                [ Attr.href "/terms"
                                ]
                                [ text "Terms of Service" ]
                            ]
                        ]
                    ]
                ]
            , div
                [ Attr.class "row justify-content-between final-footer-area mr-tp-40"
                ]
                [ div
                    [ Attr.class "final-footer-area-text"
                    ]
                    [ text "© Copyright", span
                        [ Attr.id "copyright-year"
                        ]
                        [ text (" " ++ (String.fromInt year) ++ " ") ]
                    , text "Wayback Download" ]
                ]
            ]
        ]
