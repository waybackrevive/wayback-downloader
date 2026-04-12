module Common.Response exposing (responseDecoder, Response, Receipt, Restore)

import Domain.User exposing (User)
import Json.Decode as Decode exposing (Decoder, bool, string)
import Json.Decode.Pipeline exposing (optional, required)

type alias Response =
    { error: String
    , status: String
    , data: Data
    }

type alias Data =
    { user: Maybe User
    , id: Maybe String
    , url: Maybe String
    , info: Maybe String
    , receipts: List(Maybe Receipt)
    , restores: List(Maybe Restore)
    , restore: Maybe Restore
    }

type alias Receipt =
    { id: String
    , url: String
    , date: String
    , amount: String
    }

type alias Restore =
    { id: String
    , timestamp: String
    , domain: String
    , status: String
    , s3Url: String
    , transactDate: String
    , username: String
    , email: String
    }

responseDecoder: Decoder Response
responseDecoder =
    Decode.succeed Response
        |> required "error" string
        |> required "status" string
        |> required "data" dataDecoder

dataDecoder: Decoder Data
dataDecoder =
    Decode.succeed Data
        |> optional "user" (Decode.map Just userDecoder) Nothing
        |> optional "id" (Decode.map Just string) Nothing
        |> optional "url" (Decode.map Just string) Nothing
        |> optional "info" (Decode.map Just string) Nothing
        |> optional "receipts" (Decode.list (Decode.map Just receiptDecoder)) []
        |> optional "restores" (Decode.list (Decode.map Just restoreDecoder)) []
        |> optional "restore" (Decode.map Just restoreDecoder) Nothing

receiptDecoder: Decoder Receipt
receiptDecoder =
    Decode.succeed Receipt
        |> required "id" string
        |> required "url" string
        |> required "date" string
        |> required "amount" string

userDecoder: Decoder User
userDecoder =
    Decode.succeed User
            |> required "id_token" string
            |> required "subscribed" bool
            |> required "admin" bool

restoreDecoder: Decoder Restore
restoreDecoder =
    Decode.succeed Restore
        |> required "id" string
        |> required "timestamp" string
        |> required "domain" string
        |> required "status" string
        |> required "s3Url" string
        |> required "transactDate" string
        |> required "username" string
        |> required "email" string