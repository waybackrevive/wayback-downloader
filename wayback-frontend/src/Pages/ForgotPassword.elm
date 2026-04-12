module Pages.ForgotPassword exposing (Model, Msg, page)

import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
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
    = Failure String
    | Loading
    | None

type Msg
    = ClickedReset
    | ChangeUsername String
    | ReceivedCaptcha String
    | FormSentResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

type alias Model =
    { form: Proto.ForgotPasswordForm
    , status: Status
    , showMenu: Bool
    }

init: (Model, Cmd Msg)
init =
    (Model (Proto.ForgotPasswordForm "" "") None False, Shared.loadhCaptcha)


-- Update

forgotPassword: EnvironmentVar -> Model -> (Model, Cmd Msg)
forgotPassword env model =
    ( model
    , Http.post
        { url = env.serverUrl ++ "/forgot-password"
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeForgotPasswordForm model.form)
        , expect = CustomHttp.expectProto FormSentResp Proto.decodeResponse
        }
    )

update: Shared.Model -> Request -> Msg -> Model -> (Model, Cmd Msg)
update shared req msg model =
    case msg of
        ClickedReset ->
            if model.form.username == "" then
                ( { model | status = Failure "Username cannot be empty" }, Cmd.none)
            else
                ( { model | status = Loading }, Shared.getCaptchaResponse)

        ChangeUsername username -> (
            let
                oldForm = model.form
                newForm =
                    { oldForm | username = username }
            in
            { model | form = newForm }, Cmd.none)

        ReceivedCaptcha captcha ->
            if captcha == "" then
                ( { model | status = Failure "Must fill out captcha" }, Cmd.none)
            else
                let
                    oldForm = model.form
                    newForm =
                        { oldForm | recaptcha = captcha }
                in
                forgotPassword shared.env { model | form = newForm }

        FormSentResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            (model, Request.replaceRoute (Gen.Route.ForgotPassword__Username_ {username = model.form.username} ) req)
                Err _ ->
                    ({ model | status = Failure "Unable to reset password, please try again later" }, Shared.resetCaptcha ())

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
    { title = "Forgot Password | Wayback Download"
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
                    [ div
                        [ Attr.class "col-md-12"
                        , Attr.id "alert"
                        , Attr.attribute "role" "alert"
                        ]
                        []
                    , h5 []
                        [ text "Forgot Password" ]
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
                    , div [ Attr.id "h-captcha", Attr.class "h-captcha col-md-12"] []
                    , div
                        [ Attr.class "btn-holder-contact"
                        , Attr.id "hidden_reset_button"
                        ]
                        [ button
                            [ Attr.id "forgot_password"
                            , Attr.type_ "submit"
                            , onClick ClickedReset
                            ]
                            (case model.status of
                                Loading -> viewSpinnerText
                                _ -> [ text "Reset" ]
                            )
                        ]
                    , p
                        [ Attr.style "margin-top" "0.5rem"
                        ]
                        [ text "Remember your password?", a
                            [ Attr.href "/login"
                            ]
                            [ text " Log In" ]
                        ]
                    ]
                ]
            ]
        ]

viewSection1: Html Msg
viewSection1 =
    section
        [ Attr.class "padding-100-0"
        ]
        [ div
            [ Attr.class "container"
            ]
            []
        ]
