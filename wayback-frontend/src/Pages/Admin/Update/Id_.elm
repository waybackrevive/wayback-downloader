module Pages.Admin.Update.Id_ exposing (Model, Msg, page)

import Common.Alert exposing (viewAlertError, viewAlertSuccess)
import Common.CustomHttp as CustomHttp
import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Response exposing (Receipt, Response, Restore)
import Common.Spinner exposing (viewSpinnerText)
import DateFormat
import Domain.User exposing (User)
import Environment exposing (EnvironmentVar)
import Gen.Params.Admin.Update.Id_ exposing (Params)
import Gen.Route as Route
import Html.Attributes as Attr
import Html.Events exposing (onClick, onInput)
import Http exposing (jsonBody)
import Protobuf.Encode as Encode
import Request exposing (Request)
import Html exposing (Html, a, br, button, div, h3, h4, h5, i, iframe, input, label, main_, option, p, section, select, span, table, tbody, td, text, textarea, th, thead, tr)
import Page
import Proto.Response as Proto
import Shared
import Storage exposing (Storage)
import Time
import View exposing (View)


page : Shared.Model -> Request.With Params -> Page.With Model Msg
page shared req =
    Page.protected.element <|
        \user ->
            { init = init shared user req
            , update = update shared.env user shared.storage
            , view = view shared
            , subscriptions = \_ -> Sub.none
            }

-- Init

type Status
    = Loading
    | Success String
    | Failure String
    | None

type Msg
    = RestoreResp (Result Http.Error Proto.Response)
    | UpdateResp (Result Http.Error Proto.Response)
    | ClickedUpdate
    | ChangedSelect String
    | ChangeS3URL String
    | ChangeEmail String
    | ChangeDomain String
    | ChangeTimestamp String
    | ClickedToggleMenu

type alias Model =
    { status: Status
    , restore: Restore
    , showMenu: Bool
    }

init: Shared.Model -> User -> Request.With Params -> (Model, Cmd Msg)
init shared user req =
    let
        model = (Model None (Restore "" "" "" "" "" "" "" "") False)
    in
    if not user.admin then
        ( model
        , Request.replaceRoute Route.Dashboard req
        )
    else
        ( model, getRestore shared.env user shared.storage req.params.id )



-- Update

getRestore: EnvironmentVar -> User -> Storage -> String -> Cmd Msg
getRestore env user storage id =
    Http.request
        { url = env.serverUrl ++ "/admin/restore/" ++ id
        , method = "GET"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token) ]
        , body = Http.emptyBody
        , expect = CustomHttp.expectProto RestoreResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }

updateRestore: EnvironmentVar -> User -> Model -> (Model, Cmd Msg)
updateRestore env user model =
    ( model
    , Http.request
        { url = env.serverUrl ++ "/admin/update"
        , method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token) ]
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeRestore model.restore)
        , expect = CustomHttp.expectProto UpdateResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }
    )

errorHandler: Model -> Storage -> Http.Error -> (Model, Cmd Msg)
errorHandler model storage err =
    case err of
        Http.BadStatus code ->
            if code == 401 then
                ( { model | status = Failure "Login session expired" }, Storage.signOut storage)
            else
                ( { model | status = Failure "Unable to fetch user details, please try again later" }, Cmd.none)
        _ ->
            ( { model | status = Failure "Unable to fetch user details, please try again later" }, Cmd.none)

update: EnvironmentVar -> User -> Storage -> Msg -> Model -> (Model, Cmd Msg)
update env user storage msg model =
    case msg of
        RestoreResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    case data.restore of
                                        Just restore ->
                                            ( { model | status = None, restore = restore }, Cmd.none)
                                        Nothing ->
                                            errorHandler model storage (Http.BadBody "Unable to decode")
                                Nothing ->
                                    errorHandler model storage (Http.BadBody "Unable to decode")
                Err err ->
                    errorHandler model storage err

        UpdateResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            ( { model | status = Success "Successfully updated order" }, Cmd.none)
                Err err ->
                    errorHandler model storage err

        ClickedUpdate ->
            updateRestore env user model

        ChangedSelect status ->
            let
                oldForm = model.restore
                newForm =
                    { oldForm | status = status }
            in
            ( { model | restore = newForm }, Cmd.none)

        ChangeS3URL url ->
            let
                oldForm = model.restore
                newForm =
                    { oldForm | s3Url = url }
            in
            ( { model | restore = newForm }, Cmd.none)

        ChangeEmail email ->
            let
                oldForm = model.restore
                newForm =
                    { oldForm | email = email }
            in
            ( { model | restore = newForm }, Cmd.none)

        ChangeDomain domain ->
            let
                oldForm = model.restore
                newForm =
                    { oldForm | domain = domain }
            in
            ( { model | restore = newForm }, Cmd.none)

        ChangeTimestamp timestamp ->
            let
                oldForm = model.restore
                newForm =
                    { oldForm | timestamp = timestamp }
            in
            ( { model | restore = newForm }, Cmd.none)

        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )


