module Pages.Admin exposing (Model, Msg, page)

import Common.Alert exposing (viewAlertError, viewAlertSuccess)
import Common.CustomHttp as CustomHttp
import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Response exposing (Receipt, Response, Restore)
import Common.Spinner exposing (viewSpinnerText)
import Common.PageViewer exposing (checkRestoreContainsSearch, filterPages, splitList, viewPages)
import DateFormat
import Domain.User exposing (User)
import Environment exposing (EnvironmentVar)
import Gen.Route as Route
import Html.Attributes as Attr
import Html.Events exposing (onClick, onInput)
import Http exposing (jsonBody)
import List exposing (drop, sortBy, take)
import Protobuf.Encode as Encode
import Request exposing (Request)
import Html exposing (Html, a, br, button, div, h1, h3, h4, h5, i, iframe, input, label, li, main_, nav, p, section, span, table, tbody, td, text, textarea, th, thead, tr, ul)
import Page
import Proto.Response as Proto
import Shared
import Storage exposing (Storage)
import String exposing (contains)
import Time
import View exposing (View)

page : Shared.Model -> Request -> Page.With Model Msg
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
    = OrderResp (Result Http.Error Proto.Response)
    | QueueResp (Result Http.Error Proto.Response)
    | AbandonedResp (Result Http.Error Proto.Response)
    | ChangeDomain String
    | ChangeTimestamp String
    | ChangeRestoreID String
    | ChangeEmail String
    | ChangeAction String
    | ChangeMethod String
    | ClickedQueue
    | ClickedQueueOrders Restore
    | ClickedResend Restore
    | ClickedClear
    | ClickedRefresh
    | ChangeSearch String
    | ClickedPageNum Int
    | ClickedNextPage
    | ClickedPrevPage
    | ClickedToggleMenu


type alias Model =
    { status: Status
    , restores: List(Restore)
    , restoresSplit: List(List(Restore))
    , tempRestores: List(Restore)
    , queue: Proto.QueueForm
    , search: String
    , numPages: Int
    , currentPage: Int
    , showMenu: Bool
    , abandonedSessions: List(Proto.AbandonedSession)
    }

numResultsPerPage: Int
numResultsPerPage =
    10

init: Shared.Model -> User -> Request -> (Model, Cmd Msg)
init shared user req =
    let
        model = (Model None [] [] [] (Proto.QueueForm "" "" "" "" "" "") "" 1 1 False [])
    in
    if not user.admin then
        ( model
        , Request.replaceRoute Route.Dashboard req
        )
    else
        ( model, Cmd.batch [ getOrders shared.env user shared.storage, getAbandoned shared.env user ] )



-- Update


getOrders: EnvironmentVar -> User -> Storage -> Cmd Msg
getOrders env user storage =
    Http.request
        { url = env.serverUrl ++ "/admin/restores"
        , method = "GET"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token) ]
        , body = Http.emptyBody
        , expect = CustomHttp.expectProto OrderResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }

getAbandoned: EnvironmentVar -> User -> Cmd Msg
getAbandoned env user =
    Http.request
        { url = env.serverUrl ++ "/admin/abandoned"
        , method = "GET"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token) ]
        , body = Http.emptyBody
        , expect = CustomHttp.expectProto AbandonedResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }

