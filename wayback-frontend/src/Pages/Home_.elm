module Pages.Home_ exposing (Model, Msg, page)

import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Common.Alert exposing (viewAlertError)
import Common.Regex exposing (domainRegex)
import Common.Parsing exposing (cartParser)
import Common.Spinner exposing (viewSpinnerSymbol)
import Common.CustomHttp as CustomerHttp
import Browser.Navigation as Nav
import Environment exposing (EnvironmentVar)
import Gen.Route as Route
import Html.Events exposing (keyCode, on, onClick, onInput)
import Http exposing (Error(..), Expect)
import Json.Decode as Decode exposing (Decoder)
import Protobuf.Encode as Encode
import Page exposing (Page)
import Proto.Response as Proto
import Parser
import Request exposing (Request)
import Html exposing (Attribute, Html, a, b, br, button, div, h1, h3, h4, h5, i, input, label, li, main_, p, section, small, span, text, ul)
import Html.Attributes as Attr
import Shared
import Storage exposing (Storage)
import View exposing (View)

page : Shared.Model -> Request -> Page.With Model Msg
page shared _ =
    Page.element
        { init = init
        , update = update shared
        , view = view shared
        , subscriptions = \_ -> Sub.none
        }

-- Init

type Status
    = Failure String
    | Loading
    | None

type alias Model =
    { domain : String
    , url: String
    , status: Status
    , showMenu: Bool
    }

init : (Model, Cmd Msg)
init =
    (Model "" "" None False, Cmd.none)

-- Update

type Msg
    = ClickedRestore
    | ClickedCheckout
    | ClickedOrderNow
    | KeyDown Int
    | ClickedExit
    | ChangeWaybackUrl String
    | ChangeDomain String
    | CheckoutResp (Result Http.Error Proto.Response)
    | ClickedToggleMenu

onKeyDown: (Int -> msg) -> Attribute msg
onKeyDown tagger =
  on "keydown" (Decode.map tagger keyCode)

restoreAction: Model -> (Model, Cmd Msg)
restoreAction model =
    if model.domain == "" then
        (model, Shared.popoverMessage "Error" "URL cannot be blank" "bottom")
    else if domainRegex (String.toLower model.domain) then
        (model, Shared.showModal "helpModal")
    else
        (model, Shared.popoverMessage "Error" "Invalid domain provided (ie. example.com)" "bottom")

getCheckoutUrl: EnvironmentVar -> Model -> (Model, Cmd Msg)
getCheckoutUrl env model =
    case (Parser.run cartParser model.url) of
        Ok cartItem ->
            ( model
                , Http.post
                    { url = env.serverUrl ++ "/checkout"
                    , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeCart (Proto.Cart [cartItem]))
                    , expect = CustomerHttp.expectProto CheckoutResp Proto.decodeResponse
                    }
                )
        Err _ ->
            ({ model | status = Failure "Invalid URL provided" }, Cmd.none)

update: Shared.Model -> Msg -> Model -> (Model, Cmd Msg)
update shared msg model =
    case msg of
        KeyDown key ->
            if key == 13 then
                restoreAction model
            else
                (model, Cmd.none)

        ClickedRestore ->
            restoreAction model

        ClickedExit -> (model, Shared.hideModal "helpModal")

        ClickedCheckout ->
            getCheckoutUrl shared.env { model | status = Loading }

        ChangeWaybackUrl url ->
            ({model | url = url}, Cmd.none)

        ChangeDomain domain ->
            ({model | domain = domain}, Cmd.none)

        CheckoutResp result ->
            case result of
                Ok resp ->
                    case resp.status of
                        Proto.Status_FAILED ->
                            ( { model | status = Failure resp.error }, Cmd.none)
                        _ ->
                            case resp.data of
                                Just data ->
                                    (model, Nav.load data.url)
                                _ ->
                                    ( { model | status = Failure "Unable to process request, please try again later" }, Cmd.none)

                Err _ ->
                    ( { model | status = Failure "Unable to process request, please try again later" }, Cmd.none)

        ClickedOrderNow ->
            (model, Shared.showModal "helpModal")

        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )



