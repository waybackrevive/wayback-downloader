module Common.Parsing exposing (cartParser)

import Parser exposing ((|.), (|=), Parser,  chompWhile, getChompedString, int, oneOf, succeed, symbol)
import Proto.Response exposing (CartItem)

{- Parses Wayback URL like this:
 https://web.archive.org/web/20220109115734/https://onintime.com/
-}

cartParser: Parser CartItem
cartParser =
    succeed CartItem
        |. symbol "https://web.archive.org/web/"
        |= (getChompedString <| chompWhile (\c -> Char.isDigit c))
        |. symbol "/"
        |. httpsParser
        |. httpParser
        |= (getChompedString <| chompWhile (\c -> c /= '/'))


httpParser : Parser (Maybe String)
httpParser =
    oneOf
        [ succeed Just
            |. symbol "https:"
            |= (getChompedString <| chompWhile (\c -> c == '/'))
        , succeed Nothing
        ]


httpsParser : Parser (Maybe String)
httpsParser =
    oneOf
        [ succeed Just
            |. symbol "http:/"
            |= (getChompedString <| chompWhile (\c -> c == '/'))
        , succeed Nothing
        ]