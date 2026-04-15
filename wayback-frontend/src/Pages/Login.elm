module Pages.Login exposing (Model, Msg, page)

import Domain.User exposing (User)
import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Alert exposing (viewAlertError)
import Common.Spinner exposing (viewSpinnerText)
import Common.CustomHttp as CustomHttp
import Environment exposing (EnvironmentVar)
import Gen.Route
import Html exposing (Html, a, button, div, h5, i, input, main_, p, section, text)
import Html.Attributes as Attr
import Html.Events exposing (onInput, onClick)
import Http exposing (Error(..))
import Page
import Proto.Response as Proto
import Protobuf.Encode as Encode
import Request exposing (Request)
import Shared
import Storage exposing (Storage)
import View exposing (View)

page : Shared.Model -> Request -> Page.With Model Msg
page shared req =
    Page.element
        { init = init req shared.storage
        , update = update shared
        , view = view shared
        , subscriptions = subscriptions
        }

-- Init

type Status
    = Failure String
    | Loading
    | None

type Msg
    = ClickedLogin
    | ChangeUsername String
    | ChangePassword String
    | ReceivedCaptcha String
    | FormSentResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

type alias Model =
    { form: Proto.LoginForm
    , status: Status
    , showMenu: Bool
    }

init: Request -> Storage -> (Model, Cmd msg)
init req storage =
    let model =
            Model (Proto.LoginForm "" "" "") None False
    in
    ( model
    , if storage.user /= Nothing && req.route == Gen.Route.Login then
          Request.replaceRoute Gen.Route.Dashboard req
      else
          Shared.loadhCaptcha
    )


-- Update

login: EnvironmentVar -> Model -> (Model, Cmd Msg)
login env model =
    ( model
    , Http.post
        { url = env.serverUrl ++ "/login"
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeLoginForm model.form)
        , expect = CustomHttp.expectProto FormSentResp Proto.decodeResponse
        }
    )

update: Shared.Model -> Msg -> Model -> (Model, Cmd Msg)
update shared msg model =
    case msg of
        ClickedLogin ->
            if model.form.username == "" then
                ( { model | status = Failure "Username cannot be empty" }, Cmd.none)
            else if model.form.password == "" then
                ( { model | status = Failure "Password cannot be empty" }, Cmd.none)
            else
                ( { model | status = Loading } , Shared.getCaptchaResponse)

        ReceivedCaptcha captcha ->
            if captcha == "" then
                ( { model | status = Failure "Must fill out captcha" }, Cmd.none)
            else
                let
                    oldForm = model.form
                    newForm =
                        { oldForm | recaptcha = captcha }
                in
                login shared.env { model | form = newForm }

        ChangeUsername username ->
            let
                oldForm = model.form
                newForm =
                    { oldForm | username = username }
            in
            ( { model | form = newForm }, Cmd.none)

        ChangePassword password ->
            let
                oldForm = model.form
                newForm =
                    { oldForm | password = password }
            in
            ( { model | form = newForm }, Cmd.none)

        FormSentResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Shared.resetCaptcha ())
                        _ ->
                            case resp.data of
                                Just data ->
                                    case data.user of
                                        Just user ->
                                            ( model
                                            , Storage.signIn (User user.token user.subscribed user.admin) shared.storage
                                            )
                                        Nothing -> ({ model | status = Failure "Unable to process request (3), please try again later" }, Shared.resetCaptcha ())
                                Nothing ->
                                    ({ model | status = Failure "Unable to process request (2), please try again later" }, Shared.resetCaptcha ())
                Err _ ->
                    ({ model | status = Failure "Unable to process request, please try again later" }, Shared.resetCaptcha ())

        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )



-- Listen for shared model changes

subscriptions : Model -> Sub Msg
subscriptions _ =
    Shared.messageReceiver ReceivedCaptcha

-- View

view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "Log In to Wayback Download — Restore Any Website"
    , body = [ viewHeader shared.storage.user "main" "" (viewMain model) (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1
             , viewFooter shared.year
             ]
    }

viewMain: Model -> Html Msg
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
                        Failure err -> viewAlertError err
                        _ -> div [] []
                    , h5 []
                        [ text "Login" ]
                    , div
                        [ Attr.id "form-messages"
                        ]
                        []
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
                                , onInput ChangeUsername
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
                                , Attr.id "password"
                                , Attr.name "password"
                                , Attr.placeholder "Password"
                                , Attr.required True
                                , Attr.type_ "password"
                                , Attr.value model.form.password
                                , onInput ChangePassword
                                ]
                                []
                            , i
                                [ Attr.class "fas fa-key"
                                ]
                                []
                            , a
                                [ Attr.href "/forgot-password"
                                , Attr.style "float" "right"
                                ]
                                [ text "Forgot Password" ]
                            ]
                        ]
                    , div [ Attr.id "h-captcha", Attr.class "h-captcha col-md-12"] []
                    , div
                        [ Attr.class "btn-holder-contact"
                        ]
                        [ button
                            [ Attr.id "login"
                            , Attr.type_ "submit"
                            , onClick ClickedLogin
                            ]
                            (case model.status of
                                Loading -> viewSpinnerText
                                _ -> [ text "Login"]
                            )
                        ]
                    , p
                        [ Attr.style "margin-top" "0.5rem"
                        ]
                        [ text "Don't have an account?", a
                            [ Attr.href "/signup"
                            ]
                            [ text " Register" ]
                        ]
                    ]
                ]
            ]
        ]

viewSection1: Html msg
viewSection1 =
    section
        [ Attr.class "padding-100-0"
        ]
        [ div
            [ Attr.class "container"
            ]
            []
        ]
