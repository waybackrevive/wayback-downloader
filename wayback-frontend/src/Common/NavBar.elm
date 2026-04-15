module Common.NavBar exposing (viewNavbar)

import Domain.User exposing (User)
import Gen.Route as Route
import Html exposing (Html, a, button, div, img, li, nav, p, span, strong, text, ul)
import Html.Attributes as Attr exposing (alt, attribute, class, href, id, src, style)
import Html.Events exposing (onClick)

viewNavbar: Maybe User -> msg -> Bool -> Html msg
viewNavbar user clickedToggleMenu showMenu =
    div []
        [ viewAnnouncementBanner
        , nav
        [ class "navbar navbar-expand-md fixed-header-layout"
        , id "coodiv-navbar-header"
        , if showMenu then
            Attr.style "background" "#151621"
          else
            Attr.style "" ""
        ]
        [ div [ class "container main-header-coodiv-s" ]
            [ a [ class "navbar-brand", href "/" ]
                [ img [ alt "Wayback Machine Downloader", class "w-logo", src "/img/header/logo-w.png" ]
                    []
                , text "				"
                , img [ alt "Wayback Machine Downloader", class "b-logo", src "/img/header/logo.svg" ]
                    []
                , text "				"
                ]
            , button
                [ class "navbar-toggle offcanvas-toggle menu-btn-span-bar ml-auto"
                , attribute "data-target" "#offcanvas-menu-home"
                , attribute "data-toggle" "offcanvas"
                , onClick clickedToggleMenu
                ]
                [ span []
                    []
                , span []
                    []
                , span []
                    []
                ]
            , div
                [ class "collapse navbar-collapse navbar-offcanvas"
                , id "offcanvas-menu-home"
                , if showMenu then
                    Attr.style "position" "static"
                  else
                    Attr.style "" ""
                ]
                [ case user of
                    Just u -> ul [ class "navbar-nav ml-auto" ] (List.append navList (adminNavList u))
                    Nothing -> ul [ class "navbar-nav ml-auto" ] navList
               ]
            , ul [ class "header-user-info-coodiv" ]
                [ li [ class "dropdown" ]
                    [ case user of
                        Just _ -> li [ class "nav-item" ]
                                    [ a [ href "/logout", id "header-login-dropdown" ]
                                        [ text "Logout" ]
                                    , li []
                                        []
                                    ]
                        Nothing -> li [ class "nav-item" ]
                                      [ a [ href "/login", id "header-login-dropdown" ]
                                          [ text "Login" ]
                                      , li []
                                          []
                                      ]
                    ]
                ]
            ]
        ]
        ]

viewAnnouncementBanner : Html msg
viewAnnouncementBanner =
    div
        [ style "background" "linear-gradient(90deg, #6c3fe0 0%, #9b59b6 100%)"
        , style "color" "#fff"
        , style "text-align" "center"
        , style "padding" "10px 20px"
        , style "font-size" "14px"
        , style "font-weight" "500"
        , style "letter-spacing" "0.3px"
        , style "z-index" "9999"
        , style "position" "relative"
        ]
        [ strong [] [ text "$29 Website Recovery — " ]
        , text "Restore any lost website from archive.org. All links fixed & ready to upload. "
        , a [ style "color" "#fff", style "text-decoration" "underline", href "/" ] [ text "Get started →" ]
        ]

navList: List(Html msg)
navList =
    [ li [ class "nav-item" ]
            [ a [ class "nav-link", href (Route.toHref Route.Home_ ) ]
                [ text "Home" ]
            ]
        , li [ class "nav-item dropdown" ]
            [ a [ class "nav-link dropdown-toggle"
                , href "#"
                , attribute "data-toggle" "dropdown"
                , attribute "role" "button"
                , attribute "aria-haspopup" "true"
                , attribute "aria-expanded" "false"
                ]
                [ text "Services" ]
            , div [ class "dropdown-menu" ]
                [ a [ class "dropdown-item", href "/website-recovery" ] [ text "Website Recovery" ]
                , a [ class "dropdown-item", href "/expired-domain-recovery" ] [ text "Expired Domain Recovery" ]
                , a [ class "dropdown-item", href "/pbn-restoration" ] [ text "PBN Restoration" ]
                ]
            ]
        , li [ class "nav-item" ]
            [ a [ class "nav-link", href (Route.toHref Route.Subscription ) ]
                [ text "Pricing" ]
            ]
        , li [ class "nav-item" ]
            [ a [ class "nav-link", href (Route.toHref Route.Knowledgebase ) ]
                [ text "Help" ]
            ]
        , li [ class "nav-item" ]
            [ a [ class "nav-link", href (Route.toHref Route.Contact ) ]
                [ text "Contact" ]
            ]
    ]

adminNavList: User -> List(Html msg)
adminNavList user =
    [ li [ class "nav-item" ]
         (if user.admin then
             [ a [ class "nav-link", href (Route.toHref Route.Admin ) ]
                 [ text "Admin" ]
             ]
         else
            [ a [ class "nav-link", href (Route.toHref Route.Dashboard ) ]
                 [ text "Dashboard" ]
             ]
         )
    , li [ class "nav-item" ]
         [ a [ class "nav-link", href (Route.toHref Route.Order ) ]
             [ text "Order" ]
         ]
    , li [ class "nav-item" ]
         [ a [ class "nav-link", href (Route.toHref Route.Subscription ) ]
             [ text "Subscriptions" ]
         ]
    ]
