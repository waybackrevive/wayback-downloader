module Pages.Dashboard exposing (Model, Msg, page)

import Common.CustomHttp as CustomHttp
import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Response exposing (Receipt, Response, Restore)
import Common.PageViewer exposing (checkReceiptContainSearch, checkRestoreContainsSearch, filterPages, splitList, viewPages)
import DateFormat
import Domain.User exposing (User)
import Environment exposing (EnvironmentVar)
import Gen.Route as Route
import Html.Attributes as Attr
import Html.Events exposing (onInput)
import Http exposing (jsonBody)
import Protobuf.Encode as Encode
import Request exposing (Request)
import Html exposing (Html, a, button, div, h3, h4, h5, input, main_, p, section, span, table, tbody, td, text, th, thead, tr)
import Page
import Proto.Response as Proto
import Shared
import Storage exposing (Storage)
import Time
import View exposing (View)
import Round


page : Shared.Model -> Request -> Page.With Model Msg
page shared req =
    Page.protected.element <|
        \user ->
            { init = init shared user req
            , update = update shared.storage
            , view = view shared
            , subscriptions = \_ -> Sub.none
            }

-- Init

type Status
    = Loading
    | Failure String
    | None

type Msg
    = RestoreResp (Result Http.Error Proto.Response)
    | ReceiptResp (Result Http.Error Proto.Response)
    | ChangeSearchRestore String
    | ClickedPageNumRestore Int
    | ClickedNextPageRestore
    | ClickedPrevPageRestore
    | ChangeSearchReceipt String
    | ClickedPageNumReceipt Int
    | ClickedNextPageReceipt
    | ClickedPrevPageReceipt
    | ClickedToggleMenu

type alias Model =
    { status: Status
    , restores: List(Restore)
    , restoresSplit: List(List(Restore))
    , tempRestores: List(Restore)
    , searchRestore: String
    , numPagesRestore: Int
    , currentPageRestore: Int
    , receipts: List(Receipt)
    , receiptsSplit: List(List(Receipt))
    , tempReceipts: List(Receipt)
    , searchReceipts: String
    , numPagesReceipts: Int
    , currentPageReceipts: Int
    , showMenu: Bool
    }

numResultsPerPage =
    5

init: Shared.Model -> User -> Request -> (Model, Cmd Msg)
init shared user req =
    let
        model = (Model Loading [] [] [] "" 1 1 [] [] [] "" 1 1 False)
    in
    if user.admin then
        ( model
        , Request.replaceRoute Route.Admin req
        )
    else
        ( model
        , Cmd.batch [ getRestores shared.env user shared.storage
                    , getReceipts shared.env user shared.storage
                    ]
        )


-- Update

getRestores: EnvironmentVar -> User -> Storage -> Cmd Msg
getRestores env user storage =
    Http.request
        { url = env.serverUrl ++ "/restore"
        , method = "GET"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token) ]
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeCart storage.cart)
        , expect = CustomHttp.expectProto RestoreResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }

getReceipts: EnvironmentVar -> User -> Storage -> Cmd Msg
getReceipts env user storage =
    Http.request
        { url = env.serverUrl ++ "/receipt"
        , method = "GET"
        , headers = [ Http.header "Authorization" ("Bearer " ++ user.token) ]
        , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeCart storage.cart)
        , expect = CustomHttp.expectProto ReceiptResp Proto.decodeResponse
        , timeout = Nothing
        , tracker = Nothing
        }

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

