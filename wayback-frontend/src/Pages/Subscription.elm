module Pages.Subscription exposing (Model, Msg, page)

import Browser.Navigation exposing (load)
import Common.Alert exposing (viewAlertError)
import Common.CustomHttp as CustomHttp
import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Response exposing (Response, responseDecoder)
import Domain.User exposing (User)
import Environment exposing (EnvironmentVar)
import Html exposing (Html, a, div, h3, h5, i, li, main_, p, section, small, span, strong, text, ul)
import Html.Attributes as Attr
import Html.Events exposing (onClick)
import Http
import Page
import Proto.Response as Proto
import Request exposing (Request)
import Shared
import Storage exposing (Storage)
import View exposing (View)


page : Shared.Model -> Request -> Page.With Model Msg
page shared _ =
    Page.protected.element <|
        \user ->
            { init = init user shared.env
            , update = update shared user
            , view = view shared user
            , subscriptions = \_ -> Sub.none
            }

-- Init

type Status
    = Failure String
    | None

type Msg
    = ClickedSubscribeBasic
    | ClickedSubscribePremium
    | ClickedManageSubscription
    | ServerResp (Result Http.Error Proto.Response)
    | UserResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

type alias Model =
    { status: Status
    , showMenu: Bool
    }

init: User -> EnvironmentVar -> (Model, Cmd Msg)
init user env =
    (Model None False, getUser user env)

-- Update

getUser: User -> EnvironmentVar -> Cmd Msg
getUser user env =
    Http.request
            { url = env.serverUrl ++ "/user"
            , method = "GET"
            , headers = [ Http.header "Authorization" ("Bearer " ++ user.token)]
            , body = Http.emptyBody
            , expect = CustomHttp.expectProto UserResp Proto.decodeResponse
            , timeout = Nothing
            , tracker = Nothing
            }

getSubscriptionUrl: User -> EnvironmentVar -> String -> Cmd Msg
getSubscriptionUrl user env plan =
    Http.request
        { url = env.serverUrl ++ "/subscription-checkout-session?plan=" ++ plan
        , method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token)]
        , body = Http.emptyBody
        , expect = CustomHttp.expectProto ServerResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }

getCustomerPortalUrl: User -> EnvironmentVar -> Cmd Msg
getCustomerPortalUrl user env =
    Http.request
        { url = env.serverUrl ++ "/customer-portal"
        , method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token)]
        , body = Http.emptyBody
        , expect = CustomHttp.expectProto ServerResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }

update: Shared.Model -> User -> Msg -> Model -> (Model, Cmd Msg)
update shared user msg model =
    case msg of
        ClickedSubscribeBasic -> (model, getSubscriptionUrl user shared.env "basic")

        ClickedSubscribePremium -> (model, getSubscriptionUrl user shared.env "premium")

        ClickedManageSubscription -> (model, getCustomerPortalUrl user shared.env)

        ServerResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    (model, load data.url)
                                Nothing ->
                                    ( { model | status = Failure "Unable to create checkout session, please try again" }, Cmd.none)
                Err err ->
                    case err of
                        Http.BadStatus code ->
                            if code == 401 then
                                ( { model | status = Failure "Login session expired" }, Storage.signOut shared.storage)
                            else
                                ( { model | status = Failure "Unable to create checkout, please try again later" }, Cmd.none)
                        _ ->
                            ( { model | status = Failure "Unable to create checkout, please try again later" }, Cmd.none)

        UserResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            (model, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    case data.user of
                                        Just user_ ->
                                            (model, Storage.changeSubscriptionStatus shared.storage user_.subscribed)

                                        Nothing ->
                                            (model, Cmd.none)
                                Nothing ->
                                    (model, Cmd.none)
                Err err ->
                    case err of
                        Http.BadStatus code ->
                            if code == 401 then
                                ( { model | status = Failure "Login session expired" }, Storage.signOut shared.storage)
                            else
                                (model, Cmd.none)
                        _ ->
                            (model, Cmd.none)

        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )



