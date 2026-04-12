module Pages.Success.Id_ exposing (Model, Msg, page)

import Common.CustomHttp as CustomHttp
import Common.Header exposing (viewHeader)
import Common.Footer exposing (viewFooter)
import Environment exposing (EnvironmentVar)
import Gen.Params.Success.Id_ exposing (Params)
import Html exposing (Html, a, div, h3, h4, h6, hr, main_, p, table, tbody, td, text, th, thead, tr)
import Html.Attributes as Attr
import Http
import Page
import Proto.Response as Proto exposing (Restore)
import Request exposing (Request)
import Shared
import Storage exposing (Storage)
import View exposing (View)

page : Shared.Model -> Request.With Params -> Page.With Model Msg
page shared req =
    Page.element
        { init = init req.params shared
        , update = update
        , view = view shared
        , subscriptions = \_ -> Sub.none
        }

-- Init

type Status
    = Loading
    | Failure
    | ServerError
    | Success

type alias Model =
    { id: String
    , status: Status
    , restore: List(Restore)
    , showMenu: Bool
    }

type Msg
    = RestoreResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

init: Params -> Shared.Model -> (Model, Cmd Msg)
init params shared =
    let
        model = Model params.id Loading [] False
    in
    (model, getRestores shared.env model)


-- Update

getRestores: EnvironmentVar -> Model -> Cmd Msg
getRestores env model =
    Http.get
        { url = env.serverUrl ++ "/restore/" ++ model.id
        , expect = CustomHttp.expectProto RestoreResp Proto.decodeResponse
        }

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        RestoreResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure }, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    if (List.length data.restores) >= 1 then
                                        ( { model | restore = data.restores, status = Success }, Cmd.none)
                                    else
                                        ( { model | status = ServerError }, Cmd.none)
                                Nothing ->
                                    ( { model | status = Failure }, Cmd.none)
                Err _ ->
                    ( { model | status = Failure }, Cmd.none)

        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )


-- View

view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "Success | Wayback Download"
    , body = [ viewHeader shared.storage.user "sub" "" viewMain (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection model
             , viewFooter shared.year
             ]
    }

viewMain: Html Msg
viewMain =
    main_
        [ Attr.class "container mb-auto"
        ]
        [ h3
            [ Attr.class "mt-3 main-header-text-title"
            ]
            [ text "Order Summary" ]
        ]

viewSection: Model -> Html Msg
viewSection model =
    main_
        [ Attr.class "container mb-auto"]
        [ div
              [ Attr.class "row justify-content-start futures-version-2" ]
              [ div
                  [ Attr.class "col-md" ]
                  [ case model.status of
                      Loading -> viewLoading
                      Success -> viewValidOrder model
                      Failure -> viewInvalidOrder
                      ServerError -> viewServerError
                  ]

              ]
        ]

viewLoading: Html Msg
viewLoading =
    div
          [ Attr.class "futures-version-3-box"
          ]
          [ h4 []
              [ text "Loading..." ]
          ]

viewInvalidOrder: Html Msg
viewInvalidOrder =
    div
          [ Attr.class "futures-version-3-box"
          ]
          [ h4 []
              [ text "Invalid Order!" ]
          , p []
              [ text "This is an invalid order." ]
          , p []
              [ text "If you are sure that this is the correct URL, please contact our support: ", a
                  [ Attr.href "mailto:support@wayback.download"
                  ]
                  [ text "support@wayback.download" ]
              ]
          ]

viewServerError: Html Msg
viewServerError =
    div
          [ Attr.class "futures-version-3-box"
          ]
          [ h4 []
              [ text "Failed to process order!" ]
          , p []
              [ text "The order has failed to process." ]
          , p []
              [ text "Please contact our support: ", a
                  [ Attr.href "mailto:support@wayback.download"
                  ]
                  [ text "support@wayback.download" ]
              ]
          ]

viewValidOrder: Model -> Html Msg
viewValidOrder model =
    div
          [ Attr.class "futures-version-3-box"
          ]
          [ h4 []
                [ text "Success!" ]
          ,     p []
                [ text "We've got your order and will be processing it shortly!" ]
          ,     p []
                [ text "Keep an eye out for emails from us, as this is how you will be receiving your restored files as well as your receipt." ]
          ,     hr []
                []
          ,     div
                [ Attr.class ""
                ]
                [ h6 []
                    [ text "Here's your order summary:" ]
                , table
                    [ Attr.class "table table-bordered"
                    ]
                    [ thead []
                        [ tr []
                            [ th
                                [ Attr.scope "col"
                                ]
                                [ text "Domain" ]
                            , th
                                [ Attr.scope "col"
                                ]
                                [ text "Timestamp" ]
                            , th
                                [ Attr.scope "col"
                                ]
                                [ text "Price" ]
                            ]
                        ]
                    , tbody []
                        (List.map viewItem model.restore)
                    ]
                ]
          ]

viewItem: Restore -> Html Msg
viewItem restore =
    tr []
        [ td []
            [ text restore.domain ]
        , td []
            [ text restore.timestamp ]
        , td []
            [ text "9$" ]
        ]