queueMessage: EnvironmentVar -> User -> Model -> (Model, Cmd Msg)
queueMessage env user model =
    ( model
    , Http.request
        { url = env.serverUrl ++ "/admin/queue"
        , method = "POST"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token) ]
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeQueueForm model.queue)
        , expect = CustomHttp.expectProto QueueResp Proto.decodeResponse
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
        OrderResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    let
                                        sList = splitList numResultsPerPage data.restores
                                    in
                                    case List.head sList of
                                        Just r ->
                                            ( { model | status = None, restores = data.restores, restoresSplit = sList, tempRestores = r, numPages = (List.length sList) }, Cmd.none)
                                        Nothing ->
                                            ( { model | status = None, restores = data.restores, restoresSplit = sList, tempRestores = [] }, Cmd.none)
                                Nothing ->
                                    errorHandler model storage (Http.BadBody "Unable to decode")
                Err err ->
                    errorHandler model storage err

        QueueResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            ( { model | status = Success "Successfully queued message", queue = (Proto.QueueForm "" "" "" "" "" "") }, Cmd.none)
                Err err ->
                    errorHandler model storage err

        AbandonedResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( model, Cmd.none )
                        _ ->
                            case resp.data of
                                Just data ->
                                    ( { model | abandonedSessions = data.abandonedSessions }, Cmd.none )
                                Nothing ->
                                    ( model, Cmd.none )
                Err _ ->
                    ( model, Cmd.none )

        ClickedQueue ->
            if model.queue.domain /= "" && model.queue.timestamp /= "" && model.queue.restoreId /= "" && model.queue.email /= "" && model.queue.action /= "" then
                queueMessage env user { model | status = Loading }
            else
                ( { model | status = Failure "Cannot have blank fields" }, Cmd.none)


        ChangeDomain domain ->
            let
                oldForm = model.queue
                newForm =
                    { oldForm | domain = domain }
            in
            ( { model | queue = newForm }, Cmd.none)


        ChangeTimestamp timestamp ->
            let
                oldForm = model.queue
                newForm =
                    { oldForm | timestamp = timestamp }
            in
            ( { model | queue = newForm }, Cmd.none)

        ChangeRestoreID restoreId ->
            let
                oldForm = model.queue
                newForm =
                    { oldForm | restoreId = restoreId }
            in
            ( { model | queue = newForm }, Cmd.none)

        ChangeEmail email ->
            let
                oldForm = model.queue
                newForm =
                    { oldForm | email = email }
            in
            ( { model | queue = newForm }, Cmd.none)

        ChangeAction action ->
            let
                oldForm = model.queue
                newForm =
                    { oldForm | action = action }
            in
            ( { model | queue = newForm }, Cmd.none)

        ChangeMethod method ->
            let
                oldForm = model.queue
                newForm =
                    { oldForm | method = method }
            in
            ( { model | queue = newForm }, Cmd.none)

        ClickedQueueOrders restore ->
            let
                oldForm = model.queue
                newForm =
                    { oldForm | domain = restore.domain, timestamp = restore.timestamp, restoreId = restore.id, email = restore.email, action = "restore", method = "main" }
            in
            ( { model | queue = newForm }, Cmd.none)


        ClickedResend restore ->
            let
                oldForm = model.queue
                newForm =
                    { oldForm | domain = restore.domain, timestamp = restore.timestamp, restoreId = restore.id, email = restore.email, action = "resend", method = "blank" }
            in
            ( { model | queue = newForm }, Cmd.none)

        ClickedClear ->
            ( { model | queue = (Proto.QueueForm "" "" "" "" "" "") }, Cmd.none)

        ClickedRefresh ->
            ( model, getOrders env user storage)

        ChangeSearch search ->
            let
                sList = splitList numResultsPerPage (List.filter (checkRestoreContainsSearch search) model.restores)
            in
            ( { model | search = search, numPages = (List.length sList), currentPage = model.currentPage, tempRestores = (filterPages model.currentPage sList) }, Cmd.none)


        ClickedPageNum num ->
            ( { model | tempRestores = (filterPages num model.restoresSplit), currentPage = num }, Cmd.none)

        ClickedNextPage ->
             if (model.currentPage + 1 <= (model.numPages)) then
                let
                    num = (model.currentPage + 1)
                in
                ( { model | tempRestores = (filterPages num model.restoresSplit), currentPage = num }, Cmd.none)
            else
                ( model, Cmd.none )

        ClickedPrevPage ->
            if (model.currentPage - 1 > 0) then
                let
                    num = (model.currentPage - 1)
                in
                ( { model | tempRestores = (filterPages num model.restoresSplit), currentPage = num }, Cmd.none)
            else
                ( model, Cmd.none )

        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )




view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "Administration | Wayback Download"
    , body = [ viewHeader shared.storage.user "sub" "" viewMain (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1 model
             , viewSection2 model
             , viewSection3 model
             , viewFooter shared.year
             ]
    }

viewMain: Html Msg
viewMain =
    main_
        [ Attr.class "container mb-auto"
        ]
        [ h1
            [ Attr.class "mt-3 main-header-text-title"
            ]
            [ text "Administration" ]
        ]

