module Domain.User exposing (User, userDecoder, userEncoder)

import Json.Decode as Decode exposing (Decoder, Value, bool, oneOf, string)
import Json.Decode.Pipeline exposing (required)
import Json.Encode as Encode


type alias User =
    { token: String
    , subscribed: Bool
    , admin: Bool
    }


userDecoder : Decoder User
userDecoder =
    Decode.succeed User
        |> required "token" string
        |> required "subscribed" bool
        |> required "admin" bool

userEncoder : Maybe User -> Value
userEncoder user =
    case user of
        Just user_ ->
            Encode.object
                [ ( "token", Encode.string user_.token)
                , ( "subscribed", Encode.bool user_.subscribed)
                , ( "admin", Encode.bool user_.admin)
                ]
        Nothing ->
            Encode.object []