view : Shared.Model -> User -> Model -> View Msg
view shared user model =
    { title = "Subscription Plans — Basic & Premium | Wayback Download"
    , body = [ viewHeader shared.storage.user "sub" "" viewMain (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1 shared.env user model
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
            [ text "Choose Your Subscription Plan" ]
        ]

viewSection1: EnvironmentVar -> User -> Model -> Html Msg
viewSection1 env user model =
    section
        [ Attr.class "padding-100-0 position-relative"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ case model.status of
                Failure err -> viewAlertError err
                _ -> div [] []
            , p
                [ Attr.class "text-center mb-4"
                , Attr.style "color" "#aaa"
                ]
                [ text "All plans include priority processing, configurable link creation, and email support. Cancel anytime." ]
            , div
                [ Attr.class "test-row row justify-content-center second-pricing-table-container mr-tp-30"
                ]
                [ -- Basic Plan
                  div
                    [ Attr.class "col-md-4"
                    ]
                    [ div
                        [ Attr.class "second-pricing-table"
                        ]
                        [ h5
                            [ Attr.class "second-pricing-table-title"
                            ]
                            [ text "Basic"
                            , span [] [ text "up to 12 HTML restores/month" ]
                            ]
                        , span
                            [ Attr.class "second-pricing-table-price monthly"
                            ]
                            [ i
                                [ Attr.class "monthly"
                                ]
                                [ text ("$" ++ String.fromInt env.basicSubscriptionCost)
                                , small [] [ text "/mo" ]
                                ]
                            ]
                        , ul
                            [ Attr.class "second-pricing-table-body"
                            ]
                            [ li [] [ text "Up to 12 HTML restores per month" ]
                            , li [] [ text "Priority order processing" ]
                            , li [] [ text "Configurable link creation" ]
                            , li [] [ text "Email support included" ]
                            , li [] [ text "Discounted WordPress conversion ($79)" ]
                            ]
                        , if user.subscribed then
                            a
                                [ Attr.class "second-pricing-table-button"
                                , Attr.href "#"
                                , onClick ClickedManageSubscription
                                ]
                                [ text "Manage Subscription" ]
                          else
                            a
                                [ Attr.class "second-pricing-table-button"
                                , Attr.href "#"
                                , onClick ClickedSubscribeBasic
                                ]
                                [ text "Subscribe — Basic" ]
                        ]
                    ]
                , -- Premium Plan
                  div
                    [ Attr.class "col-md-4"
                    ]
                    [ div
                        [ Attr.class "second-pricing-table style-2 active"
                        ]
                        [ h5
                            [ Attr.class "second-pricing-table-title"
                            ]
                            [ text "Premium"
                            , span [] [ text "up to 100 HTML restores/month" ]
                            ]
                        , span
                            [ Attr.class "second-pricing-table-price monthly"
                            ]
                            [ i
                                [ Attr.class "monthly"
                                ]
                                [ text ("$" ++ String.fromInt env.subscriptionCost)
                                , small [] [ text "/mo" ]
                                ]
                            ]
                        , ul
                            [ Attr.class "second-pricing-table-body"
                            ]
                            [ li [] [ text "Up to 100 HTML restores per month" ]
                            , li [] [ text "Priority order processing" ]
                            , li [] [ text "Configurable link creation" ]
                            , li [] [ text "Email support included" ]
                            , li [] [ text "Discounted WordPress conversion ($69)" ]
                            , li [] [ strong [] [ text "Best value for agencies" ] ]
                            ]
                        , if user.subscribed then
                            a
                                [ Attr.class "second-pricing-table-button"
                                , Attr.href "#"
                                , onClick ClickedManageSubscription
                                ]
                                [ text "Manage Subscription" ]
                          else
                            a
                                [ Attr.class "second-pricing-table-button"
                                , Attr.href "#"
                                , onClick ClickedSubscribePremium
                                ]
                                [ text "Subscribe — Premium" ]
                        ]
                    ]
                ]
            ]
        ]


page : Shared.Model -> Request -> Page.With Model Msg
page shared _ =
    Page.protected.element <|
        \user ->
            { init = init user shared.env
            , update = update shared user
            , view = view shared user
            , subscriptions = \_ -> Sub.none
            }

-- Init

type Status
    = Failure String
    | None

type Msg
    = ClickedSubscribeNow
    | ClickedManageSubscription
    | ServerResp (Result Http.Error Proto.Response)
    | UserResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

type alias Model =
    { status: Status
    , showMenu: Bool
    }

init: User -> EnvironmentVar -> (Model, Cmd Msg)
init user env =
    (Model None False, getUser user env)

-- Update

getUser: User -> EnvironmentVar -> Cmd Msg
getUser user env =
    Http.request
            { url = env.serverUrl ++ "/user"
            , method = "GET"
            , headers = [ Http.header "Authorization" ("Bearer " ++ user.token)]
            , body = Http.emptyBody
            , expect = CustomHttp.expectProto UserResp Proto.decodeResponse
            , timeout = Nothing
            , tracker = Nothing
            }

getSubscriptionUrl: User -> EnvironmentVar -> Cmd Msg
getSubscriptionUrl user env =
    Http.request
        { url = env.serverUrl ++ "/subscription-checkout-session"
        , method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token)]
        , body = Http.emptyBody
        , expect = CustomHttp.expectProto ServerResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }

getCustomerPortalUrl: User -> EnvironmentVar -> Cmd Msg
getCustomerPortalUrl user env =
    Http.request
        { url = env.serverUrl ++ "/customer-portal"
        , method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token)]
        , body = Http.emptyBody
        , expect = CustomHttp.expectProto ServerResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }

update: Shared.Model -> User -> Msg -> Model -> (Model, Cmd Msg)
update shared user msg model =
    case msg of
        ClickedSubscribeNow -> (model, getSubscriptionUrl user shared.env)

        ClickedManageSubscription -> (model, getCustomerPortalUrl user shared.env)

        ServerResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    (model, load data.url)
                                Nothing ->
                                    ( { model | status = Failure "Unable to create checkout session, please try again" }, Cmd.none)
                Err err ->
                    case err of
                        Http.BadStatus code ->
                            if code == 401 then
                                ( { model | status = Failure "Login session expired" }, Storage.signOut shared.storage)
                            else
                                ( { model | status = Failure "Unable to fetch user details, please try again later" }, Cmd.none)
                        _ ->
                            ( { model | status = Failure "Unable to fetch user details, please try again later" }, Cmd.none)

        UserResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            (model, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    case data.user of
                                        Just user_ ->
                                            (model, Storage.changeSubscriptionStatus shared.storage user_.subscribed)

                                        Nothing ->
                                            (model, Cmd.none)
                                Nothing ->
                                    (model, Cmd.none)
                Err err ->
                    case err of
                        Http.BadStatus code ->
                            if code == 401 then
                                ( { model | status = Failure "Login session expired" }, Storage.signOut shared.storage)
                            else
                                (model, Cmd.none)
                        _ ->
                            (model, Cmd.none)

        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )



view : Shared.Model -> User -> Model -> View Msg
view shared user model =
    { title = "Bulk Subscription — Unlimited Restores | Wayback Download"
    , body = [ viewHeader shared.storage.user "sub" "" viewMain (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1 shared.env user model
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
            [ text "Unlimited Restores Subscription" ]
        ]

viewSection1: EnvironmentVar -> User -> Model -> Html Msg
viewSection1 env user model =
    section
        [ Attr.class "padding-100-0 position-relative"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ div
                [ Attr.class "col-md-6 mx-auto"
                ]
                [ case model.status of
                    Failure err -> viewAlertError err
                    _ -> div [] []
                , div
                    [ Attr.class "second-pricing-table"
                    ]
                    [ h5
                        [ Attr.class "second-pricing-table-title"
                        ]
                        [ text "Bulk Subscription", span []
                            [ text "unlimited monthly access" ]
                        ]
                    , span
                        [ Attr.class "second-pricing-table-price monthly"
                        ]
                        [ i
                            [ Attr.class "monthly"
                            ]
                            [ text ("$" ++ String.fromInt env.subscriptionCost), small []
                                [ text "/mo" ]
                            ]
                        ]
                    , ul
                        [ Attr.class "second-pricing-table-body"
                        ]
                        [ li []
                            [ text "Up to 10 HTML restores per month" ]
                        , li []
                            [ text "Priority order processing" ]
                        , li []
                            [ text "Configurable link creation during scraping" ]
                        , li []
                            [ text "Discounted WordPress conversion ($55)" ]
                        , li []
                            [ text "Email support included" ]
                        , li []
                            [ text "Fair use policy applies" ]
                        ]
                    , if user.subscribed then
                        a
                            [ Attr.class "second-pricing-table-button"
                            , Attr.href "#"
                            , Attr.id "subscribe"
                            , onClick ClickedManageSubscription
                            ]
                            [ text "Manage Subscription" ]
                    else
                        a
                            [ Attr.class "second-pricing-table-button"
                            , Attr.href "#"
                            , Attr.id "subscribe"
                            , onClick ClickedSubscribeNow
                            ]
                            [ text "Subscribe Now" ]
                    ]
                ]
            ]
        ]