viewSection1: Model -> Html Msg
viewSection1 model =
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
                            [ text "Orders" ]
                        , br [] []
                        , div
                            [ Attr.class "row"
                            ]
                            [ div
                                [ Attr.class "col-sm-12 col-md-3"
                                ]
                                [ button
                                  [ Attr.class "plan-dedicated-order-button"
                                  , Attr.style "background" "#4b6cbf"
                                  , Attr.style "border" "0px"
                                  , onClick ClickedRefresh
                                  ]
                                  [ text "Refresh" ]
                                ]
                            , div
                                [ Attr.class "col-sm-12 col-md-6"
                                ]
                                []
                            , div
                                [ Attr.class "col-sm-12 col-md-3"
                                ]
                                [ div
                                    [ Attr.id "websites_filter"
                                    , Attr.class "dataTables_filter"
                                    ]
                                    [ input
                                        [ Attr.type_ "text"
                                        , Attr.class "form-control"
                                        , Attr.id "usr"
                                        , Attr.placeholder "Search"
                                        , Attr.value model.search
                                        , onInput ChangeSearch
                                        ]
                                        []
                                    ]
                                ]
                            ]
                        , br [] []
                        , table
                            [ Attr.class "table table-hover"
                            , Attr.style "table-layout" "fixed"
                            , Attr.style "word-wrap" "break-word"
                            , Attr.id "orders"
                            ]
                            [ thead []
                                [ tr []
                                    [ th
                                        [ Attr.scope "col"
                                        ]
                                        [ text "ID" ]
                                    , th
                                        [ Attr.scope "col"
                                        ]
                                        [ text "Username" ]
                                    , th
                                        [ Attr.scope "col"
                                        ]
                                        [ text "Email" ]
                                    , th
                                        [ Attr.scope "col"
                                        ]
                                        [ text "Date" ]
                                    , th
                                        [ Attr.scope "col"
                                        ]
                                        [ text "Wayback Timestamp" ]
                                    , th
                                        [ Attr.scope "col"
                                        ]
                                        [ text "Domain" ]
                                    , th
                                        [ Attr.scope "col"
                                        ]
                                        [ text "Status" ]
                                    , th
                                        [ Attr.scope "col"
                                        ]
                                        [ text "Action" ]
                                    ]
                                ]
                            , tbody
                                [ Attr.id "websites"
                                ]
                                (List.map viewRestoreItem model.tempRestores)
                            ]
                        , viewPages ClickedPrevPage ClickedNextPage ClickedPageNum model.currentPage model.numPages
                        ]
                    ]
                ]
            ]
        ]


