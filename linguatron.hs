{-# LANGUAGE EmptyDataDecls #-}
module Linguatron where

import FFI
import LinguatronComputation

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

alert :: String -> Fay ()
alert = ffi "alert(%1)"

setBodyHtml :: String -> Fay ()
setBodyHtml = ffi "document.body.innerHTML = %1"

addWindowEvent :: String -> (Event -> Fay ()) -> Fay ()
addWindowEvent = ffi "window.addEventListener(%1, %2)"

greet :: Event -> Fay()
greet event = do
  putStrLn "The document has loaded"
  setBodyHtml "Hello HTML!"