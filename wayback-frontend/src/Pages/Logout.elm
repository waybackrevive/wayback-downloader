module Pages.Logout exposing (Model, Msg, page)

import Gen.Route
import Page
import Storage exposing (Storage, signOut)
import Request exposing (Request)
import Shared
import View exposing (View)


page : Shared.Model -> Request -> Page.With Model Msg
page shared req =
    Page.element
        { init = init req shared.storage
        , update = \_ model -> (model, Cmd.none)
        , view = \_ -> View.none
        , subscriptions = \_ -> Sub.none
        }

-- Init

type alias Model =
    {}

type Msg
    = NoOp

init : Request -> Storage -> (Model, Cmd Msg)
init req storage =
    ( Model
    , Cmd.batch [ signOut storage
                , Request.replaceRoute Gen.Route.Login req
                ]
    )