update: Storage -> Msg -> Model -> (Model, Cmd Msg)
update storage msg model =
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
                                    let
                                        sList = splitList numResultsPerPage data.restores
                                    in
                                    case List.head sList of
                                        Just r ->
                                            ( { model | status = None, restores = data.restores, restoresSplit = sList, tempRestores = r, numPagesRestore = (List.length sList) }, Cmd.none)
                                        Nothing ->
                                            ( { model | status = None, restores = data.restores, restoresSplit = sList, tempRestores = [] }, Cmd.none)
                                Nothing ->
                                    errorHandler model storage (Http.BadBody "Unable to decode")
                Err err ->
                    errorHandler model storage err

        ReceiptResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    let
                                        sList = splitList numResultsPerPage data.receipts
                                    in
                                    case List.head sList of
                                        Just r ->
                                            ( { model | status = None, receipts = data.receipts, receiptsSplit = sList, tempReceipts = r, numPagesReceipts = (List.length sList) }, Cmd.none)
                                        Nothing ->
                                            ( { model | status = None, receipts = data.receipts, receiptsSplit = sList, tempReceipts = [] }, Cmd.none)
                                Nothing ->
                                    errorHandler model storage (Http.BadBody "Unable to decode")
                Err err ->
                    errorHandler model storage err

        ChangeSearchRestore search ->
            let
                sList = splitList numResultsPerPage (List.filter (checkRestoreContainsSearch search) model.restores)
            in
            ( { model | searchRestore = search, numPagesRestore = (List.length sList), currentPageRestore = model.currentPageRestore, tempRestores = (filterPages model.currentPageRestore sList) }, Cmd.none)


        ClickedPageNumRestore num ->
            ( { model | tempRestores = (filterPages num model.restoresSplit), currentPageRestore = num }, Cmd.none)

        ClickedNextPageRestore ->
             if (model.currentPageRestore + 1 <= (model.numPagesRestore)) then
                let
                    num = (model.currentPageRestore + 1)
                in
                ( { model | tempRestores = (filterPages num model.restoresSplit), currentPageRestore = num }, Cmd.none)
            else
                ( model, Cmd.none )


        ClickedPrevPageRestore ->
            if (model.currentPageRestore - 1 > 0) then
                let
                    num = (model.currentPageRestore - 1)
                in
                ( { model | tempRestores = (filterPages num model.restoresSplit), currentPageRestore = num }, Cmd.none)
            else
                ( model, Cmd.none )

        ChangeSearchReceipt search ->
            let
                sList = splitList numResultsPerPage (List.filter (checkReceiptContainSearch search) model.receipts)
            in
            ( { model | searchReceipts = search, numPagesReceipts = (List.length sList), currentPageReceipts = model.currentPageReceipts, tempReceipts = (filterPages model.currentPageReceipts sList) }, Cmd.none)


        ClickedPageNumReceipt num ->
            ( { model | tempReceipts = (filterPages num model.receiptsSplit), currentPageReceipts = num }, Cmd.none)


        ClickedNextPageReceipt ->
            if (model.currentPageReceipts + 1 <= (model.numPagesReceipts)) then
                let
                    num = (model.currentPageReceipts + 1)
                in
                ( { model | tempReceipts = (filterPages num model.receiptsSplit), currentPageReceipts = num }, Cmd.none)
            else
                ( model, Cmd.none )

        ClickedPrevPageReceipt ->
            if (model.currentPageReceipts - 1 > 0) then
                let
                    num = (model.currentPageReceipts - 1)
                in
                ( { model | tempReceipts = (filterPages num model.receiptsSplit), currentPageReceipts = num }, Cmd.none)
            else
                ( model, Cmd.none )

        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )



view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "My Restore History | Wayback Download"
    , body = [ viewHeader shared.storage.user "sub" "" viewMain (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1 model
             , viewSection2 model
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
            [ text "Dashboard" ]
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
                            [ text "Websites" ]
                        , div
                            [ Attr.class "col-sm-12 col-md-4 float-right"
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
                                    , onInput ChangeSearchRestore
                                    , Attr.value model.searchRestore
                                    ]
                                    []
                                ]
                            ]
                        , table
                            [ Attr.class "table table-hover"
                            , Attr.style "table-layout" "fixed"
                            , Attr.style "word-wrap" "break-word"
                            , Attr.id "websites"
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
                                    ]
                                ]
                            , tbody
                                [ Attr.id "websites"
                                ]
                                (List.map viewRestoreItem model.tempRestores)
                            ]
                        , viewPages ClickedPrevPageRestore ClickedNextPageRestore ClickedPageNumRestore model.currentPageRestore model.numPagesRestore
                        , div
                            [ Attr.class "container"
                            ]
                            [ div
                                [ Attr.class "row"
                                ]
                                [ div
                                    [ Attr.class "col-12 col-md-6"
                                    ]
                                    [ a
                                        [ Attr.class "plan-dedicated-order-button"
                                        , Attr.href (Route.toHref Route.Subscription )
                                        , Attr.style "background" "#5c5cfd"
                                        ]
                                        [ text "Subscribe" ]
                                    ]
                                , div
                                    [ Attr.class "col-12 col-md-6"
                                    ]
                                    [ a
                                        [ Attr.class "plan-dedicated-order-button"
                                        , Attr.href (Route.toHref Route.Order )
                                        , Attr.style "background" "#5c5cfd"
                                        ]
                                        [ text "Restore Website" ]
                                    ]
                                ]
                            ]
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
                        ]
                        [ h4 []
                            [ text "Payment History" ]
                        , div
                            [ Attr.class "col-sm-12 col-md-4 float-right"
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
                                    , onInput ChangeSearchReceipt
                                    , Attr.value model.searchReceipts
                                    ]
                                    []
                                ]
                            ]
                        , div
                            [ Attr.attribute "aria-hidden" "true"
                            , Attr.class "modal fade"
                            , Attr.id "model_website_"
                            , Attr.attribute "role" "dialog"
                            , Attr.tabindex -1
                            ]
                            [ div
                                [ Attr.class "modal-dialog"
                                , Attr.attribute "role" "document"
                                ]
                                [ div
                                    [ Attr.class "modal-content"
                                    ]
                                    [ div
                                        [ Attr.class "modal-header"
                                        ]
                                        [ h5
                                            [ Attr.class "modal-title"
                                            ]
                                            [ text "Confirm Deletion" ]
                                        , button
                                            [ Attr.attribute "aria-label" "Close"
                                            , Attr.class "close"
                                            , Attr.attribute "data-dismiss" "modal"
                                            , Attr.type_ "button"
                                            ]
                                            [ span
                                                [ Attr.attribute "aria-hidden" "true"
                                                ]
                                                [ text "×" ]
                                            ]
                                        ]
                                    , div
                                        [ Attr.class "modal-body"
                                        ]
                                        [ p []
                                            [ text "Are you sure you want to delete the website backup for:" ]
                                        , p []
                                            [ text "All data will be deleted during the next batch job." ]
                                        ]
                                    , div
                                        [ Attr.class "modal-footer"
                                        ]
                                        [ button
                                            [ Attr.class "btn btn-primary"
                                            , Attr.id "confirm_deletion"
                                            , Attr.type_ "button"
                                            ]
                                            [ text "Confirm" ]
                                        , button
                                            [ Attr.class "btn btn-secondary"
                                            , Attr.attribute "data-dismiss" "modal"
                                            , Attr.type_ "button"
                                            ]
                                            [ text "Cancel" ]
                                        ]
                                    ]
                                ]
                            ]
                        , table
                            [ Attr.class "table table-hover"
                            , Attr.id "payments"
                            , Attr.style "table-layout" "fixed"
                            , Attr.style "word-wrap" "break-word"
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
                                        [ text "Date" ]
                                    , th
                                        [ Attr.scope "col"
                                        ]
                                        [ text "Amount" ]
                                    ]
                                ]
                            , tbody
                                [ Attr.id "websites"
                                ]
                                (List.map viewReceiptItem model.tempReceipts)
                            ]
                        , viewPages ClickedPrevPageReceipt ClickedNextPageReceipt ClickedPageNumReceipt model.currentPageReceipts model.numPagesReceipts

                        ]
                    ]
                ]
            ]
        ]

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
            [ text (getDateFromPosix restore.transactDate) ]
        , td []
            [ text restore.timestamp ]
        , td []
            [ text restore.domain ]
        , td []
            [ text restore.status ]
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


viewReceiptItem: Receipt -> Html Msg
viewReceiptItem receipt =
    tr
        [ Attr.id "_website"
        ]
        [ th
            [ Attr.scope "row"
            ]
            [ a []
                []
            , a
                [ Attr.href receipt.url
                , Attr.target "_blank"
                ]
                [ text receipt.id ]
            ]
        , td []
            [ text receipt.date ]
        , td []
            [ case String.toFloat receipt.amount of
                Just amount ->
                    text ("$" ++ (Round.round 2 amount))
                Nothing ->
                    text ("$" ++ receipt.amount)
            ]
        ]
