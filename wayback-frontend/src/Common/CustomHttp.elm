module Common.CustomHttp exposing (expectJson, expectProto)

import Http exposing (Expect, expectStringResponse, expectBytesResponse)
import Json.Decode as Decode
import Protobuf.Decode as ProtoDecode


expectJson : (Result Http.Error a -> msg) -> Decode.Decoder a -> Expect msg
expectJson toMsg decoder =
  expectStringResponse toMsg <|
    \response ->
      case response of
        Http.BadUrl_ url ->
            Err (Http.BadUrl url)

        Http.Timeout_ ->
            Err Http.Timeout

        Http.NetworkError_ ->
            Err Http.NetworkError

        Http.BadStatus_ metadata body ->
            if metadata.statusCode == 422 then
                case Decode.decodeString decoder body of
                    Ok value ->
                        Ok value
                    Err err ->
                        Err (Http.BadBody (Decode.errorToString err))
            else
                Err (Http.BadStatus metadata.statusCode)

        Http.GoodStatus_ _ body ->
            case Decode.decodeString decoder body of
                Ok value ->
                    Ok value
                Err err ->
                    Err (Http.BadBody (Decode.errorToString err))


expectProto : (Result Http.Error a -> msg) -> ProtoDecode.Decoder a -> Http.Expect msg
expectProto toMsg decoder =
  expectBytesResponse toMsg <|
    \response ->
      case response of
          Http.BadUrl_ url ->
              Err (Http.BadUrl url)

          Http.Timeout_ ->
              Err Http.Timeout

          Http.NetworkError_ ->
              Err Http.NetworkError

          Http.BadStatus_ metadata body ->
              if metadata.statusCode == 422 then
                  case ProtoDecode.decode decoder body of
                      Just value ->
                          Ok value

                      Nothing ->
                          Err (Http.BadBody "Protobuf decoder error")
              else
                  Err (Http.BadStatus metadata.statusCode)

          Http.GoodStatus_ _ body ->
              case ProtoDecode.decode decoder body of
                  Just value ->
                      Ok value

                  Nothing ->
                      Err (Http.BadBody "Protobuf decoder error")