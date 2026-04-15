module Common.Footer exposing (viewFooter)

import Shared
import Html exposing (Html, a, div, h5, img, li, p, section, small, span, strong, text, ul)
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
                -- Column 1: Brand + description
                [ div
                    [ Attr.class "col-md-4 mb-4"
                    ]
                    [ a
                        [ Attr.href "/"
                        ]
                        [ img
                            [ Attr.alt "Wayback Download — Website Recovery Service"
                            , Attr.class "footer-logo-blue"
                            , Attr.src "/img/header/logo-w.png"
                            ]
                            []
                        ]
                    , p
                        [ Attr.style "margin-top" "14px"
                        , Attr.style "font-size" "0.88rem"
                        , Attr.style "line-height" "1.6"
                        , Attr.style "opacity" "0.8"
                        ]
                        [ text "Professional website recovery from the Wayback Machine. We restore lost websites — HTML, CSS, images and all links fixed — ready to upload to any host." ]
                    , p
                        [ Attr.style "margin-top" "10px"
                        , Attr.style "font-size" "0.85rem"
                        ]
                        [ a
                            [ Attr.href "mailto:support@wayback.download"
                            , Attr.style "opacity" "0.8"
                            ]
                            [ text "support@wayback.download" ]
                        ]
                    ]
                -- Column 2: Services
                , div
                    [ Attr.class "col-md-2 mb-4"
                    ]
                    [ h5
                        [ Attr.style "font-size" "0.9rem"
                        , Attr.style "font-weight" "700"
                        , Attr.style "text-transform" "uppercase"
                        , Attr.style "letter-spacing" "0.8px"
                        , Attr.style "margin-bottom" "14px"
                        ]
                        [ text "Services" ]
                    , ul
                        [ Attr.class "under-footer-ullist"
                        ]
                        [ li []
                            [ a [ Attr.href "/website-recovery" ] [ text "Website Recovery" ] ]
                        , li []
                            [ a [ Attr.href "/expired-domain-recovery" ] [ text "Expired Domains" ] ]
                        , li []
                            [ a [ Attr.href "/pbn-restoration" ] [ text "PBN Restoration" ] ]
                        , li []
                            [ a [ Attr.href "/subscription" ] [ text "Subscription Plans" ] ]
                        ]
                    ]
                -- Column 3: Company
                , div
                    [ Attr.class "col-md-2 mb-4"
                    ]
                    [ h5
                        [ Attr.style "font-size" "0.9rem"
                        , Attr.style "font-weight" "700"
                        , Attr.style "text-transform" "uppercase"
                        , Attr.style "letter-spacing" "0.8px"
                        , Attr.style "margin-bottom" "14px"
                        ]
                        [ text "Company" ]
                    , ul
                        [ Attr.class "under-footer-ullist"
                        ]
                        [ li []
                            [ a [ Attr.href "/about" ] [ text "About Us" ] ]
                        , li []
                            [ a [ Attr.href "/contact" ] [ text "Contact" ] ]
                        , li []
                            [ a [ Attr.href "/knowledgebase" ] [ text "Help Center" ] ]
                        , li []
                            [ a [ Attr.href "https://web.archive.org/", Attr.target "_blank" ] [ text "Wayback Machine" ] ]
                        ]
                    ]
                -- Column 4: Account
                , div
                    [ Attr.class "col-md-2 mb-4"
                    ]
                    [ h5
                        [ Attr.style "font-size" "0.9rem"
                        , Attr.style "font-weight" "700"
                        , Attr.style "text-transform" "uppercase"
                        , Attr.style "letter-spacing" "0.8px"
                        , Attr.style "margin-bottom" "14px"
                        ]
                        [ text "Account" ]
                    , ul
                        [ Attr.class "under-footer-ullist"
                        ]
                        [ li []
                            [ a [ Attr.href "/login" ] [ text "Log In" ] ]
                        , li []
                            [ a [ Attr.href "/signup" ] [ text "Sign Up Free" ] ]
                        , li []
                            [ a [ Attr.href "/order" ] [ text "Place an Order" ] ]
                        , li []
                            [ a [ Attr.href "/dashboard" ] [ text "Dashboard" ] ]
                        ]
                    ]
                ]
            -- Bottom bar
            , div
                [ Attr.class "row justify-content-between final-footer-area mr-tp-40"
                , Attr.style "border-top" "1px solid rgba(255,255,255,0.1)"
                , Attr.style "padding-top" "20px"
                ]
                [ div
                    [ Attr.class "final-footer-area-text"
                    ]
                    [ text "© Copyright"
                    , span
                        [ Attr.id "copyright-year"
                        ]
                        [ text (" " ++ (String.fromInt year) ++ " ") ]
                    , text "Wayback Download. All rights reserved."
                    ]
                , div []
                    [ a
                        [ Attr.href "/privacy"
                        , Attr.style "margin-right" "16px"
                        , Attr.style "font-size" "0.82rem"
                        , Attr.style "opacity" "0.7"
                        ]
                        [ text "Privacy Policy" ]
                    , a
                        [ Attr.href "/terms"
                        , Attr.style "font-size" "0.82rem"
                        , Attr.style "opacity" "0.7"
                        ]
                        [ text "Terms of Service" ]
                    ]
                ]
            ]
        ]
