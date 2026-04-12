module Pages.ConfirmSignup.Username_ exposing (Model, Msg, page)

import Common.Alert exposing (viewAlertError, viewAlertSuccess)
import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Spinner exposing (viewSpinnerText)
import Common.CustomHttp as CustomHttp
import Environment exposing (EnvironmentVar)
import Gen.Params.ConfirmSignup.Username_ exposing (Params)
import Gen.Route
import Html exposing (Html, a, button, div, h5, i, input, main_, p, section, text)
import Html.Attributes as Attr
import Html.Events exposing (onClick, onInput)
import Http
import Page
import Proto.Response as Proto
import Protobuf.Encode as Encode
import Request exposing (Request)
import Shared
import Storage exposing (Storage)
import View exposing (View)

page : Shared.Model -> Request.With Params -> Page.With Model Msg
page shared req =
    Page.element
        { init = init req.params
        , update = update shared req
        , view = view shared
        , subscriptions = subscriptions
        }

-- Init
type Status
    = Success String
    | Failure String
    | Loading
    | None

type Msg
    = ClickedConfirm
    | ChangeCode String
    | FormSentResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

type alias Model =
    { form : Proto.ConfirmSignupForm
    , status : Status
    , showMenu : Bool
    }

init : Params -> ( Model, Cmd Msg )
init params =
    ( Model (Proto.ConfirmSignupForm params.username "") (Success "Check your email for the verification code.") False
    , Cmd.none
    )


-- Update
confirmSignup : EnvironmentVar -> Model -> ( Model, Cmd Msg )
confirmSignup env model =
    ( model
    , Http.post
        { url = env.serverUrl ++ "/confirm-signup"
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeConfirmSignupForm model.form)
        , expect = CustomHttp.expectProto FormSentResp Proto.decodeResponse
        }
    )

update : Shared.Model -> Request.With Params -> Msg -> Model -> ( Model, Cmd Msg )
update shared req msg model =
    case msg of
        ClickedConfirm ->
            if model.form.code == "" then
                ( { model | status = Failure "Verification code cannot be empty" }, Cmd.none )
            else
                confirmSignup shared.env { model | status = Loading }

        ChangeCode code ->
            let
                oldForm = model.form
                newForm = { oldForm | code = code }
            in
            ( { model | form = newForm }, Cmd.none )

        FormSentResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none )
                        _ ->
                            ( model, Request.replaceRoute Gen.Route.Login req )

                Err _ ->
                    ( { model | status = Failure "Unable to confirm account, please try again" }, Cmd.none )

        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )


-- Listen for shared model changes
subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


-- View
view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "Confirm Account | Wayback Download"
    , body =
        [ viewHeader shared.storage.user "main" "" (viewMain model) (Html.text "") ClickedToggleMenu model.showMenu
        , viewSection1
        , viewFooter shared.year
        ]
    }

viewMain : Model -> Html Msg
viewMain model =
    main_
        [ Attr.class "container"
        ]
        [ div
            [ Attr.class "row"
            ]
            [ div
                [ Attr.class "col-sm"
                ]
                [ div
                    [ Attr.class "row form-contain-home contact-page-form-send"
                    , Attr.id "ajax-contact"
                    ]
                    [ case model.status of
                        Success msg -> viewAlertSuccess msg
                        Failure err -> viewAlertError err
                        _ -> div [] []
                    , h5 []
                        [ text "Confirm Your Account" ]
                    , div
                        [ Attr.class "col-md-12"
                        ]
                        [ div
                            [ Attr.class "field input-field"
                            ]
                            [ input
                                [ Attr.class "form-contain-home-input"
                                , Attr.id "username"
                                , Attr.name "username"
                                , Attr.placeholder "Username"
                                , Attr.required True
                                , Attr.type_ "text"
                                , Attr.value model.form.username
                                , Attr.disabled True
                                ]
                                []
                            , i
                                [ Attr.class "fas fa-address-card"
                                ]
                                []
                            ]
                        ]
                    , div
                        [ Attr.class "col-md-12"
                        ]
                        [ div
                            [ Attr.class "field input-field"
                            ]
                            [ input
                                [ Attr.class "form-contain-home-input"
                                , Attr.id "code"
                                , Attr.name "code"
                                , Attr.placeholder "Verification Code"
                                , Attr.required True
                                , Attr.type_ "text"
                                , Attr.value model.form.code
                                , onInput ChangeCode
                                ]
                                []
                            , i
                                [ Attr.class "fas fa-key"
                                ]
                                []
                            ]
                        ]
                    , div
                        [ Attr.class "col-md-12 button-submit"
                        ]
                        [ button
                            [ Attr.class "btn btn-primary"
                            , onClick ClickedConfirm
                            ]
                            (case model.status of
                                Loading -> viewSpinnerText
                                _ -> [ text "Confirm Account" ]
                            )
                        ]
                    ]
                ]
            ]
        ]

viewSection1 : Html Msg
viewSection1 =
    section
        [ Attr.class "section-padding"
        ]
        []
