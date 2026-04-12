module Pages.Privacy exposing (Model, Msg, page)

import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Html exposing (Html, a, b, br, div, h1, h4, h5, li, p, section, span, text, ul)
import Html.Attributes as Attr
import Page
import Request exposing (Request)
import Shared
import Storage exposing (Storage)
import View exposing (View)


page : Shared.Model -> Request -> Page.With Model Msg
page shared _ =
    Page.element
        { init = init
        , update = update
        , view = view shared
        , subscriptions = \_ -> Sub.none
        }

-- Init
type Msg
    = ClickedToggleMenu

type alias Model =
    { showMenu: Bool
    }

init: (Model, Cmd Msg)
init =
    (Model False, Cmd.none)


-- Update
update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ClickedToggleMenu ->
            if model.showMenu then
                ( { model | showMenu = False }, Cmd.none )
            else
                ( { model | showMenu = True }, Cmd.none )

-- View

view : Shared.Model -> Model -> View Msg
view shared model =
    { title = "Privacy Policy | Wayback Download"
    , body = [ viewHeader shared.storage.user "other" "" (Html.text "") (Html.text "") ClickedToggleMenu model.showMenu
             , viewSection1
             , viewFooter shared.year
             ]
    }

viewSection1: Html msg
viewSection1 =
        section
            [ Attr.class "padding-60-0-100 position-relative"
            ]
            [ div
                [ Attr.class "container"
                ]
                [ div
                    [ Attr.class "row"
                    ]
                    [ div
                        [ Attr.class "col-md-12 help-center-header"
                        ]
                        [ h1
                            [ Attr.class "help-center-title"
                            ]
                            [ span []
                                [ text "Last update: May 2021" ]
                            , text "Privacy policy" ]
                        , p
                            [ Attr.class "help-center-text"
                            ]
                            [ text "This privacy policy sets out how Wayback Download uses and protects any information that you give Wayback Download when you use our services. Wayback Download is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using our services, then you can be assured that it will only be used in accordance with this privacy statement. Wayback Download may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes." ]
                        ]
                    ]
                , div
                    [ Attr.class "row justify-content-start mr-tp-20"
                    ]
                    [ div
                        [ Attr.class "col-lg privacy-content mr-tp-40"
                        ]
                        [ h4 []
                            [ text "Data related to account" ]
                        , p []
                            [ text "Any email address provided to Wayback Download through either our waiting list, optional email verification, or optional notification/recovery email setting in your account, is considered personal data." ]
                        , p []
                            [ text "Such data will only be used to contact you with important notifications about Wayback Download, to send you information related to security, to send you an invitation link to create your Wayback Download account, to verify your Wayback Download account, or to send you password recovery links if you enable the option. We may also inform you about new products in which you might have an interest. You are free, at any given time, to opt-out of those features through the account settings panel." ]
                        , p []
                            [ text "In order to pursue our legitimate interest of preventing the creation of accounts by spam bots or human spammers, Wayback Download uses a variety of human verification methods. You may be asked to verify using either reCaptcha, Email, or SMS. IP addresses, email addresses, and phone numbers provided are saved temporarily in order to send you a verification code and to determine if you are a spammer. If this data is saved permanently, it is always saved as a cryptographic hash, which ensures that the raw values cannot be deciphered by us." ]
                        , br []
                            []
                        , h4 []
                            [ text "Data Collection" ]
                        , p []
                            [ text "Wayback Download's overriding policy is to collect as little user information as possible to ensure a completely private and anonymous user experience when using our services." ]
                        , p []
                            [ text "Service's user data collection is limited to the following:" ]
                        , ul []
                            [ li []
                                [ p []
                                    [ b []
                                        [ text "Visiting our website:" ]
                                    , text "We do not make use of any analytics on our website and we do not log any user activity." ]
                                ]
                            , li []
                                [ p []
                                    [ b []
                                        [ text "Account creation:" ]
                                    , text "We collect only the necessary information for billing and communication. We encourage all users to provide an anonymous email address through the use of services like ", a
                                        [ Attr.href "https://anonaddy.com/"
                                        , Attr.target "_blank"
                                        ]
                                        [ text "AnonAddy" ]
                                    , text "." ]
                                ]
                            , li []
                                [ p []
                                    [ b []
                                        [ text "Account activity:" ]
                                    , text "Minimal information is retained during account usage (such as domains restored, recovered deleted websites, how you use the wayback machine downloader, etc.). This information is used to provide you with accurate experience." ]
                                ]
                            , li []
                                [ p []
                                    [ b []
                                        [ text "Communicating with Wayback Download:" ]
                                    , text "Your communications with us, such as support requests, bug reports or feature requests may be saved. But you are welcome to do so anonymously." ]
                                ]
                            ]
                        , br []
                            []
                        , h4 []
                            [ text "Data Use" ]
                        , p []
                            [ text "We do not have any advertising on our site. Any data that that we do have (which is very little), will only be shared under extraordinary circumstances (such as through a court order)." ]
                        , br []
                            []
                        , h4 []
                            [ text "Data Storage" ]
                        , p []
                            [ text "All servers used in connection with the provisioning of our services are located in the United States through Amazon Web Services." ]
                        , br []
                            []
                        , h4 []
                            [ text "Third Party Networks" ]
                        , p []
                            [ text "To provide every user with a secure user experience, we make use of some minimal third party tools, namely: Stripe (for payment processing) and AWS Cognito (for credential handling). We encourage every user to read these companies privacy policy carefully as the data they handle is out of our control." ]
                        , br []
                            []
                        , h4 []
                            [ text "Right to Access, Rectification, Erasure, Portability, and right to lodge a complaint" ]
                        , p []
                            [ text "Through our services, you can directly access, edit, delete or export personal data processed by Wayback Download. If your account has been suspended for a breach of our terms and conditions, and you would like to exercise the rights related to your personal data, you can make a request to our support team.", br []
                                []
                            , br []
                                []
                            , text "In case of violation of your rights, you have the right to lodge a complaint to the competent supervisory authority." ]
                        , br []
                            []
                        , h4 []
                            [ text "Data Retention" ]
                        , p []
                            [ text "When an Wayback Download account is closed, data is immediately delete from production servers. Active accounts will have data retained as long as the user requests to have it. Deleted data may be retained for some time in our backups for regulatory purposes." ]
                        , br []
                            []
                        , h4 []
                            [ text "Data Disclosure" ]
                        , p []
                            [ text "We will only disclose the limited user data we possess if we are instructed to do so by a fully binding request coming from the competent Canadian or United States authorities (legal obligation). While we may comply with electronically delivered notices (see exceptions below), the disclosed data can only be used in court after we have received an original copy of the court order by registered post or in person, and provide a formal response.", br []
                                []
                            , text "If a request is made for encrypted message content that Wayback Download does not possess the ability to decrypt, the fully encrypted message content may be turned over. If permitted by law, Wayback Download will always contact a user first before any data disclosure.", br []
                                []
                            , text "Wayback Download may from time to time, contest requests if there is a public interest in doing so. In such situations, Wayback Download will not comply with the request until all legal or other remedies have been exhausted." ]
                        , br []
                            []
                        ]
                    ]
                ]
            ]
