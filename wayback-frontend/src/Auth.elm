module Auth exposing
    ( beforeProtectedInit
    , User
    )

{-|

@docs User
@docs beforeProtectedInit

-}

import Domain.User exposing (User)
import ElmSpa.Page as ElmSpa
import Gen.Route exposing (Route)
import Request exposing (Request)
import Shared

type alias User =
    Domain.User.User

beforeProtectedInit : Shared.Model -> Request -> ElmSpa.Protected User Route
beforeProtectedInit shared req =
    case shared.storage.user of
        Just user ->
            ElmSpa.Provide user

        Nothing ->
            ElmSpa.RedirectTo Gen.Route.Login
