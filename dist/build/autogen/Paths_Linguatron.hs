module Paths_Linguatron (
    version,
    getBinDir, getLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
catchIO = Exception.catch


version :: Version
version = Version {versionBranch = [0,1], versionTags = []}
bindir, libdir, datadir, libexecdir, sysconfdir :: FilePath

bindir     = "/Users/reillyi/Library/Haskell/bin"
libdir     = "/Users/reillyi/Library/Haskell/ghc-7.8.3-x86_64/lib/Linguatron-0.1"
datadir    = "/Users/reillyi/Library/Haskell/share/ghc-7.8.3-x86_64/Linguatron-0.1"
libexecdir = "/Users/reillyi/Library/Haskell/libexec"
sysconfdir = "/Users/reillyi/Library/Haskell/etc"

getBinDir, getLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath
getBinDir = catchIO (getEnv "Linguatron_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "Linguatron_libdir") (\_ -> return libdir)
getDataDir = catchIO (getEnv "Linguatron_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "Linguatron_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "Linguatron_sysconfdir") (\_ -> return sysconfdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
