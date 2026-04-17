module Pages.Order exposing (Model, Msg, page)

import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Parsing exposing (cartParser)
import Common.Alert exposing (viewAlertError, viewAlertSuccess)
import Common.CustomHttp as CustomHttp
import Common.Spinner exposing (viewSpinnerSymbol, viewSpinnerText)
import Domain.User exposing (User)
import Environment exposing (EnvironmentVar)
import Html exposing (Html, a, b, br, button, div, h3, h4, hr, i, input, label, main_, p, section, small, span, table, tbody, td, text, tr)
import Html.Attributes as Attr
import Html.Events exposing (onClick, onInput)
import Http exposing (Error(..))
import Protobuf.Encode as Encode
import Page
import Proto.Response as Proto exposing (CartItem)
import Parser
import Browser.Navigation as Nav
import Request exposing (Request)
import Shared
import List
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
    = Success String
    | Failure String
    | Loading
    | None

type Msg
    = ChangeUrl String
    | ChangeEmail String
    | ClickedAddToCart
    | ClickedRemoveFromCart CartItem
    | ClickedCheckout
    | ClickedRestore
    | ProcessResp (Result Http.Error Proto.Response)
    | CheckoutResp (Result Http.Error Proto.Response)
    | UserResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

type alias Model =
    { url: String
    , email: String
    , status: Status
    , showMenu: Bool
    }

init: User -> EnvironmentVar -> (Model, Cmd Msg)
init user env =
    (Model "" "" None False, getUser user env)

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

processRestore: EnvironmentVar -> User -> Model -> (Model, Cmd Msg)
processRestore env user model =
    case (Parser.run cartParser model.url) of
        Ok cartItem ->
            ( model
            , Http.request
                { url = env.serverUrl ++ "/process"
                , method = "POST"
                , headers = [ Http.header "Authorization" ("Bearer " ++ user.token) ]
                , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeCartItem cartItem)
                , expect = CustomHttp.expectProto ProcessResp Proto.decodeResponse
                , timeout = Nothing
                , tracker = Nothing
                }
            )
        Err _ ->
            ({ model | status = Failure "Invalid URL provided" }, Cmd.none)

getCheckoutUrl: EnvironmentVar -> Storage -> User -> Model -> (Model, Cmd Msg)
getCheckoutUrl env storage user model =
    ( model
    , Cmd.batch [ Http.request
          { url = env.serverUrl ++ "/checkout"
          , method = "POST"
          , headers = [ Http.header "Authorization" ("Bearer " ++ user.token) ]
          , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeCart { items = storage.cart.items, email = model.email })
          , expect = CustomHttp.expectProto CheckoutResp Proto.decodeResponse
          , timeout = Nothing
          , tracker = Nothing
          }
      , Storage.clearCart storage]
    )

errorHandler: Http.Error -> Model -> Shared.Model -> (Model, Cmd Msg)
errorHandler err model shared =
    case err of
        Http.BadStatus code ->
            if code == 401 then
                ({ model | status = Failure "Login session expired" }, Storage.signOut shared.storage)
            else
                ({ model | status = Failure "Unable to process request, please try again later" }, Cmd.none)
        _ ->
            ({ model | status = Failure "Unable to process request, please try again later" }, Cmd.none)


