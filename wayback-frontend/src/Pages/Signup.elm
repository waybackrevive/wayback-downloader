module Pages.Signup exposing (Model, Msg, page)

import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Alert exposing (viewAlertError, viewAlertSuccess)
import Common.Regex exposing (emailRegex)
import Common.Spinner exposing (viewSpinnerText)
import Common.CustomHttp as CustomHttp
import Environment exposing (EnvironmentVar)
import Gen.Route
import Html exposing (Html, a, button, div, h5, i, input, main_, p, section, text)
import Html.Attributes as Attr
import Html.Events exposing (onClick, onInput)
import Http
import Protobuf.Encode as Encode
import Page
import Proto.Response as Proto
import Request exposing (Request)
import Shared
import Storage exposing (Storage)
import View exposing (View)


page : Shared.Model -> Request -> Page.With Model Msg
page shared req =
    Page.element
        { init = init
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
    = ClickedRegister
    | ChangeUsername String
    | ChangeEmail String
    | ChangePassword String
    | FormSentResp (Result Http.Error Proto.Response)
    | ReceivedCaptcha String
    | ClickedToggleMenu

type alias Model =
    { form: Proto.SignupForm
    , status: Status
    , showMenu: Bool
    }

init: (Model, Cmd Msg)
init =
    (Model (Proto.SignupForm "" "" "" "") None False, Shared.loadhCaptcha)


-- Update
signup: EnvironmentVar -> Model -> (Model, Cmd Msg)
signup env model =
    ( model
    , Http.post
        { url = env.serverUrl ++ "/signup"
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeSignupForm model.form)
        , expect = CustomHttp.expectProto FormSentResp Proto.decodeResponse
        }
    )


update: Shared.Model -> Request -> Msg -> Model -> (Model, Cmd Msg)
update shared req msg model =
    case msg of
        ClickedRegister ->
            if model.form.username == "" then
                ( { model | status = Failure "Username cannot be empty" }, Cmd.none)
            else if model.form.email == "" then
                ( { model | status = Failure "Email cannot be empty" }, Cmd.none)
            else if not (emailRegex model.form.email) then
                ( { model | status = Failure "Invalid email provided" }, Cmd.none)
            else if model.form.password == "" then
                ( { model | status = Failure "Password cannot be empty"}, Cmd.none)
            else
                ( { model | status = Loading }, Shared.getCaptchaResponse)

        ReceivedCaptcha captcha ->
            if captcha == "" then
                ( { model | status = Failure "Must fill out captcha" }, Cmd.none)
            else
                let
                    oldForm = model.form
                    newForm =
                        { oldForm | recaptcha = captcha }
                in
                signup shared.env { model | form = newForm }

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

        ChangeEmail email ->
            let
                oldForm = model.form
                newForm =
                    { oldForm | email = email }
            in
            ( { model | form = newForm }, Cmd.none)

        FormSentResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Shared.resetCaptcha ())
                        _ ->
                            ( model, Cmd.batch [ Shared.resetCaptcha (), Request.replaceRoute (Gen.Route.ConfirmSignup__Username_ { username = model.form.username }) req ] )
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
    { title = "Signup | Wayback Download"
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
                        Success msg -> viewAlertSuccess msg
                        _ -> div [] []
                    , h5 []
                        [ text "Register" ]
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
                                , Attr.id "email"
                                , Attr.name "email"
                                , Attr.placeholder "Email"
                                , Attr.required True
                                , Attr.type_ "email"
                                , Attr.value model.form.email
                                , onInput ChangeEmail
                                ]
                                []
                            , i
                                [ Attr.class "fas fa-envelope"
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
                            ]
                        ]
                    , div [ Attr.id "h-captcha", Attr.class "h-captcha col-md-12"] []
                    , div
                        [ Attr.class "btn-holder-contact"
                        ]
                        [ button
                            [ Attr.id "signup"
                            , Attr.type_ "submit"
                            , onClick ClickedRegister
                            ]
                            (case model.status of
                                Loading -> viewSpinnerText
                                _ -> [ text "Register" ]
                            )
                        ]
                    , p
                        [ Attr.style "margin-top" "0.5rem"
                        ]
                        [ text "Already have an account?", a
                            [ Attr.href "/login"
                            ]
                            [ text " Login" ]
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
