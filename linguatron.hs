{-# LANGUAGE EmptyDataDecls #-}
module Linguatron where

import FFI
import qualified LinguatronComputation as L

{-
LinguatronComputation.hs contains all the pure
code for Linguatron. The purpose of this wrapper
is so I can load LinguatronComputation.hs into
GHCi for most development, but run 
fay linguatron.hs --strict Linguatron
to make the JS. If there was just one file,
GHCi would complain about the FFI module.
-}

data Event

setBodyHtml :: String -> Fay ()
setBodyHtml = ffi "document.body.innerHTML = %1"

addWindowEvent :: String -> (Event -> Fay ()) -> Fay ()
addWindowEvent = ffi "window.addEventListener(%1, %2)"

greet :: Event -> Fay()
greet event = do
  putStrLn "The document has loaded"
  setBodyHtml "Hello HTML!"
{-
printTrainingData :: L.TrainingData -> Fay ()
printTrainingData x = setPrinted $ show x

setPrinted :: String -> Fay ()
setPrinted s = ffi "printed = %1" :: String -> Fay ()
-}
sendData :: L.TrainingData -> Fay ()
sendData d = sendMail "Linguatron Data" (show d)

sendMail :: String -> String -> Fay ()
sendMail = ffi "sendMail(%1,%2)"

jshow :: L.TrainingData -> String
jshow d = show d


datum = L.datum
addToTrainingData = L.addToTrainingData
