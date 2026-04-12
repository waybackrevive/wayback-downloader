module Common.Spinner exposing (viewSpinnerText, viewSpinnerSymbol)

import Html exposing (Html, span, text)
import Html.Attributes as Attr

viewSpinnerText: List(Html msg)
viewSpinnerText =
    [ span
        [ Attr.class "spinner-border spinner-border-sm"
        , Attr.attribute "role" "status"
        , Attr.attribute "aria-hidden" "true"
        ]
        []
    , text " Loading..."
    ]

viewSpinnerSymbol: Html msg
viewSpinnerSymbol =
    span
        [ Attr.class "spinner-border spinner-border-sm"
        , Attr.attribute "role" "status"
        , Attr.attribute "aria-hidden" "true"
        ]
        []
