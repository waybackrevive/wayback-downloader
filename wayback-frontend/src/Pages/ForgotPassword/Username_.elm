module Pages.ForgotPassword.Username_ exposing (Model, Msg, page)

import Common.Alert exposing (viewAlertSuccess, viewAlertError)
import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Spinner exposing (viewSpinnerText)
import Common.CustomHttp as CustomHttp
import Environment exposing (EnvironmentVar)
import Gen.Params.ForgotPassword.Username_ exposing (Params)
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
        , update = update shared
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
    | ChangePassword String
    | ChangeToken String
    | ReceivedCaptcha String
    | FormSentResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

type alias Model =
    { form: Proto.ForgotPasswordConfirmForm
    , status: Status
    , showMenu: Bool
    }

init: Params -> (Model, Cmd Msg)
init params =
    let
        model = Model (Proto.ForgotPasswordConfirmForm "" params.username "" "") (Success "Successfully sent reset token. Please verify your emails.") False
    in
    ( model, Shared.loadhCaptcha )


-- Update
forgotPassword: EnvironmentVar -> Model -> (Model, Cmd Msg)
forgotPassword env model =
    ( model
    , Http.post
        { url = env.serverUrl ++ "/forgot-password-confirm"
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeForgotPasswordConfirmForm model.form)
        , expect = CustomHttp.expectProto FormSentResp Proto.decodeResponse
        }
    )

update: Shared.Model -> Msg -> Model -> (Model, Cmd Msg)
update shared msg model =
    case msg of
        ClickedConfirm ->
            if model.form.password == "" then
                ( { model | status = Failure "Password cannot be empty" }, Cmd.none)
            else if model.form.token == "" then
                ( { model | status = Failure "Token cannot be empty" }, Cmd.none)
            else
                ( { model | status = Loading }, Shared.getCaptchaResponse)

        ChangePassword password ->
            ( let
                oldForm = model.form
                newForm =
                    { oldForm | password = password }
            in
                { model | form = newForm }
            , Cmd.none
            )

        ChangeToken token ->
            ( let
                oldForm = model.form
                newForm =
                    { oldForm | token = token }
            in
                { model | form = newForm }
            , Cmd.none
            )

        ReceivedCaptcha captcha ->
            if captcha == "" then
                ( { model | status = Failure "Must fill out captcha" }, Cmd.none)
            else
                let
                    oldForm = model.form
                    newForm =
                        { oldForm | recaptcha = captcha }
                in
                forgotPassword shared.env { model | form = newForm}

        FormSentResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)

                        _ ->
                            case resp.data of
                                Just data ->
                                    ((Model (Proto.ForgotPasswordConfirmForm "" model.form.username "" "") (Success data.info) False), Shared.resetCaptcha ())

                                Nothing ->
                                    ( { model | status = Failure "Unable to reset password, please try again later" }, Shared.resetCaptcha ())

                Err _ ->
                    ( { model | status = Failure "Unable to reset password, please try again later" }, Shared.resetCaptcha ())

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
    { title = "Forgot Password Confirm | Wayback Download"
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
                        Success msg -> viewAlertSuccess msg
                        Failure err -> viewAlertError err
                        _ -> div [] []
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
                        , Attr.id "hidden_token"
                        ]
                        [ div
                            [ Attr.class "field input-field"
                            ]
                            [ input
                                [ Attr.class "form-contain-home-input"
                                , Attr.id "token"
                                , Attr.name "token"
                                , Attr.placeholder "Token"
                                , Attr.required True
                                , Attr.type_ "text"
                                , Attr.value model.form.token
                                , onInput ChangeToken
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
                        , Attr.id "hidden_password"
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
                        , Attr.id "hidden_confirm_button"
                        ]
                        [ button
                            [ Attr.id "forgot_password_confirm"
                            , Attr.type_ "submit"
                            , onClick ClickedConfirm
                            ]
                            (case model.status of
                                Loading -> viewSpinnerText
                                _ -> [ text "Confirm" ]
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
