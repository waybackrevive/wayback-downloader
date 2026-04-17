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
import Html exposing (Attribute, Html, a, b, br, button, div, h1, h2, h3, h4, h5, i, input, label, li, main_, p, section, small, span, strong, text, ul)
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
    , email: String
    , status: Status
    , showMenu: Bool
    }

init : (Model, Cmd Msg)
init =
    (Model "" "" "" None False, Cmd.none)

-- Update

type Msg
    = ClickedRestore
    | ClickedCheckout
    | ClickedOrderNow
    | KeyDown Int
    | ClickedExit
    | ChangeWaybackUrl String
    | ChangeDomain String
    | ChangeEmail String
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
                    , body = Http.bytesBody "application/protobuf" <| Encode.encode (Proto.encodeCart (Proto.Cart [cartItem] model.email))
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

        ChangeEmail email ->
            ({model | email = email}, Cmd.none)

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
    { title = "Restore Any Website from the Wayback Machine — From $29 | Wayback Download"
    , body = [ viewHeader shared.storage.user "main" model.domain (viewMain model) (viewModal model) ClickedToggleMenu model.showMenu
             , viewTrustBar
             , viewSection1
             , viewSectionHowItWorks
             , viewSection2 shared.env
             , viewSectionWhoIsItFor
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
                    [ text "Restore Any Lost Website from the Wayback Machine" ]
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
                            , Attr.placeholder "Enter a domain to restore"
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
                        [ text "Recover Your Website — 3 Simple Steps" ]
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
                    [ div [ Attr.class "alert alert-info py-2 mb-3", Attr.style "font-size" "0.9rem" ]
                        [ i [ Attr.class "fas fa-lock mr-1" ] []
                        , text " Secure checkout · One-time payment · "
                        , b [] [ text "$29/website" ]
                        , text " · No subscription required"
                        ]
                    , div [ Attr.class "mb-3" ]
                        [ p [ Attr.class "mb-1" ]
                            [ span [ Attr.class "badge badge-primary mr-2" ] [ text "1" ]
                            , text "Open the "
                            , a
                                [ Attr.href ("https://web.archive.org/web/*/" ++ model.domain)
                                , Attr.id "wayback_url"
                                , Attr.target "_blank"
                                ]
                                [ text "Wayback Machine" ]
                            , text " for your domain"
                            ]
                        , p [ Attr.class "mb-1" ]
                            [ span [ Attr.class "badge badge-primary mr-2" ] [ text "2" ]
                            , text "Pick the snapshot date you want to restore"
                            ]
                        , p [ Attr.class "mb-1" ]
                            [ span [ Attr.class "badge badge-primary mr-2" ] [ text "3" ]
                            , text "Paste the full archive URL into the field below"
                            ]
                        ]
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
                        , div
                            [ Attr.class "form-group mt-3"
                            ]
                            [ label [] [ b [] [ text "Your email address" ] ]
                            , input
                                [ Attr.id "email-checkout"
                                , Attr.name "email"
                                , Attr.placeholder "you@example.com"
                                , Attr.type_ "email"
                                , Attr.class "form-control"
                                , Attr.value model.email
                                , onInput ChangeEmail
                                ]
                                []
                            , small [ Attr.class "form-text text-muted" ]
                                [ i [ Attr.class "fas fa-envelope mr-1" ] []
                                , text "We'll email you a download link when your restore is ready. "
                                , text "No spam, ever."
                                ]
                            ]
                        , div [ Attr.class "mt-3 text-muted", Attr.style "font-size" "0.85rem" ]
                            [ i [ Attr.class "fas fa-headset mr-1" ] []
                            , text "Questions? Our "
                            , a [ Attr.href "mailto:support@wayback.download" ] [ text "support team" ]
                            , text " is here to help."
                            ]
                        , div
                            [ Attr.class "modal-footer"
                            ]
                            [ button
                                [ Attr.class "btn btn-outline-secondary"
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
    section
        [ Attr.class "padding-100-0 position-relative"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ h2
                [ Attr.class "title-default-coodiv-two"
                ]
                [ text "Everything Included — One Flat Fee" ]
            , div
                [ Attr.class "row justify-content-start futures-version-2 mr-tp-30"
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
        [ Attr.id "pricing"
        , Attr.class "padding-100-0 position-relative"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ h2
                [ Attr.class "title-default-coodiv-two"
                ]
                [ text "Simple, Transparent Pricing", span
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
            [ h2
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
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingtwelve"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questiontwelve"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questiontwelve"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "How much does website restoration cost?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingtwelve"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questiontwelve"
                                ]
                                [ text "A single-domain HTML restore starts at $29. Each additional domain added to the same order is $19. If you restore sites regularly, our Basic subscription plan ($39/month) covers up to 12 restores and our Premium plan ($95/month) covers up to 100 restores per month." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingthirteen"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionthirteen"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionthirteen"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "Is it legal to restore a website from the Wayback Machine?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingthirteen"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionthirteen"
                                ]
                                [ text "Yes. Restoring your own website, or a website you have permission to recover, is legal. The Internet Archive makes publicly crawled content accessible to everyone. You should only restore websites you own or have authorisation to recover." ]
                            ]
                        , div
                            [ Attr.class "questions-box"
                            ]
                            [ div
                                [ Attr.id "headingfourteen"
                                ]
                                [ button
                                    [ Attr.attribute "aria-controls" "questionfourteen"
                                    , Attr.attribute "aria-expanded" "true"
                                    , Attr.class "btn questions-title collapsed"
                                    , Attr.attribute "data-target" "#questionfourteen"
                                    , Attr.attribute "data-toggle" "collapse"
                                    , Attr.type_ "button"
                                    ]
                                    [ text "What if only an old version of my site is archived?" ]
                                ]
                            , div
                                [ Attr.attribute "aria-labelledby" "headingfourteen"
                                , Attr.class "collapse questions-reponse"
                                , Attr.attribute "data-parent" "#frequently-questions"
                                , Attr.id "questionfourteen"
                                ]
                                [ text "When you place your order you choose the specific Wayback Machine snapshot URL. You can pick any archived snapshot date that exists — just navigate to ", a [ Attr.href "https://web.archive.org", Attr.target "_blank" ] [ text "web.archive.org" ], text ", find the snapshot closest to when your site looked best, and use that URL when ordering." ]
                            ]
                        ]
                    ]
                ]
            ]
        ]


viewTrustBar: Html msg
viewTrustBar =
    section
        [ Attr.style "background" "#f8f9ff"
        , Attr.style "border-top" "1px solid #e8e8f0"
        , Attr.style "border-bottom" "1px solid #e8e8f0"
        , Attr.style "padding" "18px 0"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ div
                [ Attr.class "row justify-content-center text-center"
                ]
                [ div
                    [ Attr.class "col-md-3 col-6"
                    , Attr.style "padding" "8px 16px"
                    ]
                    [ i
                        [ Attr.class "fas fa-check-circle"
                        , Attr.style "color" "#6c3fe0"
                        , Attr.style "font-size" "1.5rem"
                        , Attr.style "display" "block"
                        , Attr.style "margin-bottom" "6px"
                        ]
                        []
                    , p
                        [ Attr.style "margin" "0"
                        , Attr.style "font-size" "0.85rem"
                        , Attr.style "font-weight" "700"
                        , Attr.style "color" "#2d2d4e"
                        ]
                        [ text "10,000+ Sites Restored" ]
                    ]
                , div
                    [ Attr.class "col-md-3 col-6"
                    , Attr.style "padding" "8px 16px"
                    ]
                    [ i
                        [ Attr.class "fas fa-clock"
                        , Attr.style "color" "#6c3fe0"
                        , Attr.style "font-size" "1.5rem"
                        , Attr.style "display" "block"
                        , Attr.style "margin-bottom" "6px"
                        ]
                        []
                    , p
                        [ Attr.style "margin" "0"
                        , Attr.style "font-size" "0.85rem"
                        , Attr.style "font-weight" "700"
                        , Attr.style "color" "#2d2d4e"
                        ]
                        [ text "Results Within 24 Hours" ]
                    ]
                , div
                    [ Attr.class "col-md-3 col-6"
                    , Attr.style "padding" "8px 16px"
                    ]
                    [ i
                        [ Attr.class "fas fa-lock"
                        , Attr.style "color" "#6c3fe0"
                        , Attr.style "font-size" "1.5rem"
                        , Attr.style "display" "block"
                        , Attr.style "margin-bottom" "6px"
                        ]
                        []
                    , p
                        [ Attr.style "margin" "0"
                        , Attr.style "font-size" "0.85rem"
                        , Attr.style "font-weight" "700"
                        , Attr.style "color" "#2d2d4e"
                        ]
                        [ text "Secure Checkout" ]
                    ]
                , div
                    [ Attr.class "col-md-3 col-6"
                    , Attr.style "padding" "8px 16px"
                    ]
                    [ i
                        [ Attr.class "fas fa-database"
                        , Attr.style "color" "#6c3fe0"
                        , Attr.style "font-size" "1.5rem"
                        , Attr.style "display" "block"
                        , Attr.style "margin-bottom" "6px"
                        ]
                        []
                    , p
                        [ Attr.style "margin" "0"
                        , Attr.style "font-size" "0.85rem"
                        , Attr.style "font-weight" "700"
                        , Attr.style "color" "#2d2d4e"
                        ]
                        [ text "Powered by archive.org" ]
                    ]
                ]
            ]
        ]


viewSectionHowItWorks: Html msg
viewSectionHowItWorks =
    section
        [ Attr.class "padding-100-0 position-relative how-it-work-section"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ h2
                [ Attr.class "title-default-coodiv-two"
                ]
                [ text "Restore Any Website in 3 Simple Steps" ]
            , div
                [ Attr.class "row justify-content-center mr-tp-70 how-it-work-section-row"
                ]
                [ div
                    [ Attr.class "col-md-4"
                    ]
                    [ div
                        [ Attr.class "how-it-works-box"
                        ]
                        [ i
                            [ Attr.class "h-flaticon-011-globe-2"
                            ]
                            []
                        , h5 []
                            [ text "1. Enter Your Domain" ]
                        , p []
                            [ text "Type the domain you want to recover in the search box above — e.g. example.com. We find every archived snapshot available in the Wayback Machine." ]
                        ]
                    ]
                , div
                    [ Attr.class "col-md-4"
                    ]
                    [ div
                        [ Attr.class "how-it-works-box"
                        ]
                        [ i
                            [ Attr.class "h-flaticon-014-calendar"
                            ]
                            []
                        , h5 []
                            [ text "2. Pick a Snapshot" ]
                        , p []
                            [ text "Browse ", a [ Attr.href "https://web.archive.org/", Attr.target "_blank" ] [ text "web.archive.org" ], text " and choose the best archived version of your site. Any year, any date — you decide." ]
                        ]
                    ]
                , div
                    [ Attr.class "col-md-4"
                    ]
                    [ div
                        [ Attr.class "how-it-works-box"
                        ]
                        [ i
                            [ Attr.class "h-flaticon-008-upload"
                            ]
                            []
                        , h5 []
                            [ text "3. Receive & Go Live" ]
                        , p []
                            [ text "Paste the snapshot URL, pay $29 flat, and receive a clean zip by email — all URLs rewritten, archive headers stripped, ready to upload to any host." ]
                        ]
                    ]
                ]
            ]
        ]


viewSectionWhoIsItFor: Html msg
viewSectionWhoIsItFor =
    section
        [ Attr.class "padding-100-0 position-relative with-top-border"
        ]
        [ div
            [ Attr.class "container"
            ]
            [ h2
                [ Attr.class "title-default-coodiv-two"
                ]
                [ text "Who Uses Wayback Download?" ]
            , div
                [ Attr.class "row justify-content-start futures-version-2 mr-tp-30"
                ]
                [ div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-user-tie fa-2x mb-3"
                            , Attr.style "color" "#6c3fe0"
                            ]
                            []
                        , h5 []
                            [ text "Business Owners" ]
                        , p []
                            [ text "Your website was deleted, hacked, or your developer disappeared. We restore it from archive.org so your business is back online fast — no technical skills needed." ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-chart-line fa-2x mb-3"
                            , Attr.style "color" "#6c3fe0"
                            ]
                            []
                        , h5 []
                            [ text "SEO & PBN Managers" ]
                        , p []
                            [ text "Restore expired domains at scale. Our bulk subscription covers up to 100 HTML restores per month — ideal for rebuilding PBN assets and link networks." ]
                        , a
                            [ Attr.href "/subscription"
                            ]
                            [ text "See bulk subscription plans →" ]
                        ]
                    ]
                , div
                    [ Attr.class "flex-futures col-md-4"
                    ]
                    [ div
                        [ Attr.class "futures-version-2-box"
                        ]
                        [ i
                            [ Attr.class "fas fa-code fa-2x mb-3"
                            , Attr.style "color" "#6c3fe0"
                            ]
                            []
                        , h5 []
                            [ text "Web Developers & Agencies" ]
                        , p []
                            [ text "Recover client sites quickly and hand off clean, host-ready files. ZIP delivered by email with all internal links rewritten and archive.org wrapper stripped." ]
                        ]
                    ]
                ]
            ]
        ]
