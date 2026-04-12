module Pages.Contact exposing (Model, Msg, page)

import Common.Alert exposing (viewAlertError, viewAlertSuccess)
import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Regex exposing (emailRegex)
import Common.Spinner exposing (viewSpinnerText)
import Common.CustomHttp as CustomHttp
import Environment exposing (EnvironmentVar)
import Html exposing (Html, a, br, button, div, h1, h3, h5, i, input, main_, p, section, span, text, textarea)
import Html.Attributes as Attr
import Html.Events exposing (onClick, onInput)
import Http exposing (Error(..))
import Protobuf.Encode as Encode
import Page
import Proto.Response as Proto
import Request exposing (Request)
import Shared
import Storage exposing (Storage)
import View exposing (View)


page : Shared.Model -> Request -> Page.With Model Msg
page shared _ =
    Page.element
        { init = init
        , update = update shared
        , view = view shared
        , subscriptions = subscriptions
        }

-- Init

type Msg
    = ClickedSend
    | NameChange String
    | EmailChange String
    | MessageChange String
    | ReceivedCaptcha String
    | FormSentResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

type Status
    = Success
    | Failure String
    | Loading
    | None

type alias Model =
    { form: Proto.ContactForm
    , status: Status
    , showMenu: Bool
    }

init: (Model, Cmd Msg)
init =
    (Model (Proto.ContactForm "" "" "" "") None False, Shared.loadhCaptcha)

-- Update

submitForm: EnvironmentVar -> Model -> (Model, Cmd Msg)
submitForm env model =
    ( model
    , Http.post
        { url = env.serverUrl ++ "/contact"
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeContactForm model.form)
        , expect = CustomHttp.expectProto FormSentResp Proto.decodeResponse
        }
    )

update: Shared.Model -> Msg -> Model -> (Model, Cmd Msg)
update shared msg model =
    case msg of
        NameChange name ->
            let
                oldForm = model.form
                newForm =
                    { oldForm | name = name }
            in
            ({ model | form = newForm }, Cmd.none)
        EmailChange email ->
            let
                oldForm = model.form
                newForm =
                    { oldForm | email = email }
            in
            ({ model | form = newForm }, Cmd.none)
        MessageChange message ->
            let
                oldForm = model.form
                newForm =
                    { oldForm | message = message }
            in
            ({ model | form = newForm }, Cmd.none)
        ClickedSend ->
            if model.form.name == "" then
                ( { model | status = Failure "Name cannot be empty" }, Cmd.none)
            else if not (emailRegex model.form.email) then
                ( { model | status = Failure "Invalid email address provided" }, Cmd.none )
            else if model.form.message == "" then
                ( { model | status = Failure "Message cannot be empty" }, Cmd.none )
            else
                ({ model | status = Loading }, Shared.getCaptchaResponse)
        ReceivedCaptcha captcha ->
            if captcha == "" then
                ( { model | status = Failure "Must fill out captcha" }, Cmd.none )
            else
                let
                    oldForm = model.form
                    newForm =
                        { oldForm | recaptcha = captcha }
                in
                submitForm shared.env { model | form = newForm }
        FormSentResp result ->
            case result of
                Ok _ -> (Model (Proto.ContactForm "" "" "" "") Success False, Shared.resetCaptcha ())
                Err _ ->
                    ({ model | status = Failure "Unable to send form, please try again later" }, Shared.resetCaptcha ())

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
    { title = "Contact | Wayback Download"
    , body = [ viewHeader shared.storage.user "sub" "" (viewMain model) (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1
             , div [ Attr.class "contact-spacing"
                   ] []
             , viewFooter shared.year
             ]
    }

viewMain: Model -> Html Msg
viewMain model =
        main_
            [ Attr.class "container mb-auto"
            ]
            [ div
                [ Attr.class "row"
                ]
                [ div
                    [ Attr.class "col-md-5"
                    ]
                    [ h1
                        [ Attr.class "mt-3 main-header-text-title mr-tp-60"
                        ]
                        [ span []
                            [ text "Still got questions?" ]
                        , text "you can talk to our support." ]
                    ]
                , div
                    [ Attr.class "col-md-7"
                    ]
                    [ div
                        [ Attr.class "row form-contain-home contact-page-form-send"
                        , Attr.id "ajax-contact"
                        ]
                        [ h5 []
                            [ text "send us a message" ]
                        , div
                            [ Attr.class "col-md-12"
                            , Attr.id "alert"
                            , Attr.attribute "role" "alert"
                            ]
                            []
                        , case model.status of
                            Success -> viewAlertSuccess "Successfully sent message!"
                            Failure err -> viewAlertError err
                            _ -> (Html.text "")
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
                                    , Attr.id "name"
                                    , Attr.name "name"
                                    , Attr.placeholder "enter your name"
                                    , Attr.required True
                                    , Attr.type_ "text"
                                    , Attr.value model.form.name
                                    , onInput NameChange
                                    ]
                                    []
                                , i
                                    [ Attr.class "fas fa-user"
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
                                    , Attr.placeholder "enter your email"
                                    , Attr.required True
                                    , Attr.type_ "email"
                                    , Attr.value model.form.email
                                    , onInput EmailChange
                                    ]
                                    []
                                , i
                                    [ Attr.class "far fa-envelope"
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
                                [ textarea
                                    [ Attr.class "form-contain-home-input"
                                    , Attr.id "message"
                                    , Attr.name "message"
                                    , Attr.placeholder "enter your message"
                                    , Attr.required True
                                    , Attr.value model.form.message
                                    , onInput MessageChange
                                    ]
                                    []
                                ]
                            ]
                        , div [ Attr.id "h-captcha", Attr.class "h-captcha col-md-12"] []
                        , div
                            [ Attr.class "btn-holder-contact"
                            ]
                            [ button
                                [ Attr.id "contact"
                                , Attr.type_ "submit"
                                , onClick ClickedSend
                                ]
                                (case model.status of
                                    Loading -> viewSpinnerText
                                    _ -> [ text "Send" ]
                                )
                            ]
                        ]
                    ]
                ]
            ]

viewSection1: Html Msg
viewSection1 =
    section
        [ Attr.class "padding-20-0 mob-display-none"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ div
                [ Attr.class "row justify-content-start"
                ]
                [ div
                    [ Attr.class "col-md-5"
                    ]
                    [ h5
                        [ Attr.class "immediate-help-center-title"
                        ]
                        [ text "Need some urgent", br []
                            []
                        , text "help?" ]
                    , p
                        [ Attr.class "immediate-help-center-text"
                        ]
                        [ text "Our support team is here to answer any questions that may arise during the restore process of your lost or deleted websites." ]
                    , a
                        [ Attr.class "immediate-help-center-link"
                        , Attr.href "mailto:support@wayback.download"
                        ]
                        [ text "support@wayback.download" ]
                    ]
                ]
            ]
        ]
