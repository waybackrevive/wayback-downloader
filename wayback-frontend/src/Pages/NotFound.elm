module Pages.NotFound exposing (Model, Msg, page)

import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Html exposing (Html, div, h1, h6, img, section, text)
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


update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )


view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "Not Found | Wayback Download"
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
            [ Attr.class "container"
            ]
            [ div
                [ Attr.class "page-404-styles text-center"
                ]
                [ img
                    [ Attr.alt "404"
                    , Attr.src "/img/header/404.png"
                    ]
                    []
                , h1
                    [ Attr.class "message-error"
                    ]
                    [ text "Ooops! Sorry this page does not exist!" ]
                ]
            ]
        ]