viewSection2: Model -> Html Msg
viewSection2 model =
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
                            [ text "Queue" ]
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
                                   [ text "Domain" ]
                                , div
                                   [ Attr.class "col-sm-10"
                                   ]
                                   [ input
                                       [ Attr.type_ "text"
                                       , Attr.class "form-control"
                                       , Attr.value model.queue.domain
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
                                       , Attr.value model.queue.timestamp
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
                                    [ text "Restore ID" ]
                                , div
                                    [ Attr.class "col-sm-10"
                                    ]
                                    [ input
                                       [ Attr.type_ "text"
                                       , Attr.class "form-control"
                                       , Attr.value model.queue.restoreId
                                       , Attr.placeholder "Restore ID"
                                       , onInput ChangeRestoreID
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
                                    [ text "Client Email" ]
                                , div
                                    [ Attr.class "col-sm-10"
                                    ]
                                    [ input
                                       [ Attr.type_ "text"
                                       , Attr.class "form-control"
                                       , Attr.value model.queue.email
                                       , Attr.placeholder "Client Email"
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
                                    [ text "Action" ]
                                , div
                                    [ Attr.class "col-sm-10"
                                    ]
                                    [ input
                                       [ Attr.type_ "text"
                                       , Attr.class "form-control"
                                       , Attr.value model.queue.action
                                       , Attr.placeholder "Action"
                                       , onInput ChangeAction
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
                                    [ text "Method" ]
                                , div
                                    [ Attr.class "col-sm-10"
                                    ]
                                    [ input
                                       [ Attr.type_ "text"
                                       , Attr.class "form-control"
                                       , Attr.value model.queue.method
                                       , Attr.placeholder "Method"
                                       , onInput ChangeMethod
                                       ]
                                       []
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
                                      , onClick ClickedQueue
                                      ]
                                      (case model.status of
                                           Loading -> viewSpinnerText
                                           _ -> [ text "Queue"]
                                      )
                                    ]
                                ]
                            , td []
                                [ div
                                     [ Attr.class "col-12 col-md-6"
                                     ]
                                     [ a
                                       [ Attr.class "plan-dedicated-order-button"
                                       , Attr.style "background" "#d63838"
                                       , Attr.href "#"
                                       , onClick ClickedClear
                                       ]
                                       [ text "Clear"]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]


--viewPages: Model -> Html Msg
--viewPages model =
--    nav
--        [ Attr.attribute "aria-label" "Page navigation example"
--        ]
--        [ ul
--          [ Attr.class "pagination justify-content-center"
--          ]
--          (List.map (viewPage model) (List.range 0 (model.numPages + 1)))
--        ]
--
--viewPage: Model -> Int -> Html Msg
--viewPage model pageNum=
--    if pageNum == 0 then
--        li
--            [ if model.currentPage == 1 then
--                Attr.class "page-item disabled"
--              else
--                Attr.class "page-item"
--            ]
--            [ button
--              [ Attr.class "page-link"
--              , Attr.tabindex -1
--              , onClick ClickedPrevPage
--              ]
--              [ text "Previous" ]
--            ]
--    else if pageNum == (model.numPages + 1) then
--        li
--            [ if model.currentPage == model.numPages then
--                Attr.class "page-item disabled"
--              else
--                Attr.class "page-item"
--            ]
--            [ button
--              [ Attr.class "page-link"
--              , onClick ClickedNextPage
--              ]
--              [ text "Next" ]
--            ]
--    else
--        li
--            [ (if model.currentPage == pageNum then
--                    Attr.class "page-item active"
--               else
--                    Attr.class "page-item"
--              )
--            ]
--            [ button
--              [ Attr.class "page-link"
--              , onClick (ClickedPageNum pageNum)
--              ]
--              [ text (String.fromInt pageNum) ]
--            ]

viewRestoreItem: Restore -> Html Msg
viewRestoreItem restore =
    tr
        [ Attr.id "_website"
        ]
        [ th
            [ Attr.scope "row"
            ]
            [ a []
                []
            , a
                [ Attr.href restore.s3Url
                ]
                [ text restore.id ]
            ]
        , td []
            [ text restore.username ]
        , td []
            [ text restore.email ]
        , td []
            [ text (getDateFromPosix restore.transactDate) ]
        , td []
            [ text restore.timestamp ]
        , td []
            [ text restore.domain ]
        , td []
            [ text restore.status ]
        , td []
            [ div
              [ Attr.class "col-12 col-md-6"
              ]
              [ a
                [ Attr.class "plan-dedicated-order-button"
                , Attr.style "background" "#4b6cbf"
                , Attr.style "border" "0px"
                , Attr.style "width" "100px"
                , Attr.href (Route.toHref (Route.Admin__Update__Id_ {id=restore.id}))
                ]
                [ text "Update" ]
              , button
                [ Attr.class "plan-dedicated-order-button"
                , Attr.style "background" "#1ec1d6"
                , Attr.style "margin-top" "2px"
                , Attr.style "margin-bottom" "2px"
                , Attr.style "border" "0px"
                , Attr.style "width" "100px"
                , onClick (ClickedResend restore)
                ]
                [ text "Re-send" ]
              , button
                [ Attr.class "plan-dedicated-order-button"
                , Attr.style "background" "#5ad18a"
                , Attr.style "border" "0px"
                , Attr.style "width" "100px"
                , onClick (ClickedQueueOrders restore)
                ]
                [ text "Queue" ]
              ]
            ]
        ]

getDateFromPosix: String -> String
getDateFromPosix posix =
    case String.toInt posix of
        Just date ->
            DateFormat.format [ DateFormat.yearNumber
                                 , DateFormat.text "-"
                                 , DateFormat.monthFixed
                                 , DateFormat.text "-"
                                 , DateFormat.dayOfMonthFixed
            ] Time.utc (Time.millisToPosix (date * 1000))
        Nothing ->
            posix


viewSection3: Model -> Html Msg
viewSection3 model =
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
                        [ h4 [] [ text "Abandoned Carts" ]
                        , p [ Attr.class "text-muted" ] [ text (String.fromInt (List.length model.abandonedSessions) ++ " sessions awaiting payment") ]
                        , div
                            [ Attr.class "table-responsive"
                            ]
                            [ table
                                [ Attr.class "table table-striped table-hover"
                                ]
                                [ thead []
                                    [ tr []
                                        [ th [] [ text "Created At" ]
                                        , th [] [ text "Email" ]
                                        , th [] [ text "Domains" ]
                                        , th [] [ text "Cart Value" ]
                                        , th [] [ text "Emails Sent" ]
                                        , th [] [ text "Checkout Link" ]
                                        ]
                                    ]
                                , tbody []
                                    (List.map viewAbandonedItem model.abandonedSessions)
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]


viewAbandonedItem: Proto.AbandonedSession -> Html Msg
viewAbandonedItem session =
    tr []
        [ td [] [ text session.createdAt ]
        , td [] [ text session.email ]
        , td [] [ text (String.join ", " (List.map .domain session.items)) ]
        , td [] [ text ("$" ++ session.cartValue) ]
        , td [] [ text session.recoverySentCount ]
        , td []
            [ a
                [ Attr.href session.checkoutUrl
                , Attr.target "_blank"
                , Attr.class "plan-dedicated-order-button"
                , Attr.style "background" "#1a2238"
                , Attr.style "border" "0px"
                , Attr.style "width" "100px"
                ]
                [ text "Checkout" ]
            ]
        ]