module LinguatronComputation where

type Point = (Int,Int)
type Stroke = [Point]
type Symbol = [Stroke]
type IsNewSymbol = Bool
type TrainingDatum = (String,IsNewSymbol,Symbol)
type TrainingData = [TrainingDatum] -- [(String,Bool,[[(Int,Int)]])]

data Class = Class String Symbol
type Data = [Class]

datum = ("cow",True,[[(0,0),(1,1)]])

addToTrainingData :: TrainingData -> TrainingDatum -> TrainingData
addToTrainingData xs x = (x:xs)
