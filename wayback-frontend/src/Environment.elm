module Environment exposing (EnvironmentVar, init)


type alias EnvironmentVar =
    { serverUrl : String
    , itemCost : Int
    , multiItemCost : Int
    , subscriptionCost : Int
    }


devHost : String
devHost =
    "0.0.0.0"


prodHost : String
prodHost =
    "wayback.download"



-- Init


init : String -> EnvironmentVar
init host =
    if host == devHost then
        EnvironmentVar "http://0.0.0.0:5000" 19 12 95

    else
        EnvironmentVar "https://api.wayback.download" 19 12 95