-- View

view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "Recover Any Website from archive.org — Starting at $29 | Wayback Download"
    , body = [ viewHeader shared.storage.user "main" model.domain (viewMain model) (viewModal model) ClickedToggleMenu model.showMenu
             , viewSection1
             , viewSection2 shared.env
             , viewSection3
             , viewFooter shared.year
             ]
    }

viewMain: Model -> Html Msg
viewMain model =
    main_
        [ Attr.class "container mb-auto"
        ]
        [ div
            [ Attr.class "carousel carousel-main"
            ]
            [ div
                [ Attr.class "carousel-cell"
                ]
                [ h1
                    [ Attr.class "mt-3 main-header-text-title"
                    ]
                    [ text "Recover Your Lost Website from archive.org" ]
                , div
                    [ Attr.class "row justify-content-center domain-search-row"
                    ]
                    [ div
                        [ Attr.class "col-md-7"
                        , Attr.id "domain-search-header"
                        ]
                        [ i
                            [ Attr.class "fas fa-globe"
                            ]
                            []
                        , input
                            [ Attr.id "domain"
                            , Attr.name "domain"
                            , Attr.placeholder "select a domain to restore"
                            , Attr.type_ "text"
                            , Attr.value model.domain
                            , onInput ChangeDomain
                            , onKeyDown KeyDown
                            ]
                            []
                        , span
                            [ Attr.class "inline-button-domain-order"
                            ]
                            [ button
                                [ Attr.attribute "data-placement" "left"
                                , Attr.attribute "data-toggle" "tooltip"
                                , Attr.id "transfer-btn"
                                , Attr.name "restore"
                                , Attr.type_ "submit"
                                , Attr.value "Restore"
                                , onClick ClickedRestore
                                ]
                                [ i
                                    [ Attr.class "fas fa-undo"
                                    ]
                                    []
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]

viewModal: Model -> Html Msg
viewModal model =
    div
        [ Attr.class "modal"
        , Attr.attribute "data-backdrop" "static"
        , Attr.attribute "data-keyboard" "false"
        , Attr.id "helpModal"
        ]
        [ div
            [ Attr.class "modal-dialog modal-lg"
            ]
            [ div
                [ Attr.class "modal-content"
                ]
                [ div
                    [ Attr.class "modal-header"
                    ]
                    [ h4
                        [ Attr.class "modal-title"
                        ]
                        [ text "3 easy steps to start your recovery" ]
                    , button
                        [ Attr.class "close"
                        , Attr.attribute "data-dismiss" "modal"
                        , Attr.id "exit"
                        , Attr.type_ "button"
                        ]
                        [ text "×" ]
                    ]
                , div
                    [ Attr.class "modal-body"
                    ]
                    [ p []
                        [ b []
                            [ text "Step 1. " ]
                        , text "Navigate to the ", a
                            [ Attr.href ("https://web.archive.org/web/*/" ++ model.domain)
                            , Attr.id "wayback_url"
                            , Attr.target "_blank"
                            ]
                            [ text "Wayback Machine" ]
                        ]
                    , p []
                        [ b []
                            [ text "Step 2. " ]
                        , text "Select a snapshot using the date selector" ]
                    , p []
                        [ b []
                            [ text "Step 3. " ]
                        , text "Copy the URL in the bar below" ]
                    , case model.status of
                        Failure err -> viewAlertError err
                        _ -> div [] []
                    , div
                        [ Attr.class "col-md"
                        , Attr.id "domain-search-header"
                        ][
                        i
                            [ Attr.class "fas fa-globe"
                            ]
                            []
                        , input
                            [ Attr.id "url-checkout"
                            , Attr.name "url"
                            , Attr.placeholder "https://web.archive.org/web/20210130001414/http://example.com/"
                            , Attr.type_ "text"
                            , Attr.value model.url
                            , onInput ChangeWaybackUrl
                            ]
                            []
                        , span
                            [ Attr.class "inline-button-domain-order"
                            ]
                            [ button
                                [ Attr.attribute "data-placement" "left"
                                , Attr.attribute "data-toggle" "tooltip"
                                , Attr.id "transfer-btn-2"
                                , Attr.name "restore"
                                , Attr.type_ "submit"
                                , Attr.value "Restore"
                                , onClick ClickedCheckout
                                ]
                                [ case model.status of
                                    Loading -> viewSpinnerSymbol
                                    _ -> i
                                            [ Attr.class "fas fa-undo"
                                            ]
                                            []
                                ]
                            ]
                        ]
                        , br []
                                  []
                              , p []
                                  [ text " If you require any assistance during this process, our", a
                                      [ Attr.href "mailto:support@wayback.download"
                                      ]
                                      [ text " support team " ]
                                  , text "would be more than happy to help you out!" ]
                                  , div
                                          [ Attr.class "modal-footer"
                                          ]
                                          [ button
                                              [ Attr.class "btn btn-danger"
                                              , Attr.attribute "data-dismiss" "modal"
                                              , Attr.id "cancel"
                                              , Attr.type_ "button"
                                              ]
                                              [ text "Cancel" ]
                                          ]
                                      ]
                              ]
                        ]

            ]

viewSection1: Html msg
viewSection1 =
    section []
        [ div
            [ Attr.class "container"
            ]
            [ div
                [ Attr.class "row justify-content-start futures-version-2"
                ]
                [ div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "bredhicon-download-cloud"
                            ]
                            []
                        , h5 []
                            [ text "Complete Website Recovery" ]
                        , p []
                            [ text "All HTML, CSS, JS, images and fonts downloaded — your site looks exactly as it did in the archive." ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "bredhicon-share"
                            ]
                            []
                        , h5 []
                            [ text "All Links Auto-Fixed" ]
                        , p []
                            [ text "Every internal URL is automatically rewritten so your site works perfectly on any domain or hosting." ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "e-flaticon-032-sata"
                            ]
                            []
                        , h5 []
                            [ text "Upload & Go" ]
                        , p []
                            [ text "Receive a zip file by email. Upload it to your hosting and your site is live — no technical skills needed." ]
                        ]
                    ]
                ]
            ]
        ]

viewSection2: EnvironmentVar -> Html Msg
viewSection2 env =
    section
        [ Attr.class "padding-100-0 position-relative"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ h5
                [ Attr.class "title-default-coodiv-two"
                ]
                [ text "Simple, transparent pricing.", span
                    [ Attr.class "mr-tp-20"
                    ]
                    [ text "Flat fee per domain. No hidden charges." ]
                ]
            , div
                [ Attr.class "test-row row justify-content-start second-pricing-table-container mr-tp-30"
                ]
                [ div
                    [ Attr.class "col-md-4"
                    ]
                    [ div
                        [ Attr.class "second-pricing-table"
                        ]
                        [ h5
                            [ Attr.class "second-pricing-table-title"
                            ]
                            [ text "HTML Recovery", span []
                                [ text "1 domain recovered from archive.org" ]
                            ]
                        , span
                            [ Attr.class "second-pricing-table-price monthly"
                            ]
                            [ i
                                [ Attr.class "monthly"
                                ]
                                [ text ("$" ++ String.fromInt env.itemCost) , small []
                                    [ text "/website" ]
                                ]
                            ]
                        , ul
                            [ Attr.class "second-pricing-table-body"
                            ]
                            [ li []
                                [ text "Looks 100% like the archived version" ]
                            , li []
                                [ text "All CSS, images, JS & fonts included" ]
                            , li []
                                [ text "Archive.org headers stripped out" ]
                            , li []
                                [ text "Pages load on their original URLs" ]
                            , li []
                                [ text "Up to 20,000 pages or 10 GB" ]
                            , li []
                                [ text "Additional domains: $19 each" ]
                            ]
                        , a
                            [ Attr.class "second-pricing-table-button"
                            , Attr.href "#"
                            , Attr.id "basic_order"
                            , onClick ClickedOrderNow
                            ]
                            [ text "Order now" ]
                        ]
                    ]
                , div
                    [ Attr.class "col-md-4"
                    ]
                    [ div
                        [ Attr.class "second-pricing-table"
                        ]
                        [ h5
                            [ Attr.class "second-pricing-table-title"
                            ]
                            [ text "WordPress Conversion", span []
                                [ text "convert your HTML files to WordPress" ]
                            ]
                        , span
                            [ Attr.class "second-pricing-table-price monthly"
                            ]
                            [ i
                                [ Attr.class "monthly"
                                ]
                                [ text "$89", small []
                                    [ text "/domain" ]
                                ]
                            ]
                        , ul
                            [ Attr.class "second-pricing-table-body"
                            ]
                            [ li []
                              [ text "WordPress theme identical to original" ]
                            , li []
                                [ text "WYSIWYG editor-ready pages" ]
                            , li []
                                [ text "Menu integration included" ]
                            , li []
                                [ text "Original title & meta descriptions" ]
                            , li []
                                [ text "Automatic string replacement" ]
                            , li []
                                [ text "Best-quality guarantee under $200" ]
                            ]
                        , a
                            [ Attr.class "second-pricing-table-button"
                            , Attr.href "#"
                            ]
                            [ text "Coming Soon" ]
                        ]
                    ]
                , div
                    [ Attr.class "col-md-4"
                    ]
                    [ div
                        [ Attr.class "second-pricing-table style-2 active"
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
                                [ text ("from $" ++ String.fromInt env.basicSubscriptionCost), small []
                                    [ text "/mo" ]
                                ]
                            ]
                        , ul
                            [ Attr.class "second-pricing-table-body"
                            ]
                            [ li []
                                [ text "Basic: up to 12 HTML restores/month" ]
                            , li []
                                [ text "Premium: up to 100 restores/month" ]
                            , li []
                                [ text "Priority order processing" ]
                            , li []
                                [ text "Configurable link creation" ]
                            , li []
                                [ text "Discounted WordPress conversion" ]
                            , li []
                                [ text "Email support included" ]
                            ]
                        , a
                            [ Attr.class "second-pricing-table-button"
                            , Attr.href (Route.toHref Route.Subscription )
                            ]
                            [ text "See Plans" ]
                        ]
                    ]
                ]
            ]
        ]

viewSection3: Html msg
viewSection3 =
    section
        [ Attr.class "padding-100-0 with-top-border"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ h5
                [ Attr.class "title-default-coodiv-two"
                ]
                [ text "Frequently Asked Questions" ]
            , div
                [ Attr.class "row justify-content-center mr-tp-40"
                ]
                [ div
                    [ Attr.class "col-md-9"
                    ]
                    [ div
                        [ Attr.class "accordion"
                        , Attr.id "frequently-questions"
                        ]
                        [ div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingone"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionone"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionone"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "What is the difference between HTML Restore and WordPress Restore?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingone"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionone"
                                ]
                                [ text "HTML Restore and WordPress Restore both recover websites from the Wayback Machine. The key difference is the format of the restored website. HTML Restore provides a website in HTML format, while WordPress Restore converts the website into a WordPress website, creating a WordPress theme for easy customization." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingtwo"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questiontwo"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questiontwo"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "What does 'ready-to-use solution' mean?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingtwo"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questiontwo"
                                ]
                                [ text "A 'ready-to-use solution' means that the website we provide is fully functional and ready to be uploaded to your server. You don't need to do any additional coding or setup. Simply upload the files to your server, and your website will work as it did before." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingthree"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionthree"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionthree"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "How does the SEO optimization feature work?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingthree"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionthree"
                                ]
                                [ text "Our SEO optimization feature ensures that your restored website is SEO-friendly. We follow best practices for website structure, meta tags, and other key SEO factors. This helps your website rank better in search engine results, increasing its visibility and traffic." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingfour"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionfour"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionfour"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "How does the URL rewrite feature work?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingfour"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionfour"
                                ]
                                [ text "The URL rewrite feature automatically corrects all URLs in the restored website, including those for CSS, JS, Images, and Fonts. This ensures that they point to your local files instead of the original online sources. This feature is crucial for the website to function correctly after restoration." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingfive"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionfive"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionfive"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "What hosting platforms does this service work with?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingfive"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionfive"
                                ]
                                [ text "Our service is compatible with a wide range of hosting platforms. As long as the platform supports HTML or WordPress (for WordPress Restores), you should be able to use our service without any issues. This includes popular hosting platforms like cPanel, Bluehost, GoDaddy, SiteGround, and many others. If you have specific questions about compatibility with a certain hosting platform, please feel free to contact us." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingsix"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionsix"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionsix"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "How long does the restore process take?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingsix"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionsix"
                                ]
                                [ text "Your order is queued up immediately after submitting it. The orders are then processed in the order that they are received! Many factors will impact the restore process time (like the number of pages being restored), but in general, you should receive your files within the day." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingseven"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionseven"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionseven"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "Does this work with Wordpress websites?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingseven"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionseven"
                                ]
                                [ text "Yes, it does! We offer two restoration plans: HTML Restore and WordPress Restore. Both plans can restore any website, including WordPress websites, from the Wayback Machine. The HTML Restore plan will provide you with an HTML version of the website, which will work perfectly fine even if the original was a WordPress site. The WordPress Restore plan, on the other hand, will convert the website into a WordPress format, creating a WordPress theme for easy customization. So, regardless of the original website's platform, our service can effectively restore it in the format you prefer." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingeight"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questioneight"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questioneight"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "Can I really recover deleted websites?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingeight"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questioneight"
                                ]
                                [ text "Absolutely! The Internet Archive's Wayback Machine continuously captures snapshots of websites across the web. If a snapshot of your deleted website exists, we can transform that web archive into a fully functional HTML website, complete with all supporting files. So, in most cases, you can indeed recover deleted websites!" ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingnine"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionine"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionine"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "How does Wayback Download retrieve data from archive.org (Internet Archive)?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingnine"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionine"
                                ]
                                [ text "Wayback Download uses advanced cloud technology to access the Internet Archive's Wayback Machine. We input the URL of the website you want to restore, and our system retrieves the most recent snapshot available from the Wayback Machine. This includes all the HTML, CSS, JS, images, and fonts associated with the website. Our service then processes this data, rewrites the URLs, and packages it into a ready-to-use format that you can easily upload to your server." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingten"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionten"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionten"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "Can this be used as a normal website downloader?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingten"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionten"
                                ]
                                [ text "Yes! Since virtually every website is being archived from the Internet Archive's Wayback Machine, you can download practically any website. If a snapshot does not exist, you can request one ", a
                                    [ Attr.href "https://web.archive.org/"
                                    , Attr.target "_blank"
                                    ]
                                    [ text "here" ]
                                , text ", and then you'll be able to download it with us!" ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingeleven"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questioneleven"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questioneleven"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "How can I support the Internet Archive's Wayback Machine?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingeleven"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questioneleven"
                                ]
                                [ text "Donating is simple, simply head over to the ", a
                                    [ Attr.href "https://archive.org/donate?origin=wbwww-TopNavDonateButton"
                                    , Attr.target "_blank"
                                    ]
                                    [ text "Internet Archive" ]
                                , text " and select an amount you would like to donate. We rely on the Internet Archive's data to provide this service, so we encourage everyone using our service to support them!" ]
                            ]
                        ]
                    ]
                ]
            ]
        ]
