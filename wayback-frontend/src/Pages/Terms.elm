module Pages.Terms exposing (Model, Msg, page)

import Common.Footer exposing (viewFooter)
import Common.Header exposing (viewHeader)
import Html exposing (Html, a, br, div, h1, h4, h5, p, section, span, strong, text)
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
    { title = "Terms of Service | Wayback Download"
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
                        , text "Terms of service" ]
                    , p
                        [ Attr.class "help-center-text"
                        ]
                        [ text "This Terms of Service (\"Agreement\") is a legally binding contract between Wayback Download and you (\"Customer,\" \"you\" or \"your\") that shall govern the purchase and use, in any manner, of the services provided by Wayback Download to Customer (collectively, the \"Services\")." ]
                    , p
                        [ Attr.class "help-center-text"
                        ]
                        [ text "By purchasing and/or using the Services in any manner, you represent that you have read, understand, and agree to all terms and conditions set forth in this Agreement, and that you are at least eighteen (18) years old and have the legal ability to engage in a contract in Quebec,Canada." ]
                    , p
                        [ Attr.class "help-center-text"
                        ]
                        [ text "If you do not agree to all the terms and conditions set forth in this Agreement, then you may not use any of the Services. If you are already a customer of Wayback Download and do not agree with the terms and conditions set forth in this Agreement, you should immediately contact Wayback Download to cancel your Services." ]
                    ]
                ]
            , div
                [ Attr.class "row justify-content-start mr-tp-20"
                ]
                [ div
                    [ Attr.class "col-lg privacy-content mr-tp-40"
                    ]
                    [ h4 []
                        [ strong []
                            [ text "1. Ownership and Services Purchased" ]
                        ]
                    , p []
                        [ text "1.1. The individual or entity set out in our records as the primary billing contact shall be the owner of the account." ]
                    , p []
                        [ text "1.2. The features and details of the Services governed by this Agreement are described on the web pages setting out the particular services or products you have purchased (\"Service Description Page\") based on their description on the Service Description Page as of the Effective Date, as defined below. Wayback Download may modify the products and services it offers from time-to-time. Should the Service Description Page change subsequent to the Effective Date, we have no obligation to modify the Service to reflect such a change. The services and products provided to you by Wayback Download as set out on the Service Description Page, are referred to as the \"Services.\"" ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "2. Term of Agreement" ]
                        ]
                    , p []
                        [ text "2.1. This Agreement becomes effective immediately when Customer clicks \"I Agree.\" (\"Effective Date\") and remains effective and binding until terminated by either party as outlined below. This Agreement may only be modified by a written amendment signed by an authorized executive of Wayback Download, or by the posting by Wayback Download of a revised version." ]
                    , p []
                        [ text "2.2. The term of this Agreement is set to the Customer's billing term (\"Term\"). If no Term is set out, the Term shall be one (1) year. Upon expiration of the initial Term, this Agreement shall renew for periods equal to the length of the initial Term, unless one party provides notice of its intent to terminate as set out in this Agreement." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "3. Obeying the Law" ]
                        ]
                    , p []
                        [ text "3.1. Wayback Download is registered and located within Canada and as such, we are required to comply with the laws and official policies of Canada, regardless of where the Services are provided. In addition, Wayback Download will comply with appropriate laws and official policies set forth by Quebec." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "4. Payments and Billing" ]
                        ]
                    , p []
                        [ text "4.1. Wayback Download will automatically bill your payment method on file up to fifteen (15) days prior to the due date on all terms of one (1) or more years; for terms less than one (1) year in length, Wayback Download will attempt to bill your payment method on file up to five (5) days prior to due date. All fees are billed in United States Dollars (“USD”) and are subject to change with thirty (30) days notice prior notice to you." ]
                    , p []
                        [ text "4.2. Your \"Billing Term\" is the period of time you have chosen to receive bills for the Services. For example, your Billing Term may be monthly, quarterly, or annually." ]
                    , p []
                        [ text "4.3. Wayback Download is only able to automatically collect payment from customers with credit cards stored on file (as opposed to credit cards used one for one time transactions) or active PayPal subscriptions. All other payment methods (one time credit card payments, check, money order, PayPal one time payments, etc.) must be initiated manually by you. It is your obligation to ensure that reoccurring fees are paid on their due date." ]
                    , p []
                        [ text "4.4. As a customer of Wayback Download, it is your responsibility to ensure that all billing information on file with Wayback Download is accurate, and that any credit card or other automated payment method on file has sufficient funds for processing. You are solely responsible for any and all fees charged to your payment method by the issuer, bank, or financial institution including, but not limited to, membership, overdraft, insufficient funds and over the credit limit fees. Wayback Download screens all orders for fraud and other unethical practices. Services will not be activated until this fraud screen is completed. In certain cases, if your account is flagged for fraud, third party services, such as domain name registrations, will not be processed. Wayback Download has no liability for the failure to provide Services, including third party services, if your account fails its fraud screen." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "5. Late Payments" ]
                        ]
                    , p []
                        [ text "5.1. Any account not paid in full by the end of the first day of the Billing Term will be given a seven (7) day grace period. If payment is not made within the seven (7) day grace period, Wayback Download reserves the right to suspend your Service(s) with Wayback Download and to charge a $10 \"late penalty.\" Fourteen (14) days following suspension of Services for non-payment, Wayback Download reserves the right to terminate Service(s) for non-payment." ]
                    , p []
                        [ text "5.2. Wayback Download is not responsible for any damages or losses as a result of suspension or termination for non-payment of your account. In addition, Wayback Download reserves the right to refuse to re-activate your Services until any and all outstanding invoice(s) have been paid in full." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "6. Refund Policy and Billing Disputes" ]
                        ]
                    , p []
                        [ text "6.1. Wayback Download offers a fourteen (14) day money back guarantee on website restores for major discrepencies between the restore files and the Internet Archive's Wayback Machine's website. Beyond 14 days, no refunds are available for any reason." ]
                    , p []
                        [ text "6.2. No refunds are offered on any other services." ]
                    , p []
                        [ text "6.3. Only first-time accounts are eligible for a refund under the 14 day money back guarantee. For example, if you had or still have an account with Wayback Download before, canceled and signed up again, you will not be eligible for a refund or if you have opened a second account with Wayback Download. In addition, refunds are not offered for accounts that are suspended or terminated for violating this Agreement." ]
                    , p []
                        [ text "6.4. Refunds will be issued only to the payment method that the original payment was sent from, and may take up to one (1) week to process." ]
                    , p []
                        [ text "6.5. The following methods of payment are not refundable any circumstances (including during the money back guarantee period, if one applies), and refunds will be posted solely as credit to the hosting account for current or future Services: bank wire transfers, Western Union payments, checks, and money orders." ]
                    , p []
                        [ text "6.6. Wayback Download will not activate new orders or provide additional Services for customers who have an outstanding balance with Wayback Download. For a new order to be setup or a new package to be activated, you must have a balance of $0.00, unless otherwise stated by Wayback Download in writing." ]
                    , p []
                        [ text "6.7. Exchange rate fluctuations for international payments are constant and unavoidable. Like all payments, all refunds are processed in U.S. dollars, and will reflect the exchange rate in effect on the date of the refund. All refunds are subject to this fluctuation and Wayback Download is not responsible for any change in exchange rates between time of payment and time of refund. In addition, Wayback Download reserves the right to refuse a refund at any time for any or no reason." ]
                    , p []
                        [ text "6.8. If you believe there is an error in Wayback Download's billing, you must contact Wayback Download about it, in writing, within thirty (30) days of the date you are billed or charged. Wayback Download's obligation to consider your claim is contingent on your providing it with sufficient facts for Wayback Download to investigate your claims. You waive your right to dispute any charges or fees if you fail to notify Wayback Download in writing or meet the deadline set out above. If Wayback Download finds that your claim is valid, Wayback Download agrees to credit your account on your next billing date. Third party fees are not subject to this dispute provision and are final." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "7. Chargebacks, Reversals, and Retrievals" ]
                        ]
                    , p []
                        [ text "7.1. If Wayback Download receives a chargeback or payment dispute from a credit card company, bank, or Stripe your Services may be suspended without notice. A $50 chargeback fee (issued to recoup mandatory fees passed on to Wayback Download by the credit card company), plus any outstanding balances accrued as a result of the chargeback(s), must be paid in full before service is restored. Instead of issuing a chargeback, please contact Wayback Download's billing team to address any billing issues." ]
                    , p []
                        [ text "7.2. If Wayback Download appeals a chargeback or other payment dispute and wins the dispute or appeal, the funds will likely be returned to Wayback Download by the credit card company or bank. Any double payment resulting from this process will be applied to Customer's account in the form of a service credit." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "8. Cancellation of Services" ]
                        ]
                    , p []
                        [ text "8.1. Either party may terminate this Agreement by providing notice to the other as provided herein." ]
                    , p []
                        [ text "8.2. You may cancel Service(s) with Wayback Download by submitting a cancellation request in writing by logging into Wayback Download's account center located at https://onintime.com/clientarea.php. In the event that you are unable to login to your billing account with Wayback Download, please contact our billing department via email and we will assist you. However, Wayback Download prefers that cancellations are submitted through the account center to reduce the likelihood of error and ensure the security of your account. Cancellations are not final until confirmed by a representative of Wayback Download in writing by email." ]
                    , p []
                        [ text "8.3. Cancellations must be requested via the form indicated above 48 hours or more prior to the Service's renewal date. If a cancellation notice is not received within the required time frame, you will be billed for the next Billing Term and are responsible for payment as set forth above." ]
                    , p []
                        [ text "8.4. If you pay Wayback Download via PayPal, it is your responsibility to cancel any subscription for recurring PayPal payments. Wayback Download (which has no control over PayPal subscription payments) is not responsible for payments made from your PayPal account after cancellation and is under no obligation to refund such payments made after cancellation." ]
                    , p []
                        [ text "When upgrading or downgrading package(s), you are responsible for canceling any previous package(s). To cancel previous package(s), you must submit a written cancellation request as described in Section 8.2 above." ]
                    , p []
                        [ text "8.6. Wayback Download may terminate this Agreement at any time by providing notice to Customers via email. Should Wayback Download terminate this Agreement for any reason other than a material breach, or violation of Wayback Download's Acceptable Use Policy, any prepaid fees shall be refunded." ]
                    , p []
                        [ text "8.7. One party may also terminate this Agreement upon the occurrence of a material breach which has not been cured by the other party within ten (10) days of their receipt of written notice of the breach. For the purposes of defining a material breach, materiality shall be determined from the perspective of a reasonable business person with significant experience in conducting business on the Internet. Notices of material breach must contain sufficient detail for the party against whom the assertion of material breach is directed to identify the breach and attempt to take corrective action." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "9. Refusal of Service" ]
                        ]
                    , p []
                        [ text "9.1. Wayback Download reserves the right to refuse service to anyone at any time. Any material that, in Wayback Download's judgment, is obscene, threatening, illegal, or violates Wayback Download's terms of service in any manner may be removed from Wayback Download's servers (or otherwise disabled), with or without notice." ]
                    , p []
                        [ text "9.2. Similarly, Wayback Download reserves the right to cancel, suspend, or otherwise restrict access to the Service(s) it provides at any time, for any or no reason, and with or without notice. Wayback Download is not responsible for any damages or loss of data resulting from such suspension or termination." ]
                    , p []
                        [ text "9.3. If any manner of communication with Wayback Download's staff could be construed as belligerent, vulgar (curse words), attacking, highly rude, threatening, or abusive, you will be issued one warning. If the communication continues, your account may be suspended or terminated without refund. This includes, but is not limited to, threats to sue, slander, libel, publicly post, or initiate a chargeback." ]
                    , p []
                        [ text "9.4. Wayback Download happily accepts orders from outside Canada, but may limit accounts from certain countries with a high fraud rate. To help protect Wayback Download and its customers from fraud, Wayback Download may ask you to provide a copy of a government issued identification and/or a scan of the credit card used for the purchase. If you fail to meet these requirements, the order may be considered fraudulent in nature and denied." ]
                    , p []
                        [ text "9.5. Due to the Canadian law, Wayback Download cannot accept any orders originating from countries that Canada has established an embargo on or otherwise prohibited trade with. By becoming a customer, you represent and warrant that: (i) you are not located in a country that is subject to a Canadian embargo, or that has been designated by the Canadian Government as a \"terrorist supporting\" country; and (ii) you are not listed on any U.S. Government list of prohibited or restricted parties." ]
                    , h4 []
                        [ strong []
                            [ text "10. Licenses" ]
                        ]
                    , p []
                        [ text "10.1. Wayback Download grants to you a non-exclusive, non-transferable, worldwide, royalty free license to use technology provided by Wayback Download solely to access and use the Services. This license terminates on the expiration or termination of this Agreement. Except for the license rights set out above, this license does not grant any additional rights to you. All right, title and interest in Wayback Download's technology shall remain with Wayback Download, or its licensors. You are not permitted to circumvent any devices designed to protect Wayback Download, or its licensor's ownership interests in the technology provided to you. In addition, you may not reverse engineer this technology." ]
                    , p []
                        [ text "10.2. You grant Wayback Download, or to any third parties used by Wayback Download to provide the Services, a non-exclusive, non-transferable, worldwide, royalty free, license to use, disseminate, transmit and cache content, technology and information provided by you and, if applicable, your End Users, in conjunction with the Services. This license terminates on the expiration or termination of this Agreement. All right, title and interest in your technology shall remain with you, or your licensors." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "11. Service Modifications" ]
                        ]
                    , p []
                        [ text "11.1. Wayback Download reserves the right to add, modify, or remove any or all features from any service Wayback Download provides, at any time, with or without notice. This includes, but is not limited to, disk space limits, bandwidth limits, domain limits, pricing, and third party applications. These changes can be made for any or no reason and Wayback Download does not guarantee the availability of any feature, whether written or implied. If the removal of a feature materially impacts your ability to use the Service, you may terminate this Agreement. For the purposes of this paragraph only, the term \"materially\" means that a reasonable business person would not have purchased the Services for the purposes used by you." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "12. Support Policy" ]
                        ]
                    , p []
                        [ text "12.1. Wayback Download will provide technical support to you during normal business day hours. The only official method for technical support is by email: ", a
                            [ Attr.href "mailto:support@wayback.download"
                            ]
                            [ text "support@wayback.download"
                            ]
                        , text "." ]
                    , p []
                        [ text "12.2. Limited support will be provided, at Wayback Download's discretion and subject to availability of staff, via email." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "13. Advanced Support Policy" ]
                        ]
                    , p []
                        [ text "13.1. Support to Customer is limited to Wayback Download's area of expertise and is available only for issues related to the physical functioning of the Services. Wayback Download does not provide support for any third party software including, but not limited to, software offered by but not developed by Wayback Download. Wayback Download reserves the right to refuse assistance with and/or assess an \"Advanced Support Fee\" of $35.00 USD per hour (1 hour minimum) for any issue that, at Wayback Download's sole discretion, is: (a) outside the scope of standard support; or (b) caused by customer error or omission. Wayback Download will always ask for your permission before providing advanced support that may be subject to a fee. By providing your permission, you agree to pay Advanced Support Fees as billed." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "14. Acceptable Usage Policy" ]
                        ]
                    , p []
                        [ text "14.1. You shall use Wayback Download's services only for lawful purposes. Transmission, storage, or presentation of any information, data, or material in violation of the laws of Quebec or Canada is prohibited. This includes, but is not limited to: copyrighted material in which you are not the copyright holder, material that is threatening or obscene, or material protected by trade secrets or other statutes. You agree to indemnify and hold harmless Wayback Download from any claims resulting from the use of the service which damages you or any other party." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "15. Warranties" ]
                        ]
                    , p []
                        [ text "15.1. Your Warranties to Wayback Download" ]
                    , p []
                        [ text "15.1.1. You represent and warrant to Wayback Download that: (i) you have the experience and knowledge necessary to use the Services; (ii) you will provide Wayback Download with material that may be implemented by it to provide the Services without extra effort on Wayback Download's part; and (iii) you have sufficient knowledge about administering, designing, and operating the functions facilitated by the Service to take advantage of it." ]
                    , p []
                        [ text "15.1.2. You expressly warrant that you own the entire right, title and interest to, or have an appropriate license to use, all material provided to Wayback Download, or which may be accessed or transmitted using the Services. You also warrant that to the extent you do business with other parties using the Services, that they have the same ownership interests in the materials provided to you, or accessed via you, that are set out in this paragraph." ]
                    , p []
                        [ text "15.2. Wayback Download's Warranties" ]
                    , p []
                        [ text "15.2.1. YOU EXPRESSLY AGREE THAT USE OF Wayback Download'S SERVICES IS AT YOUR OWN RISK. THE SERVICES ARE PROVIDED AS-IS AND AS-AVAILABLE. OTHER THAN AS EXPRESSLY SET OUT IN THIS AGREEMENT, Wayback Download HAS NOT, AND DOES NOT, MAKE ANY WARRANTIES WHETHER EXPRESS OR IMPLIED. THIS DISCLAIMER INCLUDES, BUT IS NOT LIMITED TO, THE WARRANTIES OR NON-INFRINGEMENT, FITNESS FOR A PARTICULAR PURPOSE, WARRANTIES OR MERCHANTABILITY, AND/OR TITLE. NEITHER Wayback Download, ITS PARENT, ITS EMPLOYEES, AGENTS, RESELLERS, THIRD PARTY INFORMATION PROVIDERS, MERCHANTS LICENSERS OR THE LIKE, WARRANT THAT Wayback Download'S SERVICES WILL NOT BE INTERRUPTED OR BE ERROR-FREE; NOR DO THEY MAKE ANY WARRANTY AS TO THE RESULTS THAT MIGHT BE OBTAINED FROM THE USE OF THE SERVICES OR AS TO THE ACCURACY, OR RELIABILITY, OF ANY INFORMATION SERVICE OR MERCHANDISE CONTAINED IN OR PROVIDED THROUGH Wayback Download'S NETWORK, UNLESS OTHERWISE EXPRESSLY STATED IN THIS AGREEMENT. Wayback Download SPECIFICALLY DISCLAIMS ANY AND ALL WARRANTIES REGARDING SERVICES PROVIDED BY THIRD PARTIES, REGARDLESS OF WHETHER THOSE SERVICES APPEAR TO BE PROVIDED BY Wayback Download. NO WARRANTIES MADE BY THESE THIRD PARTIES TO Wayback Download SHALL BE PASSED THROUGH TO YOU, NOR SHALL YOU CLAIM TO BE A THIRD PARTY BENEFICIARY OF SUCH WARRANTIES." ]
                    , p []
                        [ text "15.2.2. THE WARRANTY DISCLAIMERS CONTAINED IN THIS AGREEMENT EXTEND TO ANY ORAL OR WRITTEN INFORMATION YOU MAY HAVE RECEIVED FROM Wayback Download, ITS EMPLOYEES, THIRD-PARTY VENDORS, AGENTS OR AFFILIATES. YOU MAY NOT RELY ON SUCH INFORMATION." ]
                    , p []
                        [ text "15.2.3. SOME STATES DO NOT ALLOW Wayback Download TO EXCLUDE CERTAIN WARRANTIES. IF THIS APPLIES TO YOU, YOUR WARRANTY IS LIMITED TO NINETY (90) DAYS FROM THE EFFECTIVE DATE." ]
                    , p []
                        [ text "15.3. The parties expressly disclaim the applicability of the United Nations Convention on the International Sale of Goods." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "16. Limitation of Liability" ]
                        ]
                    , p []
                        [ text "16.1. YOU ALSO ACKNOWLEDGE AND ACCEPT THAT ANY DAMAGES WILL BE LIMITED TO NO MORE THAN THE FEES PAID BY YOU FOR ONE (1) MONTH OF SERVICE." ]
                    , p []
                        [ text "16.2. UNDER NO CIRCUMSTANCES, INCLUDING NEGLIGENCE, SHALL Wayback Download, ITS OFFICERS, AGENTS OR THIRD PARTIES PROVIDING SERVICES THROUGH Wayback Download, BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, COST SAVINGS, REVENUE, BUSINESS, DATA OR USE, OR ANY OTHER PECUNIARY LOSS BY YOU, ANY OF YOUR END USERS OR ANY THIRD PARTY; OR THAT RESULTS FROM MISTAKES, OMISSIONS, INTERRUPTIONS, DELETION OF FILES, ERRORS, DEFECTS, DELAYS IN OPERATION, OR TRANSMISSION OR ANY FAILURE OF PERFORMANCE, WHETHER OR NOT LIMITED TO ACTS OF GOD, COMMUNICATION FAILURE, THEFT, DESTRUCTION OR UNAUTHORIZED ACCESS TO Wayback Download RECORDS, PROGRAMS OR SERVICES. YOU AGREE THAT THIS PARAGRAPH APPLIES EVEN IF Wayback Download HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. YOU HEREBY ACKNOWLEDGE THAT THIS PARAGRAPH SHALL APPLY TO ALL CONTENTS ON ALL SERVERS AND ALL SERVICES. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES; YOU AGREE THAT IN THOSE JURISDICTIONS, Wayback Download'S LIABILITY WILL BE LIMITED TO THE EXTENT PERMITTED BY LAW." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "17. Indemnification" ]
                        ]
                    , p []
                        [ text "17.1. You agree to indemnify, defend and hold harmless Wayback Download, and its parent, subsidiary and affiliated companies, third party service providers and each of their respective officers, directors, employees, shareholders and agents (each an \"indemnified party\" and collectively, \"indemnified parties\") from and against any and all claims, damages, losses. liabilities, suits, actions, demands, proceedings (whether legal or administrative), and expenses (including, but not limited to, reasonable attorneys' fees) threatened, asserted, or filed by a third party against any of the indemnified parties arising out of, or relating to: (i) your use of the Services; (ii) any violation by you of any of Wayback Download's policies; (iii) any breach of any of your representations, warranties or covenants contained in this Agreement; or (iv) any acts or omissions by you. The terms of this section shall survive any termination of this Agreement. For the purpose of this paragraph only, the terms used to designate you include you, your customers, visitors to your website, and users of your products or services the use of which is facilities by Wayback Download." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "18. Governing Law and Disputes" ]
                        ]
                    , p []
                        [ text "18.1. This agreement shall be governed by the laws of Quebec, exclusive of its choice of law principles, and the laws of Canada, as applicable. Exclusive venue for all disputes arising out of or relating to this Agreement shall be the state and federal courts in Montreal,Quebec and each party agrees not to dispute such personal jurisdiction and waives all objections thereto." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "19. Partial Invalidity" ]
                        ]
                    , p []
                        [ text "19.1. If any provision of this Agreement is held to be invalid by a court of competent jurisdiction, then the remaining provisions shall nevertheless remain in full force and effect. Wayback Download and Customer agree to renegotiate any term held invalid and to be bound by mutually agreed substitute provision." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "20. Changes to the Terms of Service" ]
                        ]
                    , p []
                        [ text "20.1. Wayback Download reserves the right to modify this Agreement, in whole or in part, from time-to-time. Wayback Download will provide you with notices of such a change by posting notice on your control panel. Unless Wayback Download is required to make a change in an emergency, any change will be effective thirty (30) days after it is posted. If such a change materially diminishes your ability to use the Services, you may terminate this Agreement. You are encouraged to review the content of this Agreement on a regular basis." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "21. Assignment" ]
                        ]
                    , p []
                        [ text "21.1. This Agreement may be assigned by Wayback Download. It may not be assigned by you. This Agreement shall bind and inure to the benefit of the corporate successors and permitted assigns of the parties." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "22. Force Majeure" ]
                        ]
                    , p []
                        [ text "22.1. Except for the obligation to pay monies due and owing, neither party shall be liable for any delay or failure in performance due to events outside the defaulting party's reasonable control, including, without limitation, acts of God, earthquake, labor disputes, shortages of supplies, riots, war, fire, epidemics, failure of telecommunication carriers, or delays of common carriers or other circumstances beyond its reasonable control. The obligations and rights of the excused party shall be extended on a day-to-day basis for the time period equal to the period of the excusable delay. The party affected by such an occurrence shall notify the other party as soon as possible but in no event less than ten (10) days from the beginning of the event." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "23. No Waiver" ]
                        ]
                    , p []
                        [ text "23.1. No waiver of rights under this Agreement or any Wayback Download policy, or agreement between Customer and Wayback Download shall constitute a subsequent waiver of this or any other right under this Agreement." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "24. No Agency" ]
                        ]
                    , p []
                        [ text "24.1. This Agreement does not create any agency, partnership, joint venture, or franchise relationship. Neither party has the right or authority to, and shall not, assume or create any obligation of any nature whatsoever on behalf of the other party or bind the other party in any respect whatsoever." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "25. Survival" ]
                        ]
                    , p []
                        [ text "25.1. The following paragraphs shall survive the termination of this Agreement: 16 through 19, and 25." ]
                    , br []
                        []
                    , h4 []
                        [ strong []
                            [ text "26. HIPAA Disclaimer" ]
                        ]
                    , p []
                        [ text "26.1. We are not \"HIPAA compliant.\" Users are solely responsible for any applicable compliance with federal or state laws governing the privacy and security of personal data, including medical or other sensitive data. Users acknowledge that the Services may not be appropriate for the storage or control of access to sensitive data, such as information about children or medical or health information. Wayback Download does not control or monitor the information or data you store on, or transmit through, our Services. We specifically disclaim any representation or warranty that the Services, as offered, comply with the federal Health Insurance Portability and Accountability Act (\"HIPAA\"). Customers requiring secure storage of \"protected health information\" under HIPAA are expressly prohibited from using this Service for such purposes. Storing and permitting access to \"protected health information,\" as defined under HIPAA is a material violation of this User Agreement, and grounds for immediate account termination. We do not sign \"Business Associate Agreements\" and you agree that Wayback Download is not a Business Associate or subcontractor or agent of yours pursuant to HIPAA. If you have questions about the security of your data, you should ", a
                            [ Attr.href "mailto:support@wayback.download"
                            ]
                            [ text "contact customer support" ]
                        , text "." ]
                    ]
                ]
            ]
        ]