update: Shared.Model -> User -> Msg -> Model -> (Model, Cmd Msg)
update shared user msg model =
    case msg of
        ChangeUrl url -> ( { model | url = url }, Cmd.none)
        ChangeEmail email -> ( { model | email = email }, Cmd.none)

        ClickedAddToCart ->
            if model.url == "" then
                ( { model | status = Failure "URl cannot be empty" }, Cmd.none)
            else
                case (Parser.run cartParser model.url) of
                    Ok cart ->
                        ( { model | url = "" }
                        , Storage.addItemToCart cart shared.storage
                        )
                    Err _ ->
                        ( { model | status = Failure "Invalid URL provided" }, Cmd.none )

        ClickedRemoveFromCart item ->
            (model, Storage.removeItemFromCart item shared.storage)

        ClickedCheckout ->
            if (List.length shared.storage.cart.items) < 1 then
                ( { model | status = Failure "Cart must contain at least one item" }, Cmd.none)
            else
                getCheckoutUrl shared.env shared.storage user { model | status = Loading }

        CheckoutResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    ( { model | status = Loading }, Nav.load data.url)
                                _ ->
                                    ({ model | status = Failure "Unable to process request, please try again later" }, Cmd.none)
                Err err ->
                    errorHandler err model shared

        ClickedRestore -> processRestore shared.env user { model | status = Loading }

        ProcessResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    ( { model | status = Success data.info, url = "" } , Cmd.none)
                                Nothing ->
                                    ( { model | status = Failure "Unable to process request, please try again later" }, Cmd.none)
                Err err ->
                    errorHandler err model shared

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
    { title = "Order Website Restoration from Archive.org | Wayback Download"
    , body = [ viewHeader shared.storage.user "sub" "" viewMain (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1 shared.env model shared.storage user
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
            [ text "Place Your Order" ]
        ]

viewSection1: EnvironmentVar -> Model -> Storage -> User -> Html Msg
viewSection1 env model storage user =
    section []
        [ div
            [ Attr.class "container"
            ]
            [ div
                [ Attr.class "row justify-content-start futures-version-2"
                ]
                [ div
                    [ if user.subscribed then
                        Attr.class "col-md-8 mx-auto"
                      else
                        Attr.class "col-md"
                    ]
                    [ div
                        [ Attr.class "futures-version-3-box"
                        ]
                        [ h4 []
                            [ text "Restore" ]
                        , br []
                            []
                        , case model.status of
                            Failure err -> viewAlertError err
                            Success msg -> viewAlertSuccess msg
                            _ -> div [] []
                        , div
                            [ Attr.class "container border"
                            ]
                            [ p []
                                [ b []
                                    [ text "Step 1. " ]
                                , text "Navigate to the ", a
                                    [ Attr.href "https://web.archive.org/"
                                    , Attr.id "wayback_url"
                                    , Attr.target "_blank"
                                    ]
                                    [ text "Wayback Machine" ]
                                ]
                            , p []
                                [ b []
                                    [ text "Step 2. " ]
                                , text "Enter the domain to restore in the provided box" ]
                            , p []
                                [ b []
                                    [ text "Step 3. " ]
                                , text "Select a snapshot using the date selector" ]
                            , p []
                                [ b []
                                    [ text "Step 4. " ]
                                , text "Copy the URL in the bar below" ]
                            ]
                        , br []
                            []
                        , div
                            [ Attr.id "domain-search-header"
                            ]
                            [ i
                                [ Attr.class "fas fa-globe"
                                ]
                                []
                            , input
                                [ Attr.id "url"
                                , Attr.name "url"
                                , Attr.placeholder "https://web.archive.org/web/20210130001414/http://example.com/"
                                , Attr.type_ "text"
                                , Attr.value model.url
                                , onInput ChangeUrl
                                ]
                                []
                            , span
                                [ Attr.class "inline-button-domain-order"
                                ]
                                [ button
                                    [ Attr.attribute "data-original-title" "restore"
                                    , Attr.id "transfer-btn"
                                    , Attr.name "restore"
                                    , Attr.type_ "button"
                                    , Attr.value "Restore"
                                    , if user.subscribed then
                                        onClick ClickedRestore
                                      else
                                        onClick ClickedAddToCart
                                    ]
                                    [ if user.subscribed then
                                        case model.status of
                                            Loading -> viewSpinnerSymbol
                                            _ -> i
                                                    [ Attr.class "fas fa-undo"
                                                    ]
                                                    []
                                    else i
                                        [ Attr.class "fas fa-undo"
                                        ]
                                        []
                                    ]
                                ]
                            ]
                        , br []
                            []
                        ]
                    ]
                , br []
                    []
                , br []
                    []
                , if not user.subscribed then
                    viewOrderSummary env storage model
                  else
                    div [] []
                ]
            ]
        ]

viewOrderSummary: EnvironmentVar -> Storage -> Model -> Html Msg
viewOrderSummary env storage model =
    let
        count = List.length storage.cart.items
        total = if count <= 1 then env.itemCost else env.itemCost + (count - 1) * env.multiItemCost
    in
    div
        [ Attr.class "col-md"
        ]
        [ div
            [ Attr.class "futures-version-3-box"
            ]
            [ h4 []
                [ text "Order Summary" ]
            , div
                [ Attr.id "alertOrder"
                , Attr.attribute "role" "alert"
                ]
                []
            , br []
                []
            , table
                [ Attr.class "table table-dedicated-hosting-container"
                , Attr.id "order"
                ]
                [ tbody []
                    (List.indexedMap (viewCartItem env) storage.cart.items)
                ]
            , hr [] []
            , table
                [ Attr.class "table"
                ]
                [ tbody []
                    [ tr []
                          [ td []
                              [ b []
                                  [ text "Total:" ]
                              ]
                          , td []
                              [ span
                                  [ Attr.id "totalOrder"
                                  ]
                                  [ text (String.fromInt total) ]
                              , text "$" ]
                          ]
                      ]
                ]
            , div
                [ Attr.class "form-group mt-3" ]
                [ label [] [ text "Email address" ]
                , input
                    [ Attr.type_ "email"
                    , Attr.class "form-control"
                    , Attr.placeholder "Enter your email to save your order"
                    , Attr.value model.email
                    , onInput ChangeEmail
                    ]
                    []
                , small [ Attr.class "form-text text-muted" ] [ text "We'll send your restore link here." ]
                ]
            , button
                [ Attr.class "plan-dedicated-order-button"
                , Attr.href "#"
                , Attr.id "checkout-button"
                , Attr.attribute "style" "border: none"
                , onClick ClickedCheckout
                ]
                (case model.status of
                    Loading -> viewSpinnerText
                    _ -> [ text "Checkout" ]
                )
            ]
        ]

viewCartItem: EnvironmentVar -> Int -> CartItem -> Html Msg
viewCartItem env idx cartItem =
    let
        price = if idx == 0 then env.itemCost else env.multiItemCost
    in
    tr []
        [ td []
            [ text (cartItem.domain ++ " (" ++ cartItem.timestamp ++ ")") ]
        , td []
            [ text ((String.fromInt price) ++ "$") ]
        , td []
            [ button [ Attr.class "plan-dedicated-order-button"
                , Attr.attribute "style" "background: #ce634a; border:none"
                , onClick (ClickedRemoveFromCart cartItem)
                ]
                [ text "Remove" ]
            ]
        ]