view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "Update Restore | Wayback Download"
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
            [ text "Update Restore" ]
        ]


viewSection: Model -> Html Msg
viewSection model =
    section
        [ Attr.class "padding-20-0"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ div
                [ Attr.class "row justify-content-start futures-version-2"
                ]
                [ div
                    [ Attr.class "col-lg"
                    ]
                    [ div
                        [ Attr.class "futures-version-3-box"
                        , Attr.style "margin-top" "0px"
                        ]
                        [ h4 []
                            [ text "Update Restore" ]
                        , case model.status of
                            Success msg -> viewAlertSuccess msg
                            Failure err -> viewAlertError err
                            _ -> div [] []
                        , br [] []
                        , div []
                            [ div
                                [ Attr.class "form-group row"
                                ]
                                [ label
                                 [ Attr.class "col-sm-2 col-form-label"
                                 ]
                                 [ text "Email" ]
                                , div
                                 [ Attr.class "col-sm-10"
                                 ]
                                 [ input
                                     [ Attr.type_ "text"
                                     , Attr.class "form-control"
                                     , Attr.value model.restore.email
                                     , Attr.placeholder "Email"
                                     , onInput ChangeEmail
                                     ]
                                     []
                                 ]
                                ]
                            , div
                                [ Attr.class "form-group row"
                                ]
                                [ label
                                 [ Attr.class "col-sm-2 col-form-label"
                                 ]
                                 [ text "Domain" ]
                                , div
                                 [ Attr.class "col-sm-10"
                                 ]
                                 [ input
                                     [ Attr.type_ "text"
                                     , Attr.class "form-control"
                                     , Attr.value model.restore.domain
                                     , Attr.placeholder "Domain"
                                     , onInput ChangeDomain
                                     ]
                                     []
                                 ]
                                ]
                            , div
                                [ Attr.class "form-group row"
                                ]
                                [ label
                                 [ Attr.class "col-sm-2 col-form-label"
                                 ]
                                 [ text "Timestamp" ]
                                , div
                                 [ Attr.class "col-sm-10"
                                 ]
                                 [ input
                                     [ Attr.type_ "text"
                                     , Attr.class "form-control"
                                     , Attr.value model.restore.timestamp
                                     , Attr.placeholder "Timestamp"
                                     , onInput ChangeTimestamp
                                     ]
                                     []
                                 ]
                                ]
                            , div
                                [ Attr.class "form-group row"
                                ]
                                [ label
                                   [ Attr.class "col-sm-2 col-form-label"
                                   ]
                                   [ text "s3URL" ]
                                , div
                                   [ Attr.class "col-sm-10"
                                   ]
                                   [ input
                                       [ Attr.type_ "text"
                                       , Attr.class "form-control"
                                       , Attr.value model.restore.s3Url
                                       , Attr.placeholder "s3URL"
                                       , onInput ChangeS3URL
                                       ]
                                       []
                                   ]
                               ]
                            , div
                                [ Attr.class "form-group row"
                                ]
                                [ label
                                    [ Attr.class "col-sm-2 col-form-label"
                                    ]
                                    [ text "Status" ]
                                , div
                                    [ Attr.class "col-sm-10"
                                    ]
                                    [ div
                                        [ Attr.class "dropdown"
                                        ]
                                        [ select
                                              [ Attr.id "inputState"
                                              , Attr.class "form-control"
                                              , onInput ChangedSelect
                                              ]
                                              [ (if model.restore.status == "Awaiting Payment" then option [ Attr.selected True ] else option [])
                                                  [ text "Awaiting Payment" ]
                                              , (if model.restore.status == "Submitted" then option [ Attr.selected True ] else option [])
                                                  [ text "Submitted" ]
                                              , (if model.restore.status == "In Progress" then option [ Attr.selected True ] else option [])
                                                  [ text "In Progress" ]
                                              , (if model.restore.status == "Awaiting Review" then option [ Attr.selected True ] else option [])
                                                  [ text "Awaiting Review" ]
                                              , (if model.restore.status == "Done" then option [ Attr.selected True ] else option [])
                                                  [ text "Done" ]
                                              , (if model.restore.status == "Error" then option [ Attr.selected True ] else option [])
                                                  [ text "Error" ]
                                              ]
                                        ]
                                    ]
                                ]
                        , table [] [
                            td []
                                [ div
                                    [ Attr.class "col-12 col-md-6"
                                    ]
                                    [ a
                                      [ Attr.class "plan-dedicated-order-button"
                                      , Attr.style "background" "#5ad18a"
                                      , Attr.href "#"
                                      , onClick ClickedUpdate
                                      ]
                                      (case model.status of
                                           Loading -> viewSpinnerText
                                           _ -> [ text "Update"]
                                